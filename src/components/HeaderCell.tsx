import React from 'react';
import type { CSSProperties } from 'react';
import { Tooltip, Checkbox } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import type { ColumnDef, SortState } from '../types';
import useGridStyles from '../styles/useGridStyles';

interface HeaderCellProps<TRow> {
  column: ColumnDef<TRow>;
  sortState: SortState;
  onSort: (columnKey: string) => void;
  stickyStyle?: CSSProperties;
  onFreezeChange?: (columnKey: string, frozen: boolean) => void;
  themeBg?: string;
}

function HeaderCell<TRow>({
  column,
  sortState,
  onSort,
  stickyStyle,
  onFreezeChange,
  themeBg,
}: HeaderCellProps<TRow>) {
  const { styles, cx } = useGridStyles();
  const isSortable = column.sortable !== false;
  const isActive = sortState.columnKey === column.key && sortState.direction !== null;

  const handleClick = () => {
    if (isSortable) {
      onSort(column.key);
    }
  };

  const mergedStyle: CSSProperties = {
    ...(column.width ? { width: column.width } : {}),
    ...column.headerStyle,
    ...stickyStyle,
    ...(themeBg ? { backgroundColor: themeBg } : {}),
  };

  return (
    <th
      className={cx(
        styles.headerCell,
        isSortable && styles.headerCellSortable,
        column.frozen && styles.frozenCell,
        column.headerClassName,
      )}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      onClick={handleClick}
    >
      <div className={styles.headerCellContent}>
        {onFreezeChange && (
          <Tooltip title={column.frozen ? `Unfreeze: ${column.title}` : `Freeze: ${column.title}`} placement="top">
            <Checkbox
              checked={!!column.frozen}
              onChange={(e) => {
                e.stopPropagation();
                onFreezeChange(column.key, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.freezeCheckbox}
            />
          </Tooltip>
        )}
        <span>
          {column.title}
          {isSortable && (
            <span className={cx(styles.sortIndicator, isActive && styles.sortIndicatorActive)}>
              {isActive && sortState.direction === 'asc' && <CaretUpOutlined />}
              {isActive && sortState.direction === 'desc' && <CaretDownOutlined />}
              {!isActive && <CaretUpOutlined style={{ opacity: 0.3 }} />}
            </span>
          )}
        </span>
      </div>
    </th>
  );
}

export default React.memo(HeaderCell) as typeof HeaderCell;
