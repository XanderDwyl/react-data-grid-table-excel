# react-data-grid-table

A spreadsheet-like React data grid component with cell editing, column sorting, frozen columns, and autocomplete — styled with Ant Design tokens.

## Features

- **Spreadsheet UI** — Excel/Google Sheets look and feel with borders, hover highlights, and cell selection outlines
- **Inline cell editing** — Click any editable cell to type a new value. Commit with Enter or blur, cancel with Escape
- **Autocomplete suggestions** — Provide a list of options per column for filtered, typeahead suggestions while editing
- **Column sorting** — Click headers to cycle through ascending, descending, and unsorted states. Supports controlled and uncontrolled modes
- **Frozen columns** — Pin columns to the left so they stay visible during horizontal scroll. Users can toggle freeze via checkboxes in the header
- **Dynamic cell styling** — Apply conditional background/text colors per cell based on value (e.g., status color coding)
- **Custom header styles** — Set background color, font weight, and alignment per column header
- **Custom cell renderers** — Override cell display with a custom React render function
- **TypeScript** — Full generic type inference on `DataGrid<TRow>` with exported types for `ColumnDef`, `DataGridProps`, `SortState`, and more
- **Ant Design theming** — Uses `antd-style` design tokens, so colors, fonts, and spacing follow your Ant Design theme automatically

## Installation

```bash
npm install react-data-grid-table
```

### Peer dependencies

Make sure these are installed in your project:

```bash
npm install react react-dom antd antd-style
```

| Peer dependency | Version  |
|-----------------|----------|
| `react`         | >= 18    |
| `react-dom`     | >= 18    |
| `antd`          | >= 5     |
| `antd-style`    | >= 3     |

## Quick Start

```tsx
import { useState, useMemo, useCallback } from 'react';
import { DataGrid } from 'react-data-grid-table';
import type { ColumnDef } from 'react-data-grid-table';

// --- Source data format (nested, as it comes from an API) ---

interface SenderDetail {
  connId: string;
  provider: Record<string, string>;
}

interface TicketSource {
  id: number;
  senderId: string;
  requester: string;
  dateOfTicket: string;
  dateOfSubmission: string;
  finishedDate: string;
  referenceTicket: string;
  senderDetails: SenderDetail[];
}

// --- Flat row format for the grid ---

interface TicketRow {
  _rowId: string;
  senderId: string;
  requester: string;
  dateOfTicket: string;
  dateOfSubmission: string;
  finishedDate: string;
  referenceTicket: string;
  connId: string;
  [provider: string]: unknown;
}

// --- Sample data ---

const sourceData: TicketSource[] = [
  {
    id: 1,
    senderId: 'OneAset',
    requester: 'Hastaryo',
    dateOfTicket: '12-Jan-22',
    dateOfSubmission: '',
    finishedDate: '03-Feb-22',
    referenceTicket: '134743',
    senderDetails: [
      {
        connId: 'Nadyne1',
        provider: {
          Telkomsel: 'Ready | Intl',
          'XL/Axis': 'Ready | Intl',
          Hutch: 'Ready',
          Indosat: 'In-progress',
          Smartfren: 'Ready',
        },
      },
      { connId: 'Nadyne2', provider: { Telkomsel: 'Ready | Intl' } },
      {
        connId: 'IMS',
        provider: {
          Telkomsel: 'Ready | Intl',
          'XL/Axis': 'Ready | Local',
          Hutch: 'Ready',
          Indosat: 'Ready',
          Smartfren: 'In-progress',
        },
      },
    ],
  },
];

// --- Flatten nested data into grid rows ---

function flattenTickets(tickets: TicketSource[], providers: string[]): TicketRow[] {
  const rows: TicketRow[] = [];
  for (const ticket of tickets) {
    ticket.senderDetails.forEach((detail, idx) => {
      const isFirst = idx === 0;
      const row: TicketRow = {
        _rowId: `${ticket.id}-${idx}`,
        senderId: isFirst ? ticket.senderId : '',
        requester: isFirst ? ticket.requester : '',
        dateOfTicket: isFirst ? ticket.dateOfTicket : '',
        dateOfSubmission: isFirst ? ticket.dateOfSubmission : '',
        finishedDate: isFirst ? ticket.finishedDate : '',
        referenceTicket: isFirst ? ticket.referenceTicket : '',
        connId: detail.connId,
      };
      for (const p of providers) {
        row[p] = detail.provider[p] ?? '';
      }
      rows.push(row);
    });
  }
  return rows;
}

function extractProviders(tickets: TicketSource[]): string[] {
  const set = new Set<string>();
  for (const ticket of tickets)
    for (const detail of ticket.senderDetails)
      for (const key of Object.keys(detail.provider))
        set.add(key);
  return Array.from(set);
}

// --- App ---

function App() {
  const providers = useMemo(() => extractProviders(sourceData), []);
  const [rows, setRows] = useState(() => flattenTickets(sourceData, providers));

  const columns = useMemo<ColumnDef<TicketRow>[]>(() => {
    const fixed: ColumnDef<TicketRow>[] = [
      { key: 'senderId', title: 'Sender ID', width: 100 },
      { key: 'requester', title: 'Requester', width: 110 },
      { key: 'dateOfTicket', title: 'Date of Ticket', width: 130 },
      { key: 'connId', title: 'ConnID', width: 120, sortable: true },
    ];
    const dynamic: ColumnDef<TicketRow>[] = providers.map((p) => ({
      key: p as string & keyof TicketRow,
      title: p,
      width: 130,
      editable: true,
    }));
    return [...fixed, ...dynamic];
  }, [providers]);

  const handleCellEdit = useCallback(
    (rowIndex: number, columnKey: string, newValue: unknown) => {
      setRows((prev) =>
        prev.map((row, i) => (i === rowIndex ? { ...row, [columnKey]: newValue } : row)),
      );
    },
    [],
  );

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowKey="_rowId"
      onCellEdit={handleCellEdit}
    />
  );
}
```

## API Reference

### `<DataGrid<TRow>>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TRow>[]` | *required* | Column definitions array |
| `rows` | `TRow[]` | *required* | Row data array |
| `rowKey` | `string & keyof TRow` | `'id'` | Unique key field on each row for React keys |
| `onCellEdit` | `(rowIndex, columnKey, newValue, row) => void` | — | Called when a cell value is committed (Enter / blur) |
| `onCellChange` | `(rowIndex, columnKey, newValue, row) => void` | — | Called on every keystroke while editing |
| `sort` | `SortState` | — | Controlled sort state (`{ columnKey, direction }`) |
| `onSortChange` | `(sort: SortState) => void` | — | Callback when sort changes |
| `showColumnLetters` | `boolean` | `false` | Show Excel-like column letter row (A, B, C...) |
| `onFreezeChange` | `(columnKey, frozen) => void` | — | Enables freeze checkboxes in headers. Called when toggled |
| `className` | `string` | — | CSS class for the outermost wrapper |
| `style` | `CSSProperties` | — | Inline style for the outermost wrapper |

### `ColumnDef<TRow>`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string & keyof TRow` | *required* | Unique key matching a property on `TRow` |
| `title` | `string` | *required* | Display label in the header |
| `width` | `number` | auto | Column width in pixels |
| `sortable` | `boolean` | `true` | Whether this column is sortable |
| `editable` | `boolean` | `false` | Whether cells in this column are editable |
| `frozen` | `boolean` | `false` | Pin this column to the left during horizontal scroll |
| `render` | `(value, row, rowIndex) => ReactNode` | — | Custom cell renderer |
| `cellStyle` | `(value, row, rowIndex) => CSSProperties` | — | Dynamic cell style based on value |
| `headerStyle` | `CSSProperties` | — | Custom header style |
| `headerClassName` | `string` | — | Custom header CSS class |
| `autoCompleteOptions` | `string[]` | — | Autocomplete suggestions shown while editing |

### `SortState`

```ts
interface SortState {
  columnKey: string;
  direction: 'asc' | 'desc' | null;
}
```

## Advanced Usage

### Frozen columns

Pass `onFreezeChange` to enable freeze checkboxes in each column header. Set `frozen: true` on column definitions for initially frozen columns.

```tsx
const [frozenKeys, setFrozenKeys] = useState(new Set(['id', 'name']));

const columns = allColumns.map((col) => ({
  ...col,
  frozen: frozenKeys.has(col.key),
}));

<DataGrid
  columns={columns}
  rows={data}
  onFreezeChange={(key, frozen) => {
    setFrozenKeys((prev) => {
      const next = new Set(prev);
      frozen ? next.add(key) : next.delete(key);
      return next;
    });
  }}
/>
```

### Conditional cell styling

Use `cellStyle` to apply dynamic styles based on cell values — useful for status indicators, heatmaps, or validation highlighting.

```tsx
const columns: ColumnDef<Row>[] = [
  {
    key: 'status',
    title: 'Status',
    cellStyle: (value) => {
      if (value === 'Active') return { backgroundColor: '#52c41a', color: '#fff' };
      if (value === 'Pending') return { backgroundColor: '#faad14', color: '#000' };
      return undefined;
    },
  },
];
```

### Autocomplete editing

Provide `autoCompleteOptions` on a column to show filtered suggestions while editing. Combine with `onCellEdit` to dynamically update the options list when new values are entered.

```tsx
const statusOptions = ['Ready', 'In-progress', 'Blocked', 'Done'];

const columns: ColumnDef<Row>[] = [
  {
    key: 'status',
    title: 'Status',
    editable: true,
    autoCompleteOptions: statusOptions,
  },
];
```

### Nested data sources

For API responses with nested structures, flatten the data before passing it to the grid:

```tsx
interface ApiResponse {
  id: number;
  name: string;
  details: { connectionId: string; provider: Record<string, string> }[];
}

function flatten(data: ApiResponse[]): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const item of data) {
    for (const detail of item.details) {
      rows.push({
        id: `${item.id}-${detail.connectionId}`,
        name: item.name,
        connectionId: detail.connectionId,
        ...detail.provider,
      });
    }
  }
  return rows;
}
```

## Development

```bash
# Install dependencies
npm install

# Start the demo dev server
npm run dev

# Type-check
npm run typecheck

# Build the library (ESM + CJS + types)
npm run build
```

## License

MIT
