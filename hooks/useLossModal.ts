import { useState } from "react";

export function useLossModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  function openModal(correctWords: string[]) {
    setAnswers(correctWords);
    console.log(correctWords);
    
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return {
    isOpen,
    answers,
    openModal,
    closeModal,
  };
}