"use client";

import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  answers?: string[]; // optional
  onClose: () => void;
};

export default function LoseModal({
  isOpen,
  answers = [],
  onClose,
}: Props) {
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0c111a] border border-slate-800 rounded-xl p-6 w-[420px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-red-400">
          OUT OF LIVES
        </h2>

        <p className="text-sm text-slate-400 text-center mb-4">
          Correct answers were:
        </p>

        {/* Answer tiles */}
        <ul className="space-y-3">
          {answers.map((word, i) => (
            <li key={word + i} className="flex gap-1 justify-center">
              {word.split("").map((letter, j) => (
                <div
                  key={j}
                  className="w-10 h-10 flex items-center justify-center rounded-md font-semibold text-white bg-zinc-800 border border-slate-700"
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-5 w-full bg-red-600 hover:bg-red-700 rounded py-2 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}