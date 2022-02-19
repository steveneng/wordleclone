export const getKeyCode = (keycode: number[]): string => {
  if (keycode[0] < 91 && keycode[0] > 64) {
    return "LETTER";
  }
  // on delete key, checks if current row is empty before popping element
  else if (keycode[0] === 8) {
    return "DELETE";
  }

  // on enter key press
  else if (keycode[0] === 13) {
    return "ENTER";
  }
  return "";
};
