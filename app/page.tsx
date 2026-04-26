"use client";

import { useEffect, useState } from "react";
import puzzleData from "../data/anagram_groups.json";
import { useRef } from "react";
import { log } from "console";
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
  const [guessedWords, setGuessedWords] = useState([]);
  const [scoreCard, setScoreCard] = useState([]);
  let [progress, setProgress] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  let [activeRow, setActiveRow] = useState(0);
  const inputRef = useRef(null);
  const [errorRow, setErrorRow] = useState<number | null>(null);
  const [lives, setLives] = useState(4); //start with 4 lives
  
  const {
    isOpen: isGuessesOpen,
    guesses,
    openModal: openGuessesModal,
    closeModal: closeGuessesModal,
  } = useGuessesModal();

  const {
    isOpen: isLossOpen,
    answers,
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
    const random = keys[Math.floor(Math.random() * keys.length)];
    const selected = puzzleData[random]; // this is the object
    const shuffledWords = [...selected.words]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const alignments = generateRowAlignments(shuffledWords, selected.key);

    setGroup({
      key: selected.key,
      words: shuffledWords,
      alignments: alignments
    });

    //console.log(selected.key);
    //console.log(shuffledWords);
    //console.log(alignments);

  }, []);



  function generateRowAlignments(words, key) {
    const randomInt:number = Math.floor(Math.random() * 5); // randomInt 0 - 4
    const keyLetter: string = words[1][randomInt]; // choose key letter as randomInt
    let alignments: any[] = new Array(4);
    let iteration = 0;
    for (const word of words) {
      let position = 0;
      for (const l of word) {
        if (l != keyLetter) {
          position++
          continue
        } else {
          alignments[iteration] = position; // Add position to alignments array
        }
      }
      iteration++
    }
    return (alignments);
  }



  function isSolved(rowIndex, currentProgress) {
    if (rowIndex < currentProgress) {
      return true;
    } else {
      return false;
    }
  }



  function displayLives() {
    return Array.from({ length: lives }, (_, i) => (
      <div key={i} className="p-1 bg-zinc-200 rounded-full"></div>
    )); 
  }



  function generateRows(words, alignments) {
    
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

          return (
            <div
              key={colIndex}
              className="w-8 h-8 text-xl font-semibold flex items-center justify-center border rounded-md"
              style={{
                borderColor: isAligned ? '#032235' : '#009dc4',
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
    console.log(`progress now ${progress}`);  
  }



  function isValid(word) {
    const lower = word.toLowerCase(); // normalize input to lowercase
    if (!group.words.includes(lower)) return false; // word not in this anagram group
    if (guessedWords.includes(lower)) return false; // already guessed this word+-
    return true; // passes all checks
  }



  function submitGuess() {
    const guess: string = currentGuess.toLowerCase();
    if (lives === 0) {
      setCurrentGuess("");
    } else {
      if (isValid(guess)) {
        const updated = [...guessedWords, guess];
        const scoreCardUpdated = [...scoreCard, guess];
        revealRow();
        setGuessedWords(updated);
        setScoreCard(scoreCardUpdated);
        setActiveRow(prev => prev + 1);

        // check win condition using updated length
        if (updated.length === group?.words.length) {
          //console.log("finished game");
          openGuessesModal(guessedWords);
          // trigger modal / end state here
        }

        console.log("correct!");
        setCurrentGuess("");
      } else {
        //incorrect guess
        const scoreCardUpdated = [...scoreCard, guess];
        setScoreCard(scoreCardUpdated);
        console.log(scoreCardUpdated);
        if (lives <= 1) {
          console.log(group?.words);
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
    //console.log(`pressed ${key}`);
    //console.log(`position ${currentGuess.length}`);
    //console.log(`progress now ${progress}`);
    
    const currentLineAlignment: number = group?.alignments[activeRow];
    //console.log(`freeletterpos ${currentLineAlignment}`);

    //console.log(`freeletter ${group?.words[activeRow][group?.alignments[activeRow]]}`);
    
    //console.log(`Line , ${activeRow}`);
    
    // Only allow single lowercase letters a–z
    // (prevents numbers, symbols, and multi-character inputs like "Enter")
    if (/^[a-z]$/.test(key)) {

      // Functional state update to ensure you're using latest state
      setCurrentGuess(prev => {
        
        if (prev.length == currentLineAlignment) {
          
          return prev + group?.words[activeRow][group?.alignments[activeRow]] + key; // add freeletter and then typed key

        } else if (prev.length == 3 && currentLineAlignment == 4) { // if we are on 3 and next letter is the freeletter (last)

          return prev + key + group?.words[activeRow][group?.alignments[activeRow]]; // add typed key and then freeletter

        } else if (prev.length < 5) return prev + key; // Prevent typing beyond 5 characters
        // If already at max length, ignore input
        return prev;
      });
    }
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        setCurrentGuess(prev => prev.slice(0, -1))
        return;
      }

      handleKeyPress(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!group) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-between max-h-screen min-h-screen bg-black text-white gap-10 pt-8 pb-3">

      {/* TITLE */}
      <div className="flex flex-col items-center justify-self-start gap-4">
        <h1 className="text-5xl font-serif ">ANAGRAMBLE</h1>
        <div className="flex flex-row justify-evenly w-full">
          <h2>(beta)</h2>
          <button className="bg-zinc-700 p-[2px] px-2 rounded-sm text-sm border border-zinc-500" onClick={openHowToModal}>help</button>
        </div>
      </div>
      
      <div className="text-center flex flex-col gap-2">

        <p className="text-xs text-zinc-500">Make words from:</p>

        <h2 className="text-3xl tracking-[0.3em] font-semibold text-white" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {group.key.toUpperCase()}
        </h2>

      </div>



      {/* GRID */}
      <div
        className="flex flex-col gap-2 justify-center items-center min-w-90" // vertical stack for all rows
        onClick={() => inputRef.current?.focus()} // tap grid → focus hidden input (mobile keyboard)
      >
        <div className="flex w-10 bg-[#032235] border-2 border-cyan-400 py-1 justify-center rounded-md">
          <div className="flex flex-col gap-2" name="grid"> {/* inner container for spacing */}

            {generateRows(group.words, group.alignments)}

          </div>
          
        </div>
      </div>

      {/* LIVES */}

      <div className="flex flex-row gap-1 ">
        {displayLives()}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-[6px]">
        <CustomKeyRow items={"qwertyuiop".split("")} onKeyPress={handleKeyPress} />
        <CustomKeyRow items={"asdfghjkl".split("")} onKeyPress={handleKeyPress} />
        <div className="flex flex-row gap-[6px]">
          <div key={"enter"} onClick={() => submitGuess()} className="bg-gray-600 h-14 flex items-center justify-center font-semibold text-sm p-2 rounded-sm">ENTER</div>
          <CustomKeyRow items={"zxcvbnm".split("")} onKeyPress={handleKeyPress} />
          <div key={"bkspc"} onClick={() => setCurrentGuess(prev => prev.slice(0, -1))} className="bg-gray-600 h-14 flex items-center justify-center font-semibold text-l p-2 pe-3 rounded-sm">
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
        guesses={guesses}
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