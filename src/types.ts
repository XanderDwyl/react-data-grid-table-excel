import type { ReactNode, CSSProperties } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  columnKey: string;
  direction: SortDirection;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ColumnDef<TRow = any> {
  /** Unique key matching a property on TRow */
  key: string & keyof TRow;
  /** Display label in the header */
  title: string;
  /** Column width in pixels (optional, defaults to auto) */
  width?: number;
  /** Whether this column is sortable. Defaults to true. */
  sortable?: boolean;
  /** Whether cells in this column are editable. Defaults to false. */
  editable?: boolean;
  /** Custom cell renderer for display mode */
  render?: (value: unknown, row: TRow, rowIndex: number) => ReactNode;
  /** Dynamic cell style based on value */
  cellStyle?: (value: unknown, row: TRow, rowIndex: number) => CSSProperties | undefined;
  /** Custom header style */
  headerStyle?: CSSProperties;
  /** Custom header CSS class */
  headerClassName?: string;
  /** Freeze this column so it stays visible during horizontal scroll */
  frozen?: boolean;
  /** List of autocomplete suggestions shown while editing */
  autoCompleteOptions?: string[];

}

export interface CellAddress {
  rowIndex: number;
  columnKey: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataGridProps<TRow = any> {
  /** Column definitions */
  columns: ColumnDef<TRow>[];
  /** Array of row data objects */
  rows: TRow[];
  /** Unique key field on each row for React keys. Defaults to 'id'. */
  rowKey?: string & keyof TRow;
  /** Callback when a cell value is committed (Enter / blur) */
  onCellEdit?: (
    rowIndex: number,
    columnKey: string & keyof TRow,
    newValue: unknown,
    row: TRow,
  ) => void;
  /** Callback on every keystroke while editing a cell */
  onCellChange?: (
    rowIndex: number,
    columnKey: string & keyof TRow,
    newValue: unknown,
    row: TRow,
  ) => void;
  /** Controlled sort state */
  sort?: SortState;
  /** Callback when sort changes */
  onSortChange?: (sort: SortState) => void;
  /** Show Excel-like column letter row (A, B, C...). Defaults to false. */
  showColumnLetters?: boolean;
  /** Callback when a column's freeze checkbox is toggled. Enables freeze checkboxes in the column letter row. */
  onFreezeChange?: (columnKey: string, frozen: boolean) => void;
  /** Optional CSS class for the outermost wrapper */
  className?: string;
  /** Optional inline style for the outermost wrapper */
  style?: CSSProperties;
}
