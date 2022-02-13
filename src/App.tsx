import "./App.css";
import { useEffect, useState, useRef } from "react";
import { wordBank } from "./wordbank";
import { selectedWords } from "./selectedWords";
import Keyboard from "./keyboard";
import Modal from "./modal";

const keyboardRows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["entr", "z", "x", "c", "v", "b", "n", "m", "del"],
];

interface keyboardType {
  [keys: string]: {
    status: string;
    location: [number, number];
  };
}

export default function App() {
  const [currentCode, setcurrentCode] = useState<Array<any>>([]);
  const [currentRow, setCurrentRow] = useState<Array<string>>([]);
  const [solution, setSolution] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(0);
  const [error, setError] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [didWin, setDidWin] = useState<boolean>(false);
  const [keyState, setKeyState] = useState<keyboardType>({});

  const tile = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  // generates  word of the day on load of screen

  const helper = (e: any) => {
    // sorry future me for the spahgetti code here
    setcurrentCode([e.keyCode, Math.random()]);
  };

  useEffect(() => {
    // how works

    // setSolution(word);
    let randomWordIndex = Math.floor(
      Math.random() * (selectedWords.length - 1)
    );
    // let word = selectedWords[randomWordIndex].toUpperCase();
    let word = "APPLE";

    setSolution(word);

    let keyObj: keyboardType = {};

    for (let i = 0; i < keyboardRows.length; i++) {
      for (let n = 0; n < keyboardRows[i].length; n++) {
        keyObj[keyboardRows[i][n]] = {
          status: "",
          location: [i, n],
        };
      }
    }

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
    let row = tile.current.children[rowCount];
    //checks if current code is a letter
    if (currentCode[0] < 91 && currentCode[0] > 64) {
      if (currentRow.length === 5) return;
      let newRow = [...currentRow, letter];
      row.children[currentRow.length].textContent = letter;
      setCurrentRow(newRow);
    }
    // on delete key, checks if current row is empty before popping element
    else if (currentCode[0] === 8 && currentRow.length !== 0) {
      row.children[currentRow.length - 1].textContent = "";
      let newRow = [...currentRow];
      newRow.pop();
      setCurrentRow(newRow);
    }

    // on enter key press
    else if (currentCode[0] === 13) {
      // checks if word is long enough
      if (currentRow.length !== 5) {
        console.log("word not long enough");
        setError(true);
      } else {
        // checks for spelling
        if (wordBank.indexOf(currentRow.join("").toLowerCase()) < 0) {
          console.log("spelling is off");
          setError(true);
        } else {
          // checks if input is the solution and which parts are correct
          let contained = false;
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
            if (solution.indexOf(place) >= 0) {
              // highlights square green if its in the correct place
              if (solution[i] === place) {
                row.children[i].className = "contained-inplace";
                keyStrokeTile.classList.add("contained-inplace");
                keyStrokeTile.classList.remove("contained");
              }
              //  if letter is correct but not in correct place
              else {
                // if there is repeating letters, will not highlight repeats yellows
                // if (solution.indexOf(place) >= 0 && !contained) {
                //   row.children[i].className = "contained";
                //   keyStrokeTile.classList.add("contained");

                //   contained = true;
                // } else {
                //   console.log("glitched: ", contained, place);
                //   row.children[i].className = "not-contained";
                // }

                if (solution.indexOf(place) >= 0) {
                  row.children[i].className = "contained";
                  keyStrokeTile.classList.add("contained");
                }
              }
            }
            // if the item is not contained, will make background dark gray
            else if (solution.indexOf(place) < 0) {
              row.children[i].className = "not-contained";
              keyStrokeTile.classList.add("not-contained");
            }
          }
          // if guess is correct

          if (currentRow.join("") === solution) {
            setToggleModal(true);
            setDidWin(true);
            return;
          }

          if (rowCount < 5) {
            setRowCount((val) => val + 1);
          } else {
            setToggleModal(true);
          }
          setCurrentRow([]);
          contained = false;
        }
      }
    }
  }, [currentCode]);

  useEffect(() => {
    console.log("test");
    if (gameOver && tile.current && keyboardRef.current) {
      setcurrentCode([]);
      setCurrentRow([]);
      setSolution("");
      setRowCount(0);
      setError(false);
      let randomWordIndex = Math.floor(Math.random() * (wordBank.length - 1));
      let word = wordBank[randomWordIndex].toUpperCase();
      setSolution(word);

      for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 5; x++) {
          tile.current.children[y].children[x].textContent = "";
          tile.current.children[y].children[x].className = "";
        }
      }

      for (let i = 0; i < keyboardRef.current.children.length; i++) {
        for (
          let n = 0;
          n < keyboardRef.current.children[i].children.length;
          n++
        ) {
          keyboardRef.current.children[i].children[n].classList.remove(
            "not-contained"
          );
          keyboardRef.current.children[i].children[n].classList.remove(
            "contained"
          );
          keyboardRef.current.children[i].children[n].classList.remove(
            "contained-inplace"
          );
        }
      }
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
      {error && (
        <div className="error">
          Oops, check spelling or make sure its filled you fool
        </div>
      )}
      <div ref={tile} className="tile-grid">
        {Array.from(Array(6).keys()).map((i) => (
          <div key={i} className="tile-row">
            {Array.from(Array(5).keys()).map((i) => (
              <div key={`${i}_col`}></div>
            ))}
          </div>
        ))}
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
