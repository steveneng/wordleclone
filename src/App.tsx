import "./App.css";
import { useEffect, useState, useRef } from "react";
import Keyboard from "./keyboard";
import Modal from "./modal";
import { wordBank, keyboardRows } from "./constants";
import { getNewWord } from "./util/getNewWord";
import { getKeyBoardStructure } from "./util/getKeyBoardStructure";
import WordGrid from "./wordGrid";
import { getKeyCode } from "./util/getKeyCode";
import { getNewBoard } from "./util/getNewBoard";
import { testForSpelling } from "./util/checkForSpelling";
import {
  isLetterInPlace,
  isWordLengthValid,
  isWordSolution,
} from "./util/checkSubmission";

interface keyboardType {
  [keys: string]: {
    status: string;
    location: [number, number];
  };
}

export default function App() {
  const [currentCode, setcurrentCode] = useState<number[]>([]);
  const [currentRow, setCurrentRow] = useState<string[]>([]);
  const [currentGrid, setCurrentGrid] = useState<[][]>([]);
  const [solution, setSolution] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(0);
  const [error, setError] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [didWin, setDidWin] = useState<boolean>(false);
  const [keyState, setKeyState] = useState<keyboardType>({});

  const tile = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const timeOutID = useRef<number>(0);

  // generates  word of the day on load of screen

  const helper = (e: any) => {
    // sorry future me for the spahgetti code here
    setcurrentCode([e.keyCode, Math.random()]);
  };

  useEffect(() => {
    let word = getNewWord();
    let keyObj = getKeyBoardStructure();
    setSolution(word);
    setKeyState(keyObj);

    // adds event listener to track which keycode is pressed
    window.addEventListener("keydown", helper);
    return () => {
      // removes event listener in end to prevent multiple listeners which will cause letters typed in
      window.removeEventListener("keydown", helper);
    };
  }, []);

  useEffect(() => {
    if (!currentCode || !tile.current || !keyboardRef.current) return;
    let letter = String.fromCharCode(currentCode[0]);
    let keyType = getKeyCode(currentCode);
    let row = tile.current.children[rowCount];
    //checks if current code is a letter
    if (keyType === "LETTER") {
      if (currentRow.length === 5) return;
      let newRow = [...currentRow, letter];
      row.children[currentRow.length].textContent = letter;
      setCurrentRow(newRow);
    }
    // on delete key, checks if current row is empty before popping element
    else if (keyType === "DELETE" && currentRow.length !== 0) {
      row.children[currentRow.length - 1].textContent = "";
      let newRow = [...currentRow];
      newRow.pop();
      setCurrentRow(newRow);
    }

    // on enter key press
    else if (keyType === "ENTER") {
      // checks if word is long enough
      if (!isWordLengthValid(currentRow)) {
        console.log("word not long enough");
        setError(true);
      } else {
        // checks for spelling
        if (testForSpelling(wordBank, currentRow)) {
          if (timeOutID.current) {
            clearTimeout(timeOutID.current);
          }
          console.log("spelling is off");
          setError(true);
          timeOutID.current = window.setTimeout((): void => {
            setError(false);
          }, 2000);
        } else {
          // checks if input is the solution and which parts are correct

          setError(false);
          for (let i = 0; i < 5; i++) {
            let place = row.children[i].textContent as string;

            let [keyBoardRow, keyBoardRowCol] =
              keyState[place.toLowerCase()].location;
            let keyStrokeTile =
              keyboardRef.current.children[keyBoardRow].children[
                keyBoardRowCol
              ];

            // checks if letter is part of the solution
            if (isLetterInPlace(solution, place)) {
              // highlights square green if its in the correct place
              if (solution[i] === place) {
                row.children[i].className = "contained-inplace";
                keyStrokeTile.classList.add("contained-inplace");
                keyStrokeTile.classList.remove("contained");
              }
              //  if letter is correct but not in correct place
              else {
                row.children[i].className = "contained";
                keyStrokeTile.classList.add("contained");
              }
            }
            // if the item is not contained, will make background dark gray
            else if (!isLetterInPlace(solution, place)) {
              row.children[i].className = "not-contained";
              keyStrokeTile.classList.add("not-contained");
            }
          }
          // if guess is correct

          if (isWordSolution(solution, currentRow)) {
            setToggleModal(true);
            setDidWin(true);
            return;
          }

          rowCount < 5 ? setRowCount((val) => val + 1) : setToggleModal(true);

          setCurrentRow([]);
        }
      }
    }
  }, [currentCode]);

  useEffect(() => {
    if (gameOver && tile.current && keyboardRef.current) {
      setcurrentCode([]);
      setCurrentRow([]);
      setSolution("");
      setRowCount(0);
      setError(false);
      let word = getNewWord();
      setSolution(word);
      getNewBoard(tile, keyboardRef);
      setGameOver(false);
    }
  }, [gameOver]);

  return (
    <div className="App">
      <div>Worle Squirtle Purple</div>
      {toggleModal && (
        <Modal
          toggler={setToggleModal}
          gameSetter={setGameOver}
          solution={solution}
          win={didWin}
        />
      )}
      {error && <div className="error">Check Spelling or Fill All Words</div>}
      <div ref={tile} className="tile-grid">
        <WordGrid />
      </div>

      <Keyboard
        ref={keyboardRef}
        solution={solution}
        grabcurrent={setcurrentCode}
        keyboard={keyboardRows}
      />
    </div>
  );
}
