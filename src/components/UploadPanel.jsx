import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

export default function UploadPanel({ image, setImage, onProceed }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl px-6">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:grid-cols-[1.2fr_1fr]"
      >
        <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-black/20">
          {image ? (
            <img
              src={image}
              alt="uploaded"
              className="max-h-[320px] w-full object-contain"
            />
          ) : (
            <div className="text-center text-white/70">
              <p className="text-lg">Drop an image here</p>
              <p className="text-sm">or use the options on the right</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/90 p-3 text-black transition hover:bg-white"
            >
              <Upload className="h-4 w-4" /> Upload
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/20 p-3 text-white transition hover:bg-white/30"
            >
              <Camera className="h-4 w-4" /> Use Camera
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />

          <p className="text-sm text-white/70">
            Supported: JPG, PNG, WEBP. For the camera, we’ll use your device camera when available.
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-white/80">Ready? Move to AI Sketch Mode</span>
            <button
              disabled={!image}
              onClick={onProceed}
              className="rounded-full bg-lime-400 px-4 py-2 font-medium text-black transition enabled:hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
