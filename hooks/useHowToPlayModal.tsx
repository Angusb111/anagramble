// useHowToPlayModal.ts
import { useState } from "react";

export function useHowToPlayModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };
}