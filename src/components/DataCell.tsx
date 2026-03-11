import React from 'react';
import type { CSSProperties } from 'react';
import type { ColumnDef } from '../types';
import useGridStyles from '../styles/useGridStyles';

interface DataCellProps<TRow> {
  value: unknown;
  row: TRow;
  rowIndex: number;
  column: ColumnDef<TRow>;
  onClick?: () => void;
  stickyStyle?: CSSProperties;
}

function DataCell<TRow>({ value, row, rowIndex, column, onClick, stickyStyle }: DataCellProps<TRow>) {
  const { styles, cx } = useGridStyles();

  const displayValue = column.render
    ? column.render(value, row, rowIndex)
    : value == null
      ? ''
      : String(value);

  const dynamicStyle = column.cellStyle?.(value, row, rowIndex);

  const mergedStyle: CSSProperties = {
    ...dynamicStyle,
    ...stickyStyle,
  };

  return (
    <td
      className={cx(
        styles.cell,
        column.editable && styles.cellEditable,
        column.frozen && styles.frozenCell,
      )}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      onClick={onClick}
    >
      {displayValue}
    </td>
  );
}

export default React.memo(DataCell) as typeof DataCell;
