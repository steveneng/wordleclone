import { selectedWords } from "../selectedWords";

export const getNewWord = (): string => {
  let randomWordIndex = Math.floor(Math.random() * (selectedWords.length - 1));
  let word = selectedWords[randomWordIndex].toUpperCase();
  return word;
};
