import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

// Produce web copies only. Never change the user's PNGs or native Blender scene.
const sourceFolder = 'C:/Users/HP/Desktop/9月初第三版AI作品集/素材';
const targetFolder = path.resolve('assets/works/home-creation');
const ffmpeg = 'F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe';
const descriptions = [
  { file: '主页面.png', copy: 'source-01-clay.png', web: 'frame-01.webp', title: '白模 · 空间与结构', alt: '原生建筑白模：中央钟楼、左侧书房与右侧回廊', crop: { x: 12, y: 76, width: 1294, height: 716 } },
  { file: '主页面2.png', copy: 'source-02-cycles.png', web: 'frame-02.webp', title: '渲染 · 材质与光线', alt: '暖色灯光下的铜钟楼、石墙与庭院地面反射' },
  { file: '主页面3.png', copy: 'source-03-native.png', web: 'frame-03.webp', title: '原生场景 · Blender 工作视图', alt: 'Blender 5.1.2 中的完整庭院场景、建筑、树木、相机和对象面板', lossless: true },
];

function pngSize(buffer) {
  if (buffer.subarray(1, 4).toString() !== 'PNG') throw new Error('Expected a PNG source');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

await fs.mkdir(targetFolder, { recursive: true });
const frames = [];
const sources = [];
for (const item of descriptions) {
  const sourcePath = path.join(sourceFolder, item.file);
  const bytes = await fs.readFile(sourcePath);
  const size = pngSize(bytes);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  await fs.writeFile(path.join(targetFolder, item.copy), bytes);
  const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', sourcePath];
  if (item.crop) {
    if (item.crop.x + item.crop.width > size.width || item.crop.y + item.crop.height > size.height) throw new Error('Crop exceeds source image');
    args.push('-vf', `crop=${item.crop.width}:${item.crop.height}:${item.crop.x}:${item.crop.y}`);
  }
  args.push('-frames:v', '1', '-c:v', 'libwebp', '-compression_level', '6');
  if (item.lossless) args.push('-lossless', '1');
  else args.push('-quality', '96');
  args.push(path.join(targetFolder, item.web));
  const result = spawnSync(ffmpeg, args, { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error(result.stderr || 'FFmpeg conversion failed');
  sources.push({ file: item.copy, originalFile: item.file, ...size, sha256, cropForWeb: item.crop || null });
  frames.push({
    src: './assets/works/home-creation/' + item.web,
    image: item.web,
    title: item.title,
    alt: item.alt,
    width: item.crop?.width || size.width,
    height: item.crop?.height || size.height,
    position: '50% 50%',
    fit: 'contain',
    sourceSha256: sha256,
  });
}

const manifest = {
  type: 'home-creation',
  title: '主页创作',
  english: 'A WORLD TO WANDER',
  source: '用户提供的三张主页制作图；完整 PNG 原件与网页展示副本分开保存。',
  sources,
  frames,
  views: [[0, 1], [2, 1]],
  gallerySelection: [0, 1, 2, 1],
  galleryMode: 'manual',
};
await fs.writeFile(path.join(targetFolder, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ targetFolder, sources, frames: frames.map(({ src, width, height }) => ({ src, width, height })), views: manifest.views }, null, 2));
