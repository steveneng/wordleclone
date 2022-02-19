export const isWordLengthValid = (wordRow: Array<string>): boolean => {
  return wordRow.length === 5;
};

export const isLetterInPlace = (solution: string, letter: string): boolean => {
  return solution.indexOf(letter) >= 0;
};

export const isWordSolution = (
  solution: string,
  currentInput: Array<string>
): boolean => {
  return currentInput.join("") === solution;
};
