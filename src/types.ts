import type { ReactNode, CSSProperties } from 'react';

export interface GridTheme {
  /** Grid-specific color overrides */
  grid?: {
    headerBg?: string;
    headerColor?: string;
    cellBorderColor?: string;
    rowHoverBg?: string;
    frozenHeaderBg?: string;
    unfrozenHeaderBg?: string;
    frozenColumnShadow?: string;
    editOutlineColor?: string;
  };
  /** Ant Design token overrides (scoped to the grid) */
  tokens?: {
    colorPrimary?: string;
    fontSize?: number;
    borderRadius?: number;
    fontFamily?: string;
  };
  /** Status color map — key is label, value is bg/text colors */
  statusColors?: Record<string, { bg: string; color: string }>;
}

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
  /** Enable the theme settings float button. Defaults to false. */
  themeConfigurable?: boolean;
  /** Controlled theme state. */
  theme?: GridTheme;
  /** Callback when theme changes (real-time). */
  onThemeChange?: (theme: GridTheme) => void;
  /** Show the theme float button. Defaults to true when themeConfigurable is true. */
  showThemeButton?: boolean;
  /** Custom trigger component to replace the default FloatButton. */
  themeButtonRender?: (onClick: () => void) => ReactNode;
  /** Show a download-as-Excel icon. Defaults to false. */
  exportable?: boolean;
  /** Filename without extension. Defaults to 'export'. */
  exportFileName?: string;
  /** Position of the download icon relative to the table. Defaults to 'top-right'. */
  exportButtonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Optional CSS class for the outermost wrapper */
  className?: string;
  /** Optional inline style for the outermost wrapper */
  style?: CSSProperties;
}
