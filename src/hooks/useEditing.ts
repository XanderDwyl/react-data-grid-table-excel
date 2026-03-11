import { useState, useCallback } from 'react';
import type { CellAddress } from '../types';

export function useEditing() {
  const [editingCell, setEditingCell] = useState<CellAddress | null>(null);

  const startEditing = useCallback((cell: CellAddress) => {
    setEditingCell(cell);
  }, []);

  const commitEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  return { editingCell, startEditing, commitEdit, cancelEdit };
}
