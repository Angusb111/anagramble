// useGuessesModal.ts
import { useState } from "react";

export function useGuessesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);

  function openModal(guessesArray: string[]) {
    setGuesses(guessesArray);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return {
    isOpen,
    guesses,
    openModal,
    closeModal,
  };
}