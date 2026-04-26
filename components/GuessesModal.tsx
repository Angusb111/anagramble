// GuessesModal.tsx
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  guesses: string[];
  onClose: () => void;
};

export default function GuessesModal({ isOpen, guesses, onClose }: Props) {
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
      onClick={onClose} // click outside
    >
      <div
        className="relative bg-[#0c111a] border border-slate-800 rounded-xl p-6 w-[400px] shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Well Done!</h2>

        <ul className="space-y-3 mb-2">
          {guesses.map((guess, i) => (
            <li key={guess + i} className="flex gap-1 justify-center">
              {guess.split("").map((letter, j) => (
                <div
                  key={j}
                  className="w-10 h-10 flex items-center justify-center rounded-md font-semibold text-white bg-green-600"
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}