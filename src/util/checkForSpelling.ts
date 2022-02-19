export const testForSpelling = (
  wordBank: string[],
  currentRow: string[]
): boolean => {
  return wordBank.indexOf(currentRow.join("").toLowerCase()) < 0;
};
