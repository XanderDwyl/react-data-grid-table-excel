import React, { type ReactNode } from 'react';
import { FloatButton } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';

interface ThemeFloatButtonProps {
  onClick: () => void;
  themeButtonRender?: (onClick: () => void) => ReactNode;
}

function ThemeFloatButtonInner({ onClick, themeButtonRender }: ThemeFloatButtonProps) {
  if (themeButtonRender) {
    return <>{themeButtonRender(onClick)}</>;
  }

  return (
    <FloatButton
      icon={<BgColorsOutlined />}
      onClick={onClick}
      tooltip="Theme Settings"
      style={{ insetInlineEnd: 24 }}
    />
  );
}

const ThemeFloatButton = React.memo(ThemeFloatButtonInner);

export default ThemeFloatButton;
