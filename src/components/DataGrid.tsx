import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { DataGridProps, ColumnDef } from '../types';
import { useSorting } from '../hooks/useSorting';
import { useEditing } from '../hooks/useEditing';
import { sortRows } from '../utils/sorting';
import useGridStyles from '../styles/useGridStyles';
import HeaderCell from './HeaderCell';
import DataCell from './DataCell';
import EditableCell from './EditableCell';

type AnyRecord = Record<string, unknown>;

function getField(row: object, key: string): unknown {
  return (row as AnyRecord)[key];
}

function getColumnLetter(index: number): string {
  let letter = '';
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode(65 + (n % 26)) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
}

/** Compute sticky left offsets for frozen columns */
function computeFrozenOffsets<TRow>(columns: ColumnDef<TRow>[]): Map<string, number> {
  const offsets = new Map<string, number>();
  let left = 0;
  for (const col of columns) {
    if (!col.frozen) break;
    offsets.set(col.key, left);
    left += col.width ?? 120;
  }
  return offsets;
}

function DataGrid<TRow extends object>({
  columns,
  rows,
  rowKey = 'id' as string & keyof TRow,
  onCellEdit,
  onCellChange,
  sort,
  onSortChange,
  showColumnLetters = false,
  onFreezeChange,
  className,
  style,
}: DataGridProps<TRow>) {
  const { styles, cx } = useGridStyles();
  const { currentSort, toggleSort } = useSorting({ sort, onSortChange });
  const { editingCell, startEditing, commitEdit, cancelEdit } = useEditing();

  const frozenOffsets = useMemo(() => computeFrozenOffsets(columns), [columns]);
  const hasFrozen = frozenOffsets.size > 0;

  const sortedRows = useMemo(() => {
    if (!currentSort.columnKey || !currentSort.direction) return rows;
    return sortRows(rows, currentSort.columnKey, currentSort.direction);
  }, [rows, currentSort]);

  function getStickyStyle(colKey: string): CSSProperties | undefined {
    if (!hasFrozen) return undefined;
    const left = frozenOffsets.get(colKey);
    if (left === undefined) return undefined;
    return {
      position: 'sticky',
      left,
      zIndex: 1,
    };
  }

  function getStickyHeaderStyle(colKey: string): CSSProperties | undefined {
    if (!hasFrozen) return undefined;
    const left = frozenOffsets.get(colKey);
    if (left === undefined) return undefined;
    return {
      position: 'sticky',
      left,
      zIndex: 3,
    };
  }

  return (
    <div className={cx(styles.gridWrapper, className)} style={style}>
      <table className={styles.table}>
        <thead>
          {showColumnLetters && (
            <tr>
              {columns.map((col, i) => (
                <th
                  key={`letter-${col.key}`}
                  className={cx(
                    styles.columnLetterCell,
                    col.frozen && styles.frozenCell,
                  )}
                  style={getStickyHeaderStyle(col.key)}
                >
                  {getColumnLetter(i)}
                </th>
              ))}
            </tr>
          )}
          <tr>
            {columns.map((col) => (
              <HeaderCell
                key={col.key}
                column={col}
                sortState={currentSort}
                onSort={toggleSort}
                stickyStyle={getStickyHeaderStyle(col.key)}
                onFreezeChange={onFreezeChange}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => {
            const keyValue = getField(row, rowKey as string);
            return (
              <tr key={String(keyValue ?? rowIndex)} className={styles.row}>
                {columns.map((col) => {
                  const isEditing =
                    editingCell?.rowIndex === rowIndex &&
                    editingCell?.columnKey === col.key;

                  if (isEditing && col.editable) {
                    return (
                      <EditableCell
                        key={col.key}
                        value={getField(row, col.key)}
                        onChange={
                          onCellChange
                            ? (val) => onCellChange(rowIndex, col.key as string & keyof TRow, val, row)
                            : undefined
                        }
                        onCommit={(val) => {
                          onCellEdit?.(
                            rowIndex,
                            col.key as string & keyof TRow,
                            val,
                            row,
                          );
                          commitEdit();
                        }}
                        onCancel={cancelEdit}
                        autoCompleteOptions={col.autoCompleteOptions}
                        stickyStyle={getStickyStyle(col.key)}
                        frozen={col.frozen}
                      />
                    );
                  }

                  return (
                    <DataCell
                      key={col.key}
                      value={getField(row, col.key)}
                      row={row}
                      rowIndex={rowIndex}
                      column={col}
                      stickyStyle={getStickyStyle(col.key)}
                      onClick={
                        col.editable
                          ? () => startEditing({ rowIndex, columnKey: col.key })
                          : undefined
                      }
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataGrid;
