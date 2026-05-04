"use client";

import { useEffect, useState, useRef } from "react";
import puzzleData from "../data/anagram_groups.json";
import { CustomKeyRow } from "@/components/key";

import { useGuessesModal } from "@/hooks/useGuessesModal";
import GuessesModal from "@/components/GuessesModal";

import { useHowToPlayModal } from "@/hooks/useHowToPlayModal";
import HowToPlayModal from "@/components/HowToPlayModal";

import { useLossModal } from "@/hooks/useLossModal";
import LossModal from "@/components/LossModal";

export default function Home() {

  type Group = {
    key: string;
    words: string[];
    alignments: number[];
  };

  const [group, setGroup] = useState<Group | null>(null);
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [scoreCard, setScoreCard] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [activeRow, setActiveRow] = useState(0);
  const inputRef = useRef(null);
  const [errorRow, setErrorRow] = useState<number | null>(null);
  const [lives, setLives] = useState(4);

  const [randomInt, setRandomInt] = useState(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

    let seed = 0;
    for (let i = 0; i < key.length; i++) {
      seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
    }

    // one RNG step
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;

    return Math.abs(seed) % 5; // 0–4
  });

  const [Selector, setSelector] = useState(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

    let seed = 0;
    for (let i = 0; i < key.length; i++) {
      seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
    }

    // one RNG step
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;

    return Math.abs((seed) % 65) + 1 ; // 0–4
  });

  const selected: any = (puzzleData as any)[Selector];

  const allWords: any[] = selected.words;

  const {
    isOpen: isGuessesOpen,
    guesses,
    openModal: openGuessesModal,
    closeModal: closeGuessesModal,
  } = useGuessesModal();

  const {
    isOpen: isLossOpen,
    openModal: openLossModal,
    closeModal: closeLossModal,
  } = useLossModal();

  const {
    isOpen: isHowToOpen,
    openModal: openHowToModal,
    closeModal: closeHowToModal,
  } = useHowToPlayModal();



  useEffect(() => {
    const keys = Object.keys(puzzleData);
    

    

    let s = Selector;
    const shuffledWords = [...selected.words];

    for (let i = shuffledWords.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }

    shuffledWords.length = 4;

    const alignments = generateRowAlignments(shuffledWords, selected.key);

    console.log(randomInt);
    
    setGroup({
      key: selected.key,
      words: shuffledWords,
      alignments: alignments
    });
  }, []);

  

  function generateRowAlignments(words: string[], key: string) {


    const keyLetter: string = key[randomInt];

    let alignments: any[] = new Array(4);
    let iteration = 0;
    for (const word of words) {
      alignments[iteration] = word.indexOf(keyLetter);
      iteration++;
    }
    return (alignments);
  }

  function isSolved(rowIndex: number, currentProgress: number) {
    return rowIndex < currentProgress;
  }

  function displayLives() {
    return Array.from({ length: lives }, (_, i) => (
      <div key={i} className="p-1 bg-olive-900 dark:bg-zinc-200 rounded-full"></div>
    ));
  }

  function generateRows(words: string[], alignments: number[]) {
    return words.map((word, rowIndex) => (
      <div
        key={rowIndex}
        className="flex gap-2"
        style={{
          transform: `translateX(${((2 - alignments[rowIndex]) * 40)}px)`
        }}
      >
        {word.split("").map((letter, colIndex) => {
          const isAligned = colIndex === alignments[rowIndex];
          const guessLetter = currentGuess[colIndex] || "";
          const isDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          const keyBorder =
            isDark ? "oklch(68.5% 0.169 237.323)" : //sky
            "oklch(46.6% 0.025 107.3)"; //olive
          return (
            <div
              key={colIndex}
              className="w-8 h-8 text-xl font-semibold flex items-center justify-center border rounded-md"
              style={{
                borderColor: isAligned ? 'transparent' : keyBorder,
                backgroundColor:
                  errorRow === rowIndex
                    ? "#ff4d4d"
                    : isSolved(rowIndex, progress)
                      ? "#00c12a"
                      : "transparent",
              }}
            >
              {isAligned
                ? letter.toUpperCase()
                : rowIndex === activeRow
                  ? guessLetter.toUpperCase()
                  : rowIndex < progress
                    ? guessedWords[rowIndex][colIndex].toUpperCase()
                    : ""
              }
            </div>
          );
        })}
      </div>
    ));
  }

  function revealRow() {
    setProgress(prev => prev + 1);
  }

  function isValid(word: string) {
    const lower = word.toLowerCase();
    if (!allWords.includes(lower)) return false;
    if (guessedWords.includes(lower)) return false;
    return true;
  }

  function submitGuess() {
    const guess: string = currentGuess.toLowerCase();
    if (lives === 0 || !group) {
      setCurrentGuess("");
    } else {
      if (isValid(guess)) {
        const updated = [...guessedWords, guess];
        revealRow();
        setGuessedWords(updated);
        setScoreCard([...scoreCard, guess]);
        setActiveRow(prev => prev + 1);

        if (updated.length === group.words.length) {
          openGuessesModal(updated, lives); //win
        }
        setCurrentGuess("");
      } else {
        setScoreCard([...scoreCard, guess]);
        if (lives <= 1) {
          setLives(lives - 1);
          openLossModal(group.words);
        } else {
          setErrorRow(activeRow);
          setLives(lives - 1);
          setTimeout(() => {
            setErrorRow(null);
            setCurrentGuess("");
          }, 1000);
        }
      }
    }
  }

  const handleKeyPress = (key: string) => {
    if (/^[a-z]$/i.test(key) && group) {
      setCurrentGuess(prev => {
        if (prev.length >= 5) return prev;
        const alignmentIndex = group.alignments[activeRow];
        const lockedLetter = group.words[activeRow][alignmentIndex];

        if (alignmentIndex === 4) { // alignmentindex is last letter in word
          if ((prev.length + 1) === alignmentIndex) { // user just submitted the 2nd to last letter
            return (prev + key.toLowerCase() + lockedLetter).slice(0, 5);
          }
        } else { //it is between the 1st and 4th letters
          if (prev.length === alignmentIndex) { // user submitted a letter in the alignment box
            return (prev + lockedLetter + key.toLowerCase()).slice(0, 5);
          }
        }

        return (prev + key.toLowerCase()).slice(0, 5);

      });
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(prev => {
      if (!group) return prev;
      const alignmentIndex = group.alignments[activeRow];
      if (prev.length === alignmentIndex + 2) {
        return prev.slice(0, -2);
      }
      return prev.slice(0, -1);
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
        return;
      }
      if (e.key === "Enter") {
        submitGuess();
        return;
      }
      handleKeyPress(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [group, activeRow, currentGuess, guessedWords]); // Essential dependencies

  if (!group) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-between max-h-screen flex-grow bg-taupe-200 dark:bg-black dark:text-white gap-10 pt-8 pb-3">

      {/* TITLE */}
      <div className="flex flex-col items-center justify-self-start gap-4">
        <h1 className="text-5xl font-serif ">ANAGRAMBLE</h1>
        <div className="flex flex-row justify-evenly w-full">
          <button className="bg-olive-500 dark:bg-zinc-700 p-[2px] px-2 rounded-sm text-sm border border-olive-700 dark:border-zinc-500" onClick={openHowToModal}>How to Play</button>
        </div>
      </div>
      
      <div className="text-center flex flex-col gap-2">
        <p className="text-xs text-zinc-500">Make words from:</p>
        <h2 className="text-3xl tracking-[0.3em] font-semibold" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {group.key.toUpperCase()}
        </h2>
      </div>

      {/* GRID */}
      <div className="flex flex-col gap-2 justify-center items-center min-w-90">
        <div className="flex w-10 bg-olive-500 dark:bg-[#032235] border-2 border-olive-300 dark:border-sky-400 py-1 justify-center rounded-md">
          <div className="flex flex-col gap-2"> 
            {generateRows(group.words, group.alignments)}
          </div>
        </div>
      </div>

      {/* LIVES */}
      <div className="flex flex-row gap-1 ">
        {displayLives()}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-5">
        <CustomKeyRow items={group.key.split("").filter((_, i) => i !== randomInt)} onKeyPress={handleKeyPress} />
        <div className="flex flex-row gap-5 justify-between">
          <div key={"enter"} onClick={() => submitGuess()} className="bg-olive-500 dark:bg-gray-600 w-2/3 flex-grow flex items-center justify-center font-semibold text-sm p-2 rounded-sm cursor-pointer">ENTER</div>
          <div key={"bkspc"} onClick={handleBackspace} className="bg-olive-500 dark:bg-gray-600 h-14 w-1/3 flex items-center justify-center font-semibold text-l p-2 pe-3 rounded-sm cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
            </svg>
          </div>
        </div>
      </div>

      <HowToPlayModal
        isOpen={isHowToOpen}
        onClose={closeHowToModal}
      />

      <GuessesModal
        isOpen={isGuessesOpen}
        guesses={guessedWords}
        lives={lives}
        onClose={closeGuessesModal}
      />

      <LossModal
        isOpen={isLossOpen}
        answers={group.words}
        onClose={closeLossModal}
      />

    </div>
  );
}