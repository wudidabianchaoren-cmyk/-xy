"""Original deterministic Yang Jian scrollytelling sound, using existing local tools.

Run once: python scripts/yangjian-audio-v107.py
Read-only codec/PCM verification: python scripts/yangjian-audio-v107.py --verify-only
No recordings, downloaded samples, paid APIs, dependency installs, or SBS audio.
The string voices are authored additive timbres, not recordings of instruments.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import pathlib
import shutil
import subprocess
import sys
import wave
from datetime import datetime, timezone

try:
    import numpy as np
except ImportError:
    # Reuse the installed cache already used by this portfolio's local soundtracks.
    sys.path.insert(0, "E:/Brain-Universe-assets/V32-69/python-deps")
    import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "yangjian-v107" / "audio"
SR = 44100
SEED = 10720261014
FFMPEG = shutil.which("ffmpeg")
FFPROBE = shutil.which("ffprobe")
TAU = math.tau
TRACKS: dict[str, dict] = {
    "memory": {
        "duration": 64.0, "loop": True, "peak_dbfs": -12.0,
        "recommended_gain": 0.48,
        "composition": "Original D minor pentatonic motif, long plucked-string decays, soft bowed D/A/C pads, quiet air; 60 BPM with space between phrases.",
    },
    "storm": {
        "duration": 24.0, "loop": True, "peak_dbfs": -14.0,
        "recommended_gain": 0.44,
        "composition": "Circular filtered wind and soft rain, three restrained low membrane drums, two distant rolling thunders; no melody or voices.",
    },
    "ascent": {
        "duration": 32.0, "loop": True, "peak_dbfs": -12.0,
        "recommended_gain": 0.44,
        "composition": "Sparse low membrane pulses, rising D minor pentatonic bowed layers, occasional resonant plucks and restrained mountain air.",
    },
    "strike": {
        "duration": 3.2, "loop": False, "peak_dbfs": -9.0,
        "recommended_gain": 0.65,
        "composition": "A short synthetic rock fracture followed by a deep modal impact, falling stone ticks and a dark chamber tail; one scroll cue.",
    },
}


def midi(note: float) -> float:
    return 440.0 * 2.0 ** ((note - 69.0) / 12.0)


def seconds_time(duration: float) -> np.ndarray:
    return np.arange(round(duration * SR), dtype=np.float64) / SR


def periodic_noise(n: int, rng: np.random.Generator, low: float,
                   high: float, slope: float = 0.0) -> np.ndarray:
    """FFT-shaped noise is periodic over its full array, including the seam."""
    f = np.fft.rfftfreq(n, 1.0 / SR)
    safe_f = np.maximum(f, 1.0)
    shape = (safe_f / 120.0) ** (-slope)
    shape *= 1.0 / np.sqrt(1.0 + (low / safe_f) ** 8)
    shape *= 1.0 / np.sqrt(1.0 + (safe_f / high) ** 8)
    shape[0] = 0.0
    y = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * shape, n=n)
    return y / max(float(np.sqrt(np.mean(y * y))), 1e-12)


def add_event(audio: np.ndarray, at: float, mono: np.ndarray,
              gain: float = 1.0, pan: float = 0.0, loop: bool = True) -> None:
    """Equal-power modest panning; wrap event tails into the loop's head."""
    angle = (min(1.0, max(-1.0, pan)) + 1.0) * math.pi / 4.0
    stereo = mono[:, None] * np.array([math.cos(angle), math.sin(angle)]) * gain
    start = round(at * SR)
    if loop:
        position = 0
        while position < len(stereo):
            target = (start + position) % len(audio)
            count = min(len(stereo) - position, len(audio) - target)
            audio[target:target + count] += stereo[position:position + count]
            position += count
    elif start < len(audio):
        count = min(len(stereo), len(audio) - start)
        audio[start:start + count] += stereo[:count]


def pluck(note: float, rng: np.random.Generator, duration: float = 7.0,
          brightness: float = 1.0) -> np.ndarray:
    t = seconds_time(duration)
    base = midi(note)
    signal = np.zeros(len(t))
    # Slight string stiffness, a close second string, high partials dying earlier.
    for harmonic in range(1, 18):
        stiffness = math.sqrt(1.0 + 0.000042 * harmonic * harmonic)
        decay = 0.38 + 0.092 * harmonic ** 1.28
        amplitude = math.sin(harmonic * math.pi * 0.183) / harmonic ** 1.08
        amplitude *= math.exp(-harmonic / (9.5 * brightness))
        frequency = base * harmonic * stiffness
        partial = np.sin(TAU * frequency * t)
        partial += 0.21 * np.sin(TAU * frequency * 1.00065 * t + harmonic * 0.11)
        signal += amplitude * partial * np.exp(-t * decay)
    body = sum(np.sin(TAU * f * t) * np.exp(-t * rate) * gain
               for f, rate, gain in [(139.0, 8.0, 0.028), (233.0, 7.0, 0.023), (417.0, 11.0, 0.011)])
    contact = periodic_noise(len(t), rng, 1200.0, 5300.0, 0.05) * np.exp(-t * 88.0) * 0.016
    signal = (signal + body + contact) * (1.0 - np.exp(-t / 0.0025))
    signal *= np.clip((duration - t) / 0.14, 0.0, 1.0)
    return signal


def bowed(note: float, duration: float = 12.0, color: float = 0.0) -> np.ndarray:
    t = seconds_time(duration)
    base = midi(note)
    # Slow bow attack/release, gentle vibrato and very restrained harmonic color.
    envelope = np.sin(math.pi * t / duration) ** 1.8
    signal = np.zeros(len(t))
    for detune, weight in [(-0.00072, 0.34), (0.0, 0.66), (0.00069, 0.31)]:
        vibrato = 0.00115 * base / 5.2 * (1.0 - np.cos(TAU * 5.2 * t + color))
        phase = TAU * (base * (1.0 + detune) * t + vibrato)
        for harmonic in range(1, 8):
            amplitude = math.exp(-harmonic / 3.1) / harmonic ** 1.3
            signal += weight * amplitude * np.sin(harmonic * phase + color * harmonic)
    return signal * envelope


def drum(base: float, rng: np.random.Generator, duration: float = 2.2) -> np.ndarray:
    t = seconds_time(duration)
    signal = np.zeros(len(t))
    for ratio, amplitude, decay in [(1.0, 1.0, 3.8), (1.52, 0.33, 5.3), (2.03, 0.17, 7.8), (2.73, 0.07, 11.0)]:
        phase = TAU * base * ratio * (t + 0.021 * (1.0 - np.exp(-t * 17.0)))
        signal += np.sin(phase) * amplitude * np.exp(-t * decay)
    contact = periodic_noise(len(t), rng, 180.0, 1400.0, 0.5) * np.exp(-t * 35.0) * 0.08
    return (signal + contact) * (1.0 - np.exp(-t * 800.0))


def thunder(rng: np.random.Generator, duration: float = 6.0) -> np.ndarray:
    t = seconds_time(duration)
    roll = periodic_noise(len(t), rng, 24.0, 510.0, 0.8)
    cracks = periodic_noise(len(t), rng, 200.0, 1850.0, 0.2)
    envelope = (1.0 - np.exp(-t * 5.0)) * np.exp(-t * 0.77)
    envelope *= 0.72 + 0.19 * np.sin(TAU * 2.4 * t) + 0.09 * np.sin(TAU * 4.1 * t + 1.1)
    return roll * envelope + cracks * np.exp(-t * 4.0) * 0.09


def reverb(audio: np.ndarray, wet: float, loop: bool) -> np.ndarray:
    """A deterministic dark multitap room; circular routing keeps loops continuous."""
    n = len(audio)
    f = np.fft.rfftfreq(n, 1.0 / SR)
    damping = 1.0 / np.sqrt(1.0 + (f / 2300.0) ** 6)
    dark = np.fft.irfft(np.fft.rfft(audio, axis=0) * damping[:, None], n=n, axis=0)
    tail = np.zeros_like(audio)
    taps = [(0.079, 0.21), (0.147, 0.18), (0.263, 0.17), (0.421, 0.15),
            (0.677, 0.14), (0.967, 0.12), (1.331, 0.105), (1.877, 0.085),
            (2.461, 0.064), (3.137, 0.043), (4.073, 0.026)]
    for i, (delay, gain) in enumerate(taps):
        for channel in range(2):
            source = dark[:, channel if i % 3 else 1 - channel]
            samples = round((delay + (channel * 0.006 if i % 2 else -channel * 0.005)) * SR)
            if loop:
                tail[:, channel] += np.roll(source, samples) * gain
            else:
                tail[samples:, channel] += source[:-samples] * gain
    return audio + wet * tail


def air_bed(audio: np.ndarray, duration: float, rng: np.random.Generator,
            gain: float, high: float = 1400.0) -> None:
    t = seconds_time(duration)
    shared = periodic_noise(len(audio), rng, 85.0, high, 0.4)
    detail = periodic_noise(len(audio), rng, 270.0, high, 0.25)
    # Integer-cycle modulation and periodic noise: no arbitrary start/end fade.
    swell = 0.82 + 0.12 * np.sin(TAU * t * 2.0 / duration + 0.4)
    swell += 0.06 * np.sin(TAU * t * 5.0 / duration + 1.3)
    audio[:, 0] += gain * swell * (shared + detail * 0.13)
    audio[:, 1] += gain * swell * (shared + np.roll(detail, round(SR * 0.008)) * 0.13)


def make_memory(rng: np.random.Generator) -> tuple[np.ndarray, list]:
    duration = 64.0
    audio = np.zeros((round(SR * duration), 2))
    # Authored eight phrases, all notes in D-F-G-A-C, with breath after each phrase.
    phrases = [
        [(0.35, 62, 0.16), (2.4, 69, 0.13), (3.75, 67, 0.11), (5.5, 65, 0.12)],
        [(8.35, 62, 0.15), (10.8, 65, 0.12), (12.1, 67, 0.11), (13.8, 69, 0.14)],
        [(16.35, 72, 0.12), (18.2, 69, 0.14), (20.75, 67, 0.11), (22.1, 65, 0.095)],
        [(24.35, 62, 0.15), (27.25, 57, 0.11), (29.7, 60, 0.085)],
        [(32.35, 62, 0.14), (34.75, 65, 0.12), (36.25, 69, 0.11), (37.8, 67, 0.095)],
        [(40.35, 65, 0.13), (42.5, 67, 0.12), (44.8, 72, 0.12), (46.2, 69, 0.12)],
        [(48.35, 67, 0.12), (50.4, 65, 0.1), (52.8, 62, 0.13), (54.75, 60, 0.08)],
        [(56.35, 57, 0.11), (59.0, 60, 0.08), (61.25, 62, 0.10)],
    ]
    events = [note for phrase in phrases for note in phrase]
    for i, (at, note, gain) in enumerate(events):
        add_event(audio, at, pluck(note, rng), gain, 0.13 * math.sin(i * 1.7))
    for at, chord in [(0.0, [50, 57]), (16.0, [48, 55]), (32.0, [53, 60]), (48.0, [50, 57])]:
        for i, note in enumerate(chord):
            add_event(audio, at - 3.0, bowed(note, 22.0, i * 0.41), 0.025, (-0.12 if i else 0.12))
    air_bed(audio, duration, rng, 0.0016, 1700.0)
    return reverb(audio, 0.45, True), events


def make_storm(rng: np.random.Generator) -> tuple[np.ndarray, list]:
    duration = 24.0
    audio = np.zeros((round(SR * duration), 2))
    air_bed(audio, duration, rng, 0.026, 1150.0)
    t = seconds_time(duration)
    shared = periodic_noise(len(audio), rng, 1200.0, 4300.0, 0.3)
    detail = periodic_noise(len(audio), rng, 1550.0, 4900.0, 0.2)
    rain_swell = 0.9 + 0.1 * np.sin(TAU * t * 3.0 / duration + 0.6)
    audio[:, 0] += rain_swell * (shared * 0.006 + detail * 0.0017)
    audio[:, 1] += rain_swell * (shared * 0.006 + np.roll(detail, 293) * 0.0017)
    events = [[3.2, "distant drum"], [8.6, "distant drum"], [18.4, "distant drum"],
              [2.8, "rolling thunder"], [13.4, "rolling thunder"]]
    for at, gain in [(3.2, 0.022), (8.6, 0.017), (18.4, 0.025)]:
        add_event(audio, at, drum(43.0, rng), gain)
    for at, pan in [(2.8, -0.13), (13.4, 0.12)]:
        add_event(audio, at, thunder(rng), 0.034, pan)
    return reverb(audio, 0.22, True), events


def make_ascent(rng: np.random.Generator) -> tuple[np.ndarray, list]:
    duration = 32.0
    audio = np.zeros((round(SR * duration), 2))
    air_bed(audio, duration, rng, 0.004, 950.0)
    events = []
    for i, at in enumerate([0.4, 4.4, 7.9, 12.4, 16.4, 21.1, 25.3, 29.0]):
        gain = [0.057, 0.034, 0.041, 0.050][i % 4]
        add_event(audio, at, drum(48.0 if i % 3 else 43.5, rng), gain)
        events.append([at, "low pulse"])
    chords = [(0.0, [50, 57]), (8.0, [53, 60]), (16.0, [55, 62]), (24.0, [57, 62])]
    for at, chord in chords:
        for i, note in enumerate(chord):
            add_event(audio, at - 2.0, bowed(note, 15.0, (i + 1) * 0.28), 0.055, (-0.16 if i else 0.16))
        events.append([at, chord])
    for at, note, gain in [(2.1, 62, 0.05), (10.8, 65, 0.045), (18.2, 67, 0.055), (26.3, 69, 0.05)]:
        add_event(audio, at, pluck(note, rng, brightness=0.7), gain, 0.09)
    return reverb(audio, 0.56, True), events


def make_strike(rng: np.random.Generator) -> tuple[np.ndarray, list]:
    duration = 3.2
    audio = np.zeros((round(SR * duration), 2))
    t = seconds_time(duration)
    crack = periodic_noise(len(t), rng, 650.0, 6500.0, 0.2)
    crack_env = (1.0 - np.exp(-t * 1800.0)) * np.exp(-t * 46.0)
    # Stone fracture, separate from the drum-shaped sub impact.
    add_event(audio, 0.04, crack * crack_env, 0.085, loop=False)
    add_event(audio, 0.06, drum(37.0, rng, 3.0), 0.20, loop=False)
    stone = periodic_noise(len(t), rng, 38.0, 450.0, 0.65)
    add_event(audio, 0.065, stone * (1.0 - np.exp(-t * 38.0)) * np.exp(-t * 2.3), 0.055, loop=False)
    for i, at in enumerate([0.16, 0.28, 0.43, 0.65, 0.92]):
        local_t = seconds_time(0.3)
        ticks = periodic_noise(len(local_t), rng, 950.0, 4200.0, 0.2)
        ticks *= np.exp(-local_t * (25.0 + i * 4.0)) * (1.0 - np.exp(-local_t * 1300.0))
        add_event(audio, at, ticks, 0.013 * math.exp(-i * 0.25), (-1.0) ** i * 0.18, False)
    audio = reverb(audio, 0.39, False)
    audio *= np.minimum(1.0, (duration - t) / 0.48)[:, None]
    return audio, [[0.04, "stone crack"], [0.06, "deep impact"], [0.16, "falling stone ticks"]]


def db(value: float) -> float:
    return 20.0 * math.log10(max(float(value), 1e-12))


def metrics(audio: np.ndarray, loop: bool) -> dict:
    peak = float(np.max(np.abs(audio)))
    rms = float(np.sqrt(np.mean(audio * audio)))
    deltas = np.abs(np.diff(audio, axis=0))
    seam = float(np.max(np.abs(audio[0] - audio[-1])))
    jump_limit = float(np.quantile(deltas, 0.999))
    segment = audio[:min(len(audio), SR * 8)].mean(axis=1)
    f = np.fft.rfftfreq(len(segment), 1.0 / SR)
    power = np.abs(np.fft.rfft(segment)) ** 2
    power_total = max(float(power.sum()), 1e-15)
    energy = {label: round(float(power[(f >= low) & (f < high)].sum()) / power_total, 6)
              for label, low, high in [("below_30Hz", 0, 30), ("30_to_250Hz", 30, 250),
                                       ("250_to_2000Hz", 250, 2000), ("2000_to_8000Hz", 2000, 8000),
                                       ("above_8000Hz", 8000, SR / 2 + 1)]}
    result = {
        "decoded_samples": len(audio), "decoded_duration_seconds": len(audio) / SR,
        "peak_dbfs": round(db(peak), 3), "rms_dbfs": round(db(rms), 3),
        "crest_db": round(db(peak) - db(rms), 3), "dc_abs_max": round(float(np.max(np.abs(audio.mean(axis=0)))), 9),
        "finite": bool(np.isfinite(audio).all()), "clipped_samples": int(np.count_nonzero(np.abs(audio) >= 0.999)),
        "stereo_correlation": round(float(np.corrcoef(audio.T)[0, 1]), 6),
        "channel_rms_balance_db": round(db(np.sqrt(np.mean(audio[:, 0] ** 2))) - db(np.sqrt(np.mean(audio[:, 1] ** 2))), 3),
        "first_8s_band_energy": energy,
    }
    if loop:
        result.update({"loop_seam_delta_dbfs": round(db(seam), 3),
                       "loop_seam_delta": round(seam, 9), "ordinary_delta_99_9pct": round(jump_limit, 9),
                       "loop_boundary_passed": bool(seam <= jump_limit * 1.25 + 0.00003)})
    return result


def decode(path: pathlib.Path) -> np.ndarray:
    result = subprocess.run([FFMPEG, "-v", "error", "-i", str(path), "-f", "f32le", "-acodec", "pcm_f32le", "-ar", str(SR), "-ac", "2", "-"], check=True, capture_output=True)
    return np.frombuffer(result.stdout, dtype="<f4").reshape(-1, 2)


def check_asset(name: str) -> dict:
    path = OUT / f"{name}.mp3"
    probe = json.loads(subprocess.run([FFPROBE, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)], check=True, capture_output=True, text=True).stdout)
    audio = decode(path)
    m = metrics(audio, TRACKS[name]["loop"])
    stream = probe["streams"][0]
    expected_samples = round(TRACKS[name]["duration"] * SR)
    passed = (m["finite"] and m["clipped_samples"] == 0 and m["peak_dbfs"] < -7.0
              and m["decoded_samples"] == expected_samples and m["stereo_correlation"] > 0.5
              and abs(m["channel_rms_balance_db"]) < 1.5 and m.get("loop_boundary_passed", True))
    return {"file": path.name, "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "codec": stream["codec_name"], "sample_rate": int(stream["sample_rate"]), "channels": stream["channels"],
            "bit_rate": int(stream.get("bit_rate", probe["format"].get("bit_rate", 0))),
            "container_duration_seconds": float(probe["format"]["duration"]),
            "pcm_checks": m, "checks_passed": bool(passed), **TRACKS[name]}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify-only", action="store_true")
    parser.add_argument("--overwrite", action="store_true", help="Explicitly regenerate; never needed to preview the page.")
    args = parser.parse_args()
    if not FFMPEG or not FFPROBE:
        raise RuntimeError("Use the existing FFmpeg toolchain; no automatic installation.")
    if args.verify_only:
        results = {name: check_asset(name) for name in TRACKS}
        print(json.dumps({"passed": all(r["checks_passed"] for r in results.values()), "tracks": results}, ensure_ascii=False, indent=2))
        return
    if any((OUT / f"{name}.mp3").exists() for name in TRACKS) and not args.overwrite:
        raise RuntimeError("Audio already exists. Use --verify-only for inspection; --overwrite only for an intentional sound revision.")
    OUT.mkdir(parents=True, exist_ok=True)
    makers = {"memory": make_memory, "storm": make_storm, "ascent": make_ascent, "strike": make_strike}
    results = {}
    for index, (name, specification) in enumerate(TRACKS.items()):
        rng = np.random.default_rng(SEED + index * 997)
        audio, events = makers[name](rng)
        # Width stays restrained and mono remains useful; no antiphase enhancement.
        mid = audio.mean(axis=1)
        side = (audio[:, 0] - audio[:, 1]) * 0.32
        audio = np.column_stack((mid + side, mid - side))
        audio -= audio.mean(axis=0)
        audio *= 10.0 ** (specification["peak_dbfs"] / 20.0) / max(float(np.max(np.abs(audio))), 1e-12)
        source_metrics = metrics(audio, specification["loop"])
        wav_path = OUT / f".{name}-encode.wav"
        mp3_path = OUT / f"{name}.mp3"
        with wave.open(str(wav_path), "wb") as handle:
            handle.setnchannels(2)
            handle.setsampwidth(2)
            handle.setframerate(SR)
            handle.writeframes(np.round(audio * 32767.0).astype("<i2").tobytes())
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(wav_path), "-codec:a", "libmp3lame", "-b:a", "160k",
                        "-write_xing", "1", "-id3v2_version", "3", "-metadata", f"title=Yang Jian - {name}",
                        "-metadata", "comment=Original deterministic local synthesis; no sampled source audio", str(mp3_path)], check=True)
        wav_path.unlink()  # Only this script's known temporary file inside its owned audio directory.
        results[name] = check_asset(name)
        results[name]["source_pcm_checks"] = source_metrics
        results[name]["score_events"] = events
        print(f"{name}: {results[name]['bytes']} bytes, decoded {results[name]['pcm_checks']['decoded_duration_seconds']} s, peak {results[name]['pcm_checks']['peak_dbfs']} dBFS, checks {results[name]['checks_passed']}", flush=True)
    production = {
        "version": "V32.107", "work": "Yang Jian / Split the Mountain", "created_utc": datetime.now(timezone.utc).isoformat(),
        "method": "Authored additive/modal synthesis, seeded circular spectral noise, equal-power panning, dark multitap circular room; existing Python/NumPy/FFmpeg only.",
        "seed": SEED, "sample_rate": SR, "numpy_version": np.__version__,
        "source_program": "scripts/yangjian-audio-v107.py", "source_sha256": hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
        "provenance": {"original_composition": True, "original_synthesis": True, "external_recordings": False,
                       "sbs_audio_copied": False, "paid_apis_used": False, "new_dependencies_installed": False,
                       "real_instrument_recording": False, "third_party_audio_assets": []},
        "playback": {"looping": "All three stem sample counts match their authored loop length. Events/reverb wrap and noise/modulation are circular. LAME/Xing gapless metadata is enabled.",
                     "browser_limit": "HTMLAudioElement loop scheduling depends on the browser; decoded seamless PCM does not guarantee sample-accurate scheduling in every browser.",
                     "chapter_crossfade_seconds": 1.8, "master_gain": 0.8,
                     "max_simultaneous_stems": 3, "recommended_strike_retrigger_seconds": 3.5,
                     "recommendations": "Use the per-track recommended_gain as a chapter maximum, multiply by chapter weights and a master gain of 0.8; hold memory low during storm/ascent and fade out when the page is hidden or sound is disabled."},
        "checks_passed": all(r["checks_passed"] for r in results.values()),
        "listening_review": "Not claimed; objective decoded PCM, spectrum, stereo, clipping and loop checks recorded. Final subjective review occurs in the page mix.",
        "tracks": results,
    }
    (OUT / "production.json").write_text(json.dumps(production, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if not production["checks_passed"]:
        raise RuntimeError("An objective audio check failed; inspect production.json before integration.")


if __name__ == "__main__":
    main()
