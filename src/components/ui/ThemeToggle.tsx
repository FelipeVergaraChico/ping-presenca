import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { getTheme, toggleThemeWithTransition } from '../../utils/themeToggle';

const ThemeToggle: React.FC = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>(getTheme());

  React.useEffect(() => {
    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { mode: 'light' | 'dark' };
      if (detail?.mode) setMode(detail.mode);
    };
    window.addEventListener('theme-change', onThemeChange as EventListener);
    return () => window.removeEventListener('theme-change', onThemeChange as EventListener);
  }, []);

  const toggle = () => toggleThemeWithTransition();

  const isDark = mode === 'dark';
  const icon = isDark ? <BulbOutlined /> : <MoonOutlined />;
  const label = isDark ? 'Modo claro' : 'Modo escuro';

  return (
    <Tooltip title={label} placement="bottom">
      <Button
        type="text"
        aria-label={label}
        onClick={toggle}
        icon={icon}
        style={{ color: 'white' }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
