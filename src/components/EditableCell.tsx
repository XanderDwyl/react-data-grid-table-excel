import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { AutoComplete } from 'antd';
import useGridStyles from '../styles/useGridStyles';

interface EditableCellProps {
  value: unknown;
  onCommit: (newValue: string) => void;
  onCancel: () => void;
  onChange?: (newValue: string) => void;
  autoCompleteOptions?: string[];
  stickyStyle?: CSSProperties;
  frozen?: boolean;
}

function EditableCell({
  value,
  onCommit,
  onCancel,
  onChange,
  autoCompleteOptions,
  stickyStyle,
  frozen,
}: EditableCellProps) {
  const { styles, cx } = useGridStyles();
  const [inputValue, setInputValue] = useState(value == null ? '' : String(value));
  const wrapperRef = useRef<HTMLTableCellElement>(null);
  const committedRef = useRef(false);

  useEffect(() => {
    // Focus the input inside AutoComplete after mount
    const input = wrapperRef.current?.querySelector('input');
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const filteredOptions = useMemo(() => {
    if (!autoCompleteOptions) return [];
    if (!inputValue) return autoCompleteOptions.map((v) => ({ value: v }));
    const lower = inputValue.toLowerCase();
    return autoCompleteOptions
      .filter((opt) => opt.toLowerCase().includes(lower))
      .map((v) => ({ value: v }));
  }, [autoCompleteOptions, inputValue]);

  const handleChange = (val: string) => {
    setInputValue(val);
    onChange?.(val);
  };

  const doCommit = (val: string) => {
    if (committedRef.current) return;
    committedRef.current = true;
    onCommit(val);
  };

  const handleSelect = (val: string) => {
    setInputValue(val);
    onChange?.(val);
    doCommit(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Let AutoComplete handle selection first; commit on next tick
      setTimeout(() => doCommit(inputValue), 0);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    // Small delay so onSelect fires before blur
    setTimeout(() => doCommit(inputValue), 100);
  };

  return (
    <td
      ref={wrapperRef}
      className={cx(styles.editCell, frozen && styles.frozenCell)}
      style={stickyStyle}
    >
      {autoCompleteOptions && autoCompleteOptions.length > 0 ? (
        <AutoComplete
          value={inputValue}
          options={filteredOptions}
          onChange={handleChange}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          open
          className={styles.editAutoComplete}
          popupClassName={styles.editAutoCompleteDropdown}
        />
      ) : (
        <input
          className={styles.editInput}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLInputElement>}
          onBlur={() => doCommit(inputValue)}
        />
      )}
    </td>
  );
}

export default React.memo(EditableCell);
