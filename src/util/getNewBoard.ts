import React from "react";

export const getNewBoard = (
  wordTile: React.RefObject<any>,
  keyBoardKey: React.RefObject<any>
): void => {
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 5; x++) {
      let keyTile = wordTile.current.children[y].children[x];
      keyTile.textContent = "";
      keyTile.className = "";
    }
  }

  for (let i = 0; i < keyBoardKey.current.children.length; i++) {
    for (let n = 0; n < keyBoardKey.current.children[i].children.length; n++) {
      let keyboardKeys = keyBoardKey.current.children[i].children[n].classList;
      keyboardKeys.remove("not-contained");
      keyboardKeys.remove("contained");
      keyboardKeys.remove("contained-inplace");
    }
  }
};
