// useGuessesModal.ts
import { useState } from "react";

export function useGuessesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(0);

  function openModal(guessesArray: string[], livesCount: number) {
    setGuesses(guessesArray);
    setLives(livesCount);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return {
    isOpen,
    guesses,
    lives,
    openModal,
    closeModal,
  };
}