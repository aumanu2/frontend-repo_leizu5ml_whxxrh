import React, { useEffect, useMemo, useState } from 'react';
import { Palette, Pencil, Layers, ChevronRight } from 'lucide-react';

function toGrayscale(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        data[i] = data[i + 1] = data[i + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

const methods = [
  { key: 'pencil', label: 'Pencil', icon: Pencil },
  { key: 'cross', label: 'Cross-Hatching', icon: Layers },
  { key: 'shading', label: 'Soft Shading', icon: Palette },
];

export default function SketchMode({ source, onDone, onPaint }) {
  const [method, setMethod] = useState(methods[0].key);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gray, setGray] = useState(null);

  useEffect(() => {
    if (!source) return;
    toGrayscale(source).then(setGray);
  }, [source]);

  const steps = useMemo(() => {
    // Synthetic steps for demo: outline -> mid lines -> texture -> shading
    const total = 6;
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [method]);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const reset = () => {
    setStep(0);
    setPlaying(false);
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl px-6 text-white">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Sketch Mode</h3>
            <div className="text-sm text-white/70">Step {Math.min(step, steps.length)} / {steps.length}</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {methods.map((m) => {
              const Icon = m.icon;
              const active = method === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => { setMethod(m.key); reset(); }}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 transition ${active ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  <Icon className="h-4 w-4" /> {m.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid min-h-[360px] place-items-center rounded-xl bg-black/30 p-4">
            {!gray ? (
              <div className="text-white/70">Preparing grayscale…</div>
            ) : (
              <div className="relative w-full max-w-2xl">
                <img src={gray} alt="grayscale" className="w-full rounded-md object-contain" />
                {/* Simulated progressive strokes overlay */}
                <div className="absolute inset-0">
                  {steps.map((s) => (
                    <div
                      key={s}
                      className={`absolute inset-0 transition-opacity duration-500 ${s <= step ? 'opacity-100' : 'opacity-0'}`}
                      style={{ mixBlendMode: 'multiply' }}
                    >
                      <img src={gray} alt="layer" className="w-full rounded-md object-contain" style={{ filter: `contrast(${100 + s * 8}%) brightness(${100 - s * 4}%)` }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="rounded-full bg-white px-4 py-2 text-black"
              >
                {playing ? 'Pause' : 'Play steps'}
              </button>
              <button onClick={reset} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onDone} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                Done
              </button>
              <button onClick={onPaint} className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-4 py-2 font-medium text-black hover:bg-lime-300">
                Paint <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="font-semibold">Guidance</h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-white/80">
              <li>Start with light outlines to capture proportions.</li>
              <li>Add structural lines using {method.replace('-', ' ')} technique.</li>
              <li>Refine edges and add texture.</li>
              <li>Build up shadows gradually.</li>
              <li>Deepen contrast for focal areas.</li>
              <li>Final pass to unify tones.</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/70">Progress</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-lime-400"
                style={{ width: `${(Math.min(step, steps.length) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
