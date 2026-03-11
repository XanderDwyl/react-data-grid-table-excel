import XLSX from 'xlsx-js-style';
import type { ColumnDef } from '../types';

interface ExportOptions {
  fileName?: string;
}

/** Convert a CSS color string (#RGB, #RRGGBB) to a 6-char hex string (no #). */
function cssColorToHex(color: string): string | undefined {
  if (!color) return undefined;
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 6) return hex;
  }
  return undefined;
}

function buildCellStyle(
  bgColor?: string,
  fontColor?: string,
  bold?: boolean,
  textAlign?: string,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s: Record<string, any> = {};
  let hasStyle = false;

  const bg = cssColorToHex(bgColor ?? '');
  if (bg) {
    s.fill = { fgColor: { rgb: bg } };
    hasStyle = true;
  }

  const fc = cssColorToHex(fontColor ?? '');
  if (fc || bold) {
    s.font = {};
    if (fc) s.font.color = { rgb: fc };
    if (bold) s.font.bold = true;
    hasStyle = true;
  }

  if (textAlign) {
    s.alignment = { horizontal: textAlign };
    hasStyle = true;
  }

  return hasStyle ? s : undefined;
}

export function exportToExcel<TRow extends object>(
  columns: ColumnDef<TRow>[],
  rows: TRow[],
  options: ExportOptions = {},
): void {
  const { fileName = 'export' } = options;

  const headers = columns.map((col) => col.title);

  const data = rows.map((row) =>
    columns.map((col) => {
      const value = (row as Record<string, unknown>)[col.key];
      return value ?? '';
    }),
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Apply header styles
  columns.forEach((col, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (worksheet[cellRef]) {
      const hs = col.headerStyle;
      const style = buildCellStyle(
        hs?.backgroundColor as string | undefined,
        hs?.color as string | undefined,
        hs?.fontWeight != null && Number(hs.fontWeight) >= 700,
        hs?.textAlign as string | undefined,
      );
      if (style) worksheet[cellRef].s = style;
    }
  });

  // Apply cell styles
  rows.forEach((row, rowIdx) => {
    columns.forEach((col, colIdx) => {
      if (!col.cellStyle) return;
      const value = (row as Record<string, unknown>)[col.key];
      const css = col.cellStyle(value, row, rowIdx);
      if (!css) return;

      const cellRef = XLSX.utils.encode_cell({ r: rowIdx + 1, c: colIdx });
      if (worksheet[cellRef]) {
        const style = buildCellStyle(
          css.backgroundColor as string | undefined,
          css.color as string | undefined,
          css.fontWeight != null && Number(css.fontWeight) >= 700,
          css.textAlign as string | undefined,
        );
        if (style) worksheet[cellRef].s = style;
      }
    });
  });

  worksheet['!cols'] = columns.map((col) => ({
    wch: col.width ? Math.round(col.width / 8) : 15,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
