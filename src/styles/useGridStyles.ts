import { createStyles } from 'antd-style';

const useGridStyles = createStyles(({ token, css }) => ({
  gridWrapper: css`
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadius}px;
    overflow-x: auto;
    overflow-y: auto;
    font-family: ${token.fontFamily};
    font-size: ${token.fontSize}px;
    position: relative;
  `,
  table: css`
    min-width: 100%;
    width: max-content;
    border-collapse: collapse;
    table-layout: fixed;
  `,
  columnLetterCell: css`
    background: #f0f0f0;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    border-right: 1px solid ${token.colorBorderSecondary};
    padding: 2px 4px;
    text-align: center;
    font-weight: normal;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
    user-select: none;

    &:last-child {
      border-right: none;
    }
  `,
  columnLetterContent: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
  `,
  freezeCheckbox: css`
    .ant-checkbox {
      top: 0;
    }
  `,
  headerCell: css`
    background: ${token.colorFillQuaternary};
    border-bottom: 2px solid ${token.colorBorderSecondary};
    border-right: 1px solid ${token.colorBorderSecondary};
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    text-align: left;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextHeading};
    user-select: none;
    white-space: nowrap;
    position: relative;

    &:last-child {
      border-right: none;
    }
  `,
  headerCellContent: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  headerCellSortable: css`
    cursor: pointer;

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  sortIndicator: css`
    margin-left: 4px;
    font-size: 10px;
    color: ${token.colorTextQuaternary};
    vertical-align: middle;
  `,
  sortIndicatorActive: css`
    color: ${token.colorPrimary};
  `,
  row: css`
    &:hover {
      background: ${token.colorPrimaryBg};
    }
  `,
  cell: css`
    border-bottom: 1px solid ${token.colorBorderSecondary};
    border-right: 1px solid ${token.colorBorderSecondary};
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    color: ${token.colorText};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:last-child {
      border-right: none;
    }
  `,
  cellEditable: css`
    cursor: pointer;

    &:hover {
      outline: 2px solid ${token.colorPrimary};
      outline-offset: -2px;
    }
  `,
  editCell: css`
    padding: 0;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    border-right: 1px solid ${token.colorBorderSecondary};

    &:last-child {
      border-right: none;
    }
  `,
  frozenCell: css`
    background: ${token.colorBgContainer};
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.08);
  `,
  editInput: css`
    width: 100%;
    height: 100%;
    border: none;
    outline: 2px solid ${token.colorPrimary};
    outline-offset: -2px;
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    font-size: inherit;
    font-family: inherit;
    background: ${token.colorBgContainer};
    color: ${token.colorText};
    box-sizing: border-box;

    &:focus {
      outline: 2px solid ${token.colorPrimary};
      outline-offset: -2px;
    }
  `,
  editAutoComplete: css`
    width: 100% !important;

    .ant-select-selector {
      border: none !important;
      box-shadow: none !important;
      outline: 2px solid ${token.colorPrimary} !important;
      outline-offset: -2px;
      padding: ${token.paddingXS}px ${token.paddingSM}px !important;
      font-size: inherit;
      background: ${token.colorBgContainer} !important;
      border-radius: 0 !important;
      height: auto !important;
    }

    .ant-select-selection-search-input {
      font-size: inherit !important;
      font-family: inherit !important;
    }
  `,
  editAutoCompleteDropdown: css`
    .ant-select-item {
      font-size: ${token.fontSize}px;
      padding: ${token.paddingXS}px ${token.paddingSM}px;
    }
  `,
}));

export default useGridStyles;
