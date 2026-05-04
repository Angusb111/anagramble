"use client";

import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};



export default function HowToPlayModal({ isOpen, onClose }: Props) {
  const isDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const activeColor = isDark
    ? "oklch(68.5% 0.169 237.323)" // dark mode color (sky)
    : "oklch(46.6% 0.025 107.3)";  // light mode color (olive)
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-taupe-200 dark:bg-[#0c111a] border border-slate-800 rounded-xl p-6 w-[420px] shadow-lg text-sm dark:text-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 dark:text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          How to Play
        </h2>

        <div className="space-y-3">
          <p>
            Guess the set of related words.
          </p>

          <p>
            All words share the same letters — you're solving different
            arrangements of the same set.
          </p>

          <p>
            Use the locked letter as a clue to figure out each word.
          </p>

          <p>
            You start with 4 lives. Each incorrect guess takes one away!
          </p>
        </div>

        <div className="mt-4 space-y-2 flex flex-col items-center">

        {/* Row 1 */}
        <div className="flex gap-1 translate-x-[44px]">
            {"TIRES".split("").map((l, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-md font-semibold border border-olive-500 dark:border-sky-400"
                style={{
                  backgroundColor: i === 1 ? activeColor : "transparent",
                }}
              >
                {l}
              </div>
            ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-1 translate-x-[-44px]">
            {"RESIT".split("").map((l, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-md font-semibold border border-olive-500 dark:border-sky-400"
                style={{
                  backgroundColor: i === 3 ? activeColor : "transparent",
                }}
              >
                {l}
              </div>
            ))}
        </div>

        {/* Row 3 */}
        <div className="flex gap-1 translate-x-[44px]">
            {"RITES".split("").map((l, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-md font-semibold border border-olive-500 dark:border-sky-400"
                style={{
                  backgroundColor: i === 1 ? activeColor : "transparent",
                }}
              >
                {l}
              </div>
            ))}
        </div>

        </div>

        <p className="text-xs dark:text-slate-400 mt-3 text-center">
        Each word is shifted so the locked letter stays in the same column.
        </p>
      </div>
    </div>
  );
}