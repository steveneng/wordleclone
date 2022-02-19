import { useEffect, useState } from "react";

interface propType {
  row: string[];
  fn: (x: any) => void;
}

export const useDeleteItem = ({ row, fn }: propType) => {
  const [currentRow, setCurrentRow] = useState(null);
  useEffect(() => {
    setCurrentRow(null);
  }, [currentRow]);
  return currentRow;
};
