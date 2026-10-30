import {createReadStream} from 'node:fs';
import {copyFile, mkdir, stat, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

// Existing supplied film only: preserve the original, convert HEVC for browser
// playback at the same frame size/rate, and extract unaltered source frames.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = 'C:/Users/HP/Desktop/9月初第三版AI作品集/视频/中秋晚会完整.mp4';
const bin = 'F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin';
const assetDir = join(root, 'assets/works/mid-autumn');
const original = join(assetDir, 'source-original.mp4');
const playback = join(assetDir, 'mid-autumn-web.mp4');
const frames = [
  {file: 'poster.webp', seconds: 30, role: 'Wide live stage with virtual characters'},
  {file: 'still-live-stage.webp', seconds: 62, role: 'Live performers and instruments'},
  {file: 'still-ai-musicians.webp', seconds: 150, role: 'Virtual monkey musicians'},
];

async function exists(path) { return stat(path).then(() => true, () => false); }
async function sha256(path) {
  const digest = createHash('sha256');
  for await (const chunk of createReadStream(path)) digest.update(chunk);
  return digest.digest('hex');
}
function run(tool, args, capture = false) {
  const result = spawnSync(join(bin, `${tool}.exe`), args, {
    encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', windowsHide: true,
  });
  if (result.status !== 0) throw new Error(result.stderr || `${tool} exited ${result.status}`);
  return result.stdout;
}
function probe(path) {
  return JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries',
    'format=duration,size,format_name:stream=index,codec_type,codec_name,codec_tag_string,width,height,avg_frame_rate,pix_fmt,bit_rate',
    '-of', 'json', path], true));
}

await mkdir(assetDir, {recursive: true});
const inputProbe = probe(source);
const sourceSHA256 = await sha256(source);
if (!(await exists(original))) await copyFile(source, original);
const originalSHA256 = await sha256(original);
if (sourceSHA256 !== originalSHA256) throw new Error('Preserved original differs from supplied film; refusing to overwrite it.');

if (!(await exists(playback))) {
  const inputVideo = inputProbe.streams.find(s => s.codec_type === 'video');
  const inputAudio = inputProbe.streams.find(s => s.codec_type === 'audio');
  const isH264AAC = inputVideo?.codec_name === 'h264' && inputAudio?.codec_name === 'aac';
  run('ffmpeg', ['-hide_banner', '-loglevel', 'warning', '-y', '-i', original,
    '-map', '0:v:0', '-map', '0:a:0', ...(isH264AAC ? ['-c', 'copy'] : [
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-threads', '6',
    ]), '-movflags', '+faststart', '-map_metadata', '-1', playback]);
}
const outputProbe = probe(playback);
if (outputProbe.streams.find(s => s.codec_type === 'video')?.codec_name !== 'h264')
  throw new Error('Playback file must contain H.264 video.');

for (const frame of frames) {
  const filePath = join(assetDir, frame.file);
  if (!(await exists(filePath))) run('ffmpeg', ['-hide_banner', '-loglevel', 'warning', '-y', '-ss',
    String(frame.seconds), '-i', original, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '92', filePath]);
  frame.sha256 = await sha256(filePath);
  frame.bytes = (await stat(filePath)).size;
}
const manifest = {
  source, sourceSHA256, original: 'source-original.mp4', originalSHA256,
  playback: 'mid-autumn-web.mp4', playbackSHA256: await sha256(playback),
  originalProbe: inputProbe, playbackProbe: outputProbe,
  preparation: 'HEVC to H.264 CRF 18 fast; source resolution and frame rate preserved; AAC stream copied; MP4 faststart',
  sourceFrames: frames,
  claim: 'No generative repair, reframing, recoloring, new scene render, or source footage substitution.',
};
await writeFile(join(assetDir, 'metadata.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(manifest, null, 2));
