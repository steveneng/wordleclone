import { FC } from "react";

const WordGrid: FC = () => {
  const grid = Array.from(Array(6).keys()).map((i) => (
    <div key={i} className="tile-row">
      {Array.from(Array(5).keys()).map((i) => (
        <div key={`${i}_col`}></div>
      ))}
    </div>
  ));

  return <>{grid}</>;
};

export default WordGrid;
