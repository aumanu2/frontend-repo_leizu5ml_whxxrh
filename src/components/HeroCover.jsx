import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover({ onStart }) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Subtle gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-end px-6 pb-10 text-white">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          SketchFlow
        </h1>
        <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
          AI Drawing & Painting Tutor — turn any photo into step-by-step sketch and paint guidance.
        </p>
        <div className="mt-6">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-black shadow/20 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            Start New Project
          </button>
        </div>
      </div>
    </section>
  );
}
