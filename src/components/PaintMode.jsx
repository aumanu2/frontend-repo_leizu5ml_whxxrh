import React, { useMemo, useRef, useState } from 'react';
import { Droplet, RotateCcw, Check, Plus } from 'lucide-react';

export default function PaintMode({ baseImage, onDone, onNew }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#ff6b6b');
  const [size, setSize] = useState(8);
  const [mix, setMix] = useState('#4dabf7');
  const [isPainting, setIsPainting] = useState(false);
  const [lastPos, setLastPos] = useState(null);

  const gradientPreview = useMemo(() => {
    return `linear-gradient(90deg, ${color}, ${mix})`;
  }, [color, mix]);

  const draw = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, mix);
    ctx.strokeStyle = grad;
    ctx.lineWidth = size;
    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    setLastPos({ x, y });
  };

  const onPointerDown = (e) => {
    setIsPainting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  };
  const onPointerMove = (e) => {
    if (!isPainting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  };
  const onPointerUp = () => {
    setIsPainting(false);
    setLastPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl px-6 text-white">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Paint Mode</h3>
          </div>
          <div className="mt-4 grid place-items-center rounded-xl bg-black/30 p-4">
            <div className="relative w-full max-w-2xl">
              {baseImage && (
                <img src={baseImage} alt="sketch" className="w-full rounded-md object-contain opacity-70" />
              )}
              <canvas
                ref={canvasRef}
                width={900}
                height={600}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                className="absolute inset-0 h-full w-full cursor-crosshair rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <button onClick={clearCanvas} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                <RotateCcw className="h-4 w-4" /> Clear strokes
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onDone} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
                <Check className="h-4 w-4" /> Done
              </button>
              <button onClick={onNew} className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-4 py-2 font-medium text-black hover:bg-lime-300">
                <Plus className="h-4 w-4" /> New Project
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="font-semibold">Colors</h4>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70">Color A</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 h-10 w-full rounded-md bg-transparent" />
              </div>
              <div>
                <label className="text-xs text-white/70">Color B</label>
                <input type="color" value={mix} onChange={(e) => setMix(e.target.value)} className="mt-1 h-10 w-full rounded-md bg-transparent" />
              </div>
            </div>
            <div className="mt-3 h-8 w-full rounded-md" style={{ background: gradientPreview }} />
            <div className="mt-4 flex items-center gap-3">
              <Droplet className="h-4 w-4 text-white/70" />
              <input
                type="range"
                min={2}
                max={40}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-white/80">{size}px</span>
            </div>
            <p className="mt-3 text-sm text-white/70">Tip: Mix two colors for natural gradients. Use shorter strokes for texture.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/70">Progress</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-lime-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
