// GuessesModal.tsx
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  guesses: string[];
  lives: number;
  onClose: () => void;
};



export default function GuessesModal({ isOpen, guesses, lives, onClose }: Props) {
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

  const handleShare = async () => {

    const today = new Date().toLocaleDateString("en-NZ", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const resultText =
      `Anagramble ${today}\n` +
      `Lives remaining: ${lives}/4\n` +
      `anagramble.angusbodle.nz`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Puzzle Result",
          text: resultText,
        });
      } else {
        await navigator.clipboard.writeText(resultText);
        alert("Copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose} // click outside
    >
      <div
        className="relative bg-[#0c111a] flex flex-col items-center gap-5 border border-slate-800 rounded-xl p-6 w-[400px] shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-4xl font-semibold mb-4 text-center">Well Done!</h2>
        <p className="text-sm text-slate-300">You Won with {lives}/4 lives remaining.</p>
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
        <button className="bg-green-600 p-3 w-28 rounded-md text-sm border border-zinc-500" onClick={handleShare}>
          Share
        </button>
      </div>

    </div>
  );
}