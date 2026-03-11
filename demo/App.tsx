import { useState, useMemo, useCallback, useRef } from 'react';
import { ConfigProvider, ColorPicker } from 'antd';
import type { ColorPickerProps } from 'antd';
import { DataGrid } from 'react-data-grid-table';
import type { ColumnDef } from 'react-data-grid-table';

// =====================================================
// STATUS COLOR MAP (dynamic, stateful)
// =====================================================

interface StatusStyle {
  bg: string;
  color: string;
}

const DEFAULT_STATUS_COLORS: Record<string, StatusStyle> = {
  'Ready | Intl': { bg: '#4472C4', color: '#fff' },
  'Ready | Local': { bg: '#7030A0', color: '#fff' },
  'In-progress': { bg: '#FFFF00', color: '#006100' },
  'Ready': { bg: '#BF00FF', color: '#fff' },
};

// Generate a random distinct color for new statuses
function randomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
}

function contrastColor(bg: string): string {
  // Simple luminance check for hex or hsl
  const el = document.createElement('div');
  el.style.color = bg;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);
  const match = computed.match(/\d+/g);
  if (!match) return '#000';
  const [r, g, b] = match.map(Number);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000' : '#fff';
}

// =====================================================
// SOURCE DATA FORMAT (nested — as it comes from an API)
// =====================================================

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

interface TicketRow {
  _rowId: string;
  _isFirstInGroup: boolean;
  senderId: string;
  requester: string;
  dateOfTicket: string;
  dateOfSubmission: string;
  finishedDate: string;
  referenceTicket: string;
  connId: string;
  [provider: string]: unknown;
}

// =====================================================
// FLATTEN + EXTRACT
// =====================================================

function flattenTickets(tickets: TicketSource[], providers: string[]): TicketRow[] {
  const rows: TicketRow[] = [];
  for (const ticket of tickets) {
    ticket.senderDetails.forEach((detail, detailIdx) => {
      const isFirst = detailIdx === 0;
      const row: TicketRow = {
        _rowId: `${ticket.id}-${detailIdx}`,
        _isFirstInGroup: isFirst,
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
  for (const ticket of tickets) {
    for (const detail of ticket.senderDetails) {
      for (const key of Object.keys(detail.provider)) {
        set.add(key);
      }
    }
  }
  return Array.from(set);
}

// =====================================================
// SAMPLE SOURCE DATA
// =====================================================

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
      {
        connId: 'TKDI/Siskom',
        provider: {
          Telkomsel: 'Ready | Local',
          'XL/Axis': 'In-progress',
          Hutch: 'Ready',
          Indosat: 'In-progress',
          Smartfren: 'In-progress',
        },
      },
      {
        connId: 'Cakraflash',
        provider: {
          Telkomsel: 'In-progress',
          'XL/Axis': 'In-progress',
          Hutch: 'Ready',
          Indosat: 'Ready',
          Smartfren: 'In-progress',
        },
      },
      { connId: 'Dartmedia', provider: { Indosat: 'Ready' } },
      {
        connId: 'Mitracomm',
        provider: {
          Telkomsel: 'Ready | Intl',
          'XL/Axis': 'In-progress',
          Hutch: 'In-progress',
        },
      },
      { connId: 'ValueFirst', provider: { Telkomsel: 'In-progress' } },
    ],
  },
  {
    id: 2,
    senderId: 'TwoAset',
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
      {
        connId: 'TKDI/Siskom',
        provider: {
          Telkomsel: 'Ready | Local',
          'XL/Axis': 'In-progress',
          Hutch: 'Ready',
          Indosat: 'In-progress',
          Smartfren: 'In-progress',
        },
      },
      {
        connId: 'Cakraflash',
        provider: {
          Telkomsel: 'In-progress',
          'XL/Axis': 'In-progress',
          Hutch: 'Ready',
          Indosat: 'Ready',
          Smartfren: 'In-progress',
        },
      },
      { connId: 'Dartmedia', provider: { Indosat: 'Ready' } },
      {
        connId: 'Mitracomm',
        provider: {
          Telkomsel: 'Ready | Intl',
          'XL/Axis': 'In-progress',
          Hutch: 'In-progress',
        },
      },
      { connId: 'ValueFirst', provider: { Telkomsel: 'In-progress' } },
    ],
  },
];

// --- Header styles ---

const fixedHeaderStyle = {
  backgroundColor: '#00B0F0',
  color: '#000',
  fontWeight: 700 as const,
};

const dynamicHeaderStyle = {
  backgroundColor: '#FFFF00',
  color: '#000',
  fontWeight: 700 as const,
  textAlign: 'center' as const,
};

const FIXED_COLUMN_KEYS = [
  'senderId', 'requester', 'dateOfTicket', 'dateOfSubmission',
  'finishedDate', 'referenceTicket', 'connId',
] as const;

// =====================================================
// LEGEND ITEM (with color picker)
// =====================================================

function LegendItem({
  label,
  bg,
  onColorChange,
}: {
  label: string;
  bg: string;
  onColorChange: (label: string, newBg: string) => void;
}) {
  const handleChange: ColorPickerProps['onChangeComplete'] = (color) => {
    onColorChange(label, color.toHexString());
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <ColorPicker
        value={bg}
        size="small"
        onChangeComplete={handleChange}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            backgroundColor: bg,
            border: '1px solid #ccc',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        />
      </ColorPicker>
      <span style={{ color: '#333' }}>{label}</span>
    </span>
  );
}

// =====================================================
// APP
// =====================================================

export default function App() {
  const [data] = useState(sourceData);

  // Dynamic status color map
  const [statusColors, setStatusColors] = useState<Record<string, StatusStyle>>(
    DEFAULT_STATUS_COLORS,
  );
  const statusColorsRef = useRef(statusColors);
  statusColorsRef.current = statusColors;

  const getStatusCellStyle = useCallback((value: unknown) => {
    const str = value as string;
    if (!str) return undefined;
    const mapping = statusColorsRef.current[str];
    if (!mapping) return undefined;
    return {
      backgroundColor: mapping.bg,
      color: mapping.color,
      fontWeight: 600 as const,
    };
  }, []);

  const handleLegendColorChange = useCallback((label: string, newBg: string) => {
    setStatusColors((prev) => ({
      ...prev,
      [label]: { bg: newBg, color: contrastColor(newBg) },
    }));
  }, []);

  // Add a new status to the color map if it doesn't exist
  const ensureStatus = useCallback((value: string) => {
    if (!value || statusColorsRef.current[value]) return;
    const bg = randomColor();
    setStatusColors((prev) => ({
      ...prev,
      [value]: { bg, color: contrastColor(bg) },
    }));
  }, []);

  const providers = useMemo(() => extractProviders(data), [data]);

  const [rows, setRows] = useState<TicketRow[]>([]);
  useMemo(() => {
    setRows(flattenTickets(data, providers));
  }, [data, providers]);

  const allColumnKeys = useMemo(
    () => [...FIXED_COLUMN_KEYS, ...providers],
    [providers],
  );

  const [frozenKeys, setFrozenKeys] = useState<Set<string>>(
    () => new Set(FIXED_COLUMN_KEYS),
  );

  const toggleFrozen = useCallback((key: string, checked: boolean) => {
    setFrozenKeys((prev) => {
      const next = new Set(prev);
      if (checked) {
        const idx = allColumnKeys.indexOf(key);
        for (let i = 0; i <= idx; i++) next.add(allColumnKeys[i]);
      } else {
        const idx = allColumnKeys.indexOf(key);
        for (let i = idx; i < allColumnKeys.length; i++) next.delete(allColumnKeys[i]);
      }
      return next;
    });
  }, [allColumnKeys]);

  // Autocomplete options derived from current status keys
  const statusOptions = useMemo(() => Object.keys(statusColors), [statusColors]);

  const columns = useMemo<ColumnDef<TicketRow>[]>(() => {
    const fixedColumns: ColumnDef<TicketRow>[] = [
      { key: 'senderId', title: 'Sender ID', width: 100, headerStyle: fixedHeaderStyle, sortable: false },
      { key: 'requester', title: 'Requester', width: 110, headerStyle: fixedHeaderStyle, sortable: false },
      { key: 'dateOfTicket', title: 'Date of Ticket', width: 130, headerStyle: fixedHeaderStyle, sortable: false },
      { key: 'dateOfSubmission', title: 'Date of Submission', width: 155, headerStyle: fixedHeaderStyle, sortable: false },
      { key: 'finishedDate', title: 'Finished Date', width: 120, headerStyle: fixedHeaderStyle, sortable: false },
      { key: 'referenceTicket', title: 'Reference Ticket', width: 135, headerStyle: fixedHeaderStyle, sortable: false },
      { key: 'connId', title: 'ConnID', width: 120, headerStyle: fixedHeaderStyle, sortable: true },
    ];

    const providerColumns: ColumnDef<TicketRow>[] = providers.map((provider) => ({
      key: provider as string & keyof TicketRow,
      title: provider,
      width: 130,
      headerStyle: dynamicHeaderStyle,
      sortable: false,
      editable: true,
      cellStyle: getStatusCellStyle,
      autoCompleteOptions: statusOptions,
    }));

    const all = [...fixedColumns, ...providerColumns];
    return all.map((col) => ({
      ...col,
      frozen: frozenKeys.has(col.key),
    }));
  }, [providers, frozenKeys, statusOptions, getStatusCellStyle]);

  const updateRow = useCallback(
    (rowIndex: number, columnKey: string, newValue: unknown) => {
      setRows((prev) =>
        prev.map((row, i) =>
          i === rowIndex ? { ...row, [columnKey]: newValue } : row,
        ),
      );
    },
    [],
  );

  const handleCellEdit = useCallback(
    (rowIndex: number, columnKey: string, newValue: unknown) => {
      const val = String(newValue).trim();
      if (val) ensureStatus(val);
      updateRow(rowIndex, columnKey, val);
    },
    [updateRow, ensureStatus],
  );

  const handleCellChange = useCallback(
    (rowIndex: number, columnKey: string, newValue: unknown) => {
      updateRow(rowIndex, columnKey, newValue);
    },
    [updateRow],
  );

  return (
    <ConfigProvider>
      <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
        <h2 style={{ marginBottom: 16 }}>Ticket Connectivity Status</h2>

        {/* Legend — click color swatch to change */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap', fontSize: 13, alignItems: 'center' }}>
          {Object.entries(statusColors).map(([label, { bg }]) => (
            <LegendItem
              key={label}
              label={label}
              bg={bg}
              onColorChange={handleLegendColorChange}
            />
          ))}
          <span style={{ color: '#999', fontStyle: 'italic', marginLeft: 8 }}>
            Click a color to change it
          </span>
        </div>

        <DataGrid
          columns={columns}
          rows={rows}
          rowKey="_rowId"
          onCellEdit={handleCellEdit}
          onCellChange={handleCellChange}
          onFreezeChange={toggleFrozen}
        />
      </div>
    </ConfigProvider>
  );
}
