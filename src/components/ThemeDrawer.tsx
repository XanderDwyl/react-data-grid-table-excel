import React, { useState } from 'react';
import { Drawer, Collapse, ColorPicker, InputNumber, Input, Button, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { GridTheme } from '../types';

interface ThemeDrawerProps {
  open: boolean;
  onClose: () => void;
  currentTheme: GridTheme;
  updateTheme: (partial: Partial<GridTheme>) => void;
  setStatusColor: (label: string, bg: string, color: string) => void;
  removeStatusColor: (label: string) => void;
}

function GridColorsSection({
  grid,
  onChange,
}: {
  grid: GridTheme['grid'];
  onChange: (grid: NonNullable<GridTheme['grid']>) => void;
}) {
  const fields: { key: keyof NonNullable<GridTheme['grid']>; label: string }[] = [
    { key: 'headerBg', label: 'Header Background' },
    { key: 'headerColor', label: 'Header Text Color' },
    { key: 'cellBorderColor', label: 'Cell Border Color' },
    { key: 'rowHoverBg', label: 'Row Hover Background' },
    { key: 'frozenHeaderBg', label: 'Frozen Header Background' },
    { key: 'unfrozenHeaderBg', label: 'Unfrozen Header Background' },
    { key: 'frozenColumnShadow', label: 'Frozen Column Shadow' },
    { key: 'editOutlineColor', label: 'Edit Outline Color' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {fields.map(({ key, label }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13 }}>{label}</span>
          <ColorPicker
            size="small"
            value={grid?.[key] ?? undefined}
            onChangeComplete={(color) => {
              onChange({ ...grid, [key]: color.toHexString() });
            }}
          />
        </div>
      ))}
    </div>
  );
}

function TokensSection({
  tokens,
  onChange,
}: {
  tokens: GridTheme['tokens'];
  onChange: (tokens: NonNullable<GridTheme['tokens']>) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13 }}>Primary Color</span>
        <ColorPicker
          size="small"
          value={tokens?.colorPrimary ?? undefined}
          onChangeComplete={(color) => {
            onChange({ ...tokens, colorPrimary: color.toHexString() });
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13 }}>Font Size</span>
        <InputNumber
          size="small"
          min={10}
          max={24}
          value={tokens?.fontSize}
          onChange={(val) => {
            if (val != null) onChange({ ...tokens, fontSize: val });
          }}
          style={{ width: 80 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13 }}>Border Radius</span>
        <InputNumber
          size="small"
          min={0}
          max={20}
          value={tokens?.borderRadius}
          onChange={(val) => {
            if (val != null) onChange({ ...tokens, borderRadius: val });
          }}
          style={{ width: 80 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13 }}>Font Family</span>
        <Input
          size="small"
          value={tokens?.fontFamily ?? ''}
          onChange={(e) => {
            onChange({ ...tokens, fontFamily: e.target.value || undefined });
          }}
          style={{ width: 160 }}
          placeholder="e.g. monospace"
        />
      </div>
    </div>
  );
}

function StatusColorsSection({
  statusColors,
  setStatusColor,
  removeStatusColor,
}: {
  statusColors?: Record<string, { bg: string; color: string }>;
  setStatusColor: (label: string, bg: string, color: string) => void;
  removeStatusColor: (label: string) => void;
}) {
  const [newLabel, setNewLabel] = useState('');

  const entries = Object.entries(statusColors ?? {});

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label || statusColors?.[label]) return;
    setStatusColor(label, '#1677ff', '#ffffff');
    setNewLabel('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {entries.map(([label, { bg, color }]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </span>
          <ColorPicker
            size="small"
            value={bg}
            onChangeComplete={(c) => setStatusColor(label, c.toHexString(), color)}
          />
          <ColorPicker
            size="small"
            value={color}
            onChangeComplete={(c) => setStatusColor(label, bg, c.toHexString())}
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => removeStatusColor(label)}
            danger
          />
        </div>
      ))}
      <Space.Compact style={{ marginTop: 4 }}>
        <Input
          size="small"
          placeholder="New status label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onPressEnter={handleAdd}
        />
        <Button size="small" icon={<PlusOutlined />} onClick={handleAdd} />
      </Space.Compact>
    </div>
  );
}

function ThemeDrawerInner({
  open,
  onClose,
  currentTheme,
  updateTheme,
  setStatusColor,
  removeStatusColor,
}: ThemeDrawerProps) {
  const items = [
    {
      key: 'grid',
      label: 'Grid Colors',
      children: (
        <GridColorsSection
          grid={currentTheme.grid}
          onChange={(grid) => updateTheme({ grid })}
        />
      ),
    },
    {
      key: 'tokens',
      label: 'Ant Design Tokens',
      children: (
        <TokensSection
          tokens={currentTheme.tokens}
          onChange={(tokens) => updateTheme({ tokens })}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status Colors',
      children: (
        <StatusColorsSection
          statusColors={currentTheme.statusColors}
          setStatusColor={setStatusColor}
          removeStatusColor={removeStatusColor}
        />
      ),
    },
  ];

  return (
    <Drawer
      title="Theme Settings"
      open={open}
      onClose={onClose}
      width={340}
      mask={false}
    >
      <Collapse
        defaultActiveKey={['grid', 'tokens', 'status']}
        ghost
        items={items}
      />
    </Drawer>
  );
}

const ThemeDrawer = React.memo(ThemeDrawerInner);

export default ThemeDrawer;
