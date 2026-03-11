import { useState, useCallback } from 'react';
import type { SortState, SortDirection } from '../types';

interface UseSortingOptions {
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
}

const EMPTY_SORT: SortState = { columnKey: '', direction: null };

function nextDirection(current: SortDirection): SortDirection {
  if (current === 'asc') return 'desc';
  if (current === 'desc') return null;
  return 'asc';
}

export function useSorting({ sort, onSortChange }: UseSortingOptions) {
  const [internalSort, setInternalSort] = useState<SortState>(EMPTY_SORT);
  const isControlled = sort !== undefined;
  const currentSort = isControlled ? sort : internalSort;

  const toggleSort = useCallback(
    (columnKey: string) => {
      const isSameColumn = currentSort.columnKey === columnKey;
      const direction = isSameColumn
        ? nextDirection(currentSort.direction)
        : 'asc';
      const next: SortState = { columnKey, direction };

      if (isControlled) {
        onSortChange?.(next);
      } else {
        setInternalSort(next);
      }
    },
    [currentSort, isControlled, onSortChange],
  );

  return { currentSort, toggleSort };
}
