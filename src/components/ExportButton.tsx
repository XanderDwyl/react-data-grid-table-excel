import React, { useCallback } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnDef } from '../types';
import { exportToExcel } from '../utils/exportToExcel';
import useGridStyles from '../styles/useGridStyles';

interface ExportButtonProps<TRow extends object> {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  fileName: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

function ExportButtonInner<TRow extends object>({
  columns,
  rows,
  fileName,
  position,
}: ExportButtonProps<TRow>) {
  const { styles, cx } = useGridStyles();

  const handleClick = useCallback(() => {
    exportToExcel(columns, rows, { fileName });
  }, [columns, rows, fileName]);

  const positionClass =
    position === 'top-left'
      ? styles.exportButtonTopLeft
      : position === 'bottom-left'
        ? styles.exportButtonBottomLeft
        : position === 'bottom-right'
          ? styles.exportButtonBottomRight
          : styles.exportButtonTopRight;

  return (
    <div className={cx(styles.exportButtonWrapper, positionClass)}>
      <DownloadOutlined className={styles.exportButtonIcon} onClick={handleClick} />
    </div>
  );
}

const ExportButton = React.memo(ExportButtonInner) as typeof ExportButtonInner;

export default ExportButton;
