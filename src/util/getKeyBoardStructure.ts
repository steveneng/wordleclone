import { keyboardRows } from "../constants";

interface keyboardType {
  [keys: string]: {
    status: string;
    location: [number, number];
  };
}

export const getKeyBoardStructure = (): keyboardType => {
  let keyObj: keyboardType = {};

  for (let i = 0; i < keyboardRows.length; i++) {
    for (let n = 0; n < keyboardRows[i].length; n++) {
      keyObj[keyboardRows[i][n]] = {
        status: "",
        location: [i, n],
      };
    }
  }
  return keyObj;
};
