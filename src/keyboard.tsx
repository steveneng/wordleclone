import { forwardRef } from "react";

interface propTypes {
  keyboard: string[][];
  grabcurrent: (x: any[]) => void;
  solution: string;
}

const Keyboard = forwardRef<HTMLDivElement, propTypes>(
  ({ keyboard, grabcurrent }, ref) => {
    const clickHandler = (e: any) => {
      let item;
      console.log(e.target.id === "del", e.target.id);
      if (e.target.id !== "entr" && e.target.id !== "del") {
        item = e.target.id.toUpperCase().charCodeAt(0);
        console.log(item);
      } else {
        item = e.target.id === "del" ? 8 : 13;
        console.log(item);
      }
      let keyStroke = [item, Math.random()];
      grabcurrent(keyStroke);
    };

    const rows = keyboard.map((row, i) => {
      let keyRow = row.map((letter: string, n) => {
        return (
          <div
            className={`${
              i === 2 && (n === 0 || n === row.length - 1)
                ? "keystroke key-ends"
                : "keystroke"
            }`}
            id={letter}
            key={letter}
            onClick={clickHandler}
          >
            {letter.toUpperCase()}
          </div>
        );
      });
      return (
        <div className="keyrow" key={`row_${i}`}>
          {keyRow}
        </div>
      );
    });
    return (
      <div ref={ref} id="keyboard">
        {rows}
      </div>
    );
  }
);

export default Keyboard;
