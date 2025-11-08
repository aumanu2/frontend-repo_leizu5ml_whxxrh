import React, { useState } from 'react';
import HeroCover from './components/HeroCover';
import UploadPanel from './components/UploadPanel';
import SketchMode from './components/SketchMode';
import PaintMode from './components/PaintMode';

export default function App() {
  const [stage, setStage] = useState('home'); // home | upload | sketch | paint
  const [image, setImage] = useState(null);

  const start = () => setStage('upload');
  const toSketch = () => setStage('sketch');
  const toPaint = () => setStage('paint');
  const reset = () => { setStage('home'); setImage(null); };

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <HeroCover onStart={start} />

      {stage === 'home' && (
        <section className="mx-auto mt-10 w-full max-w-6xl px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold">Welcome to SketchFlow</h2>
            <p className="mt-2 text-white/80">
              Upload or capture a photo, follow AI-guided steps to sketch it, then paint with smart color tips. Export your artwork when done.
            </p>
            <div className="mt-4">
              <button onClick={start} className="rounded-full bg-white px-5 py-3 text-black">Start New Project</button>
            </div>
          </div>
        </section>
      )}

      {stage === 'upload' && (
        <UploadPanel image={image} setImage={setImage} onProceed={toSketch} />
      )}

      {stage === 'sketch' && (
        <SketchMode source={image} onDone={reset} onPaint={toPaint} />
      )}

      {stage === 'paint' && (
        <PaintMode baseImage={image} onDone={reset} onNew={reset} />
      )}

      <footer className="mx-auto mt-16 w-full max-w-6xl px-6 pb-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white/60">
          © {new Date().getFullYear()} SketchFlow — AI Drawing & Painting Tutor
        </div>
      </footer>
    </div>
  );
}
