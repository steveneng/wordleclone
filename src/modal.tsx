import { FC } from "react";

interface PropTypes {
  gameSetter: (x: boolean) => void;
  toggler: (x: boolean) => void;
  solution: string;
  win: boolean;
}

const Modal: FC<PropTypes> = ({ gameSetter, toggler, solution, win }) => {
  return (
    <div id="modal">
      <div className="modal-body">
        <div className="modal-message">
          {win ? (
            <h1>Great job on figuring out the word!</h1>
          ) : (
            <h1>Oh no! Perhaps next time :(</h1>
          )}
          <p>Answer for the Wordle: {solution}</p>
          <p>Start Over?</p>
        </div>
        <button
          onClick={() => {
            console.log("resetting");
            gameSetter(true);
            toggler(false);
          }}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default Modal;
