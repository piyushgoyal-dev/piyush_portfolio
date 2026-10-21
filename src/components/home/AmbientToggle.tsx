import { useEffect, useRef, useState } from 'react';
import windUrl from '@/Assets/MountainWind.mp3';

// Comfort settings for the ambience (tweak here).
const TARGET_RMS_DB = -27; // average loudness: soft background, but clearly audible
const MAX_PEAK_DB = -6; // the loudest gust never goes above this
const HIGH_SHELF = { frequency: 6000, gainDb: -4 }; // tame hiss so it never feels sharp
const FADE_IN = 2.5; // seconds
const FADE_OUT = 1.2; // seconds
const LOOP_CROSSFADE = 2; // seconds blended at the loop point so it never "restarts"
const EDGE_TRIM = 0.03; // seconds of encoder silence removed from each end of the MP3

const toDb = (x: number) => 20 * Math.log10(Math.max(x, 1e-9));

/** Gain that brings the clip to TARGET_RMS_DB without pushing its peak past MAX_PEAK_DB. */
function comfortGain(buffer: AudioBuffer) {
  let peak = 0;
  let sum = 0;
  let n = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    for (let i = 0; i < d.length; i++) {
      const v = Math.abs(d[i]);
      if (v > peak) peak = v;
      sum += d[i] * d[i];
      n++;
    }
  }
  const rmsDb = toDb(Math.sqrt(sum / n));
  const gainDb = Math.min(TARGET_RMS_DB - rmsDb, MAX_PEAK_DB - toDb(peak));
  return Math.pow(10, gainDb / 20);
}

/** Copy of the clip whose end is crossfaded into its start, so `loop = true` is seamless. */
function seamlessLoop(ctx: AudioContext, src: AudioBuffer) {
  const rate = src.sampleRate;
  const trim = Math.round(EDGE_TRIM * rate);
  const fade = Math.round(LOOP_CROSSFADE * rate);
  const usable = src.length - trim * 2;
  const length = usable - fade;
  const out = ctx.createBuffer(src.numberOfChannels, length, rate);
  for (let c = 0; c < src.numberOfChannels; c++) {
    const input = src.getChannelData(c).subarray(trim, trim + usable);
    const output = out.getChannelData(c);
    output.set(input.subarray(0, length));
    for (let i = 0; i < fade; i++) {
      const t = i / fade; // equal-power crossfade: tail fades out while the head fades in
      output[i] = input[i] * Math.sin((t * Math.PI) / 2) + input[length + i] * Math.cos((t * Math.PI) / 2);
    }
  }
  return out;
}

interface Chain {
  ctx: AudioContext;
  gain: GainNode;
  level: number;
}

/** "Ambience" toggle with a 4-bar equaliser. Off by default; plays the mountain-wind loop. */
export function AmbientToggle({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const chain = useRef<Promise<Chain> | null>(null);

  // Built once, on the first click (browsers only allow audio after a user gesture).
  const getChain = () => {
    chain.current ??= (async () => {
      const ctx = new AudioContext();
      const decoded = await ctx.decodeAudioData(await (await fetch(windUrl)).arrayBuffer());
      const source = ctx.createBufferSource();
      source.buffer = seamlessLoop(ctx, decoded);
      source.loop = true;

      const shelf = ctx.createBiquadFilter();
      shelf.type = 'highshelf';
      shelf.frequency.value = HIGH_SHELF.frequency;
      shelf.gain.value = HIGH_SHELF.gainDb;

      const compressor = ctx.createDynamicsCompressor(); // catches any sudden gust
      compressor.threshold.value = -24;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.05;
      compressor.release.value = 0.4;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(shelf).connect(compressor).connect(gain).connect(ctx.destination);
      source.start();
      return { ctx, gain, level: comfortGain(decoded) };
    })();
    return chain.current;
  };

  const toggle = async () => {
    const next = !on;
    setOn(next);
    if (next) setLoading(true);
    try {
      const { ctx, gain, level } = await getChain();
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      if (next) {
        await ctx.resume();
        gain.gain.linearRampToValueAtTime(level, now + FADE_IN);
      } else {
        gain.gain.linearRampToValueAtTime(0, now + FADE_OUT);
      }
    } catch {
      setOn(false); // couldn't load/play audio: show it as off
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => () => {
      void chain.current?.then(({ ctx }) => ctx.close());
    },
    []
  );

  const playing = on && !loading;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-busy={loading}
      aria-label="Ambient sound"
      className={`group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone ${className}`}
    >
      Ambience
      <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
        {[0.9, 0.5, 1, 0.7].map((d, i) => (
          <span
            key={i}
            className={`block w-[3px] origin-bottom rounded-full ${on ? 'bg-amber' : 'bg-bone-dim'}`}
            style={{
              height: '100%',
              transform: playing ? undefined : 'scaleY(0.3)',
              animation: playing ? `eq-bar ${0.7 + d * 0.5}s ease-in-out ${i * 0.12}s infinite` : 'none',
            }}
          />
        ))}
      </span>
    </button>
  );
}
