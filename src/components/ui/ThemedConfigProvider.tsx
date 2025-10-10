import React from 'react';
import { ConfigProvider, theme } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { getTheme } from '../../utils/themeToggle';

interface ThemedConfigProviderProps {
  children: React.ReactNode;
}

const ThemedConfigProvider: React.FC<ThemedConfigProviderProps> = ({ children }) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>(getTheme());

  React.useEffect(() => {
    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { mode: 'light' | 'dark' };
      if (detail?.mode) setMode(detail.mode);
    };
    window.addEventListener('theme-change', onThemeChange as EventListener);
    return () => window.removeEventListener('theme-change', onThemeChange as EventListener);
  }, []);

  const isDark = mode === 'dark';
  const themeConfig = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      colorBgBase: isDark ? '#0f172a' : '#ffffff',
      colorBgContainer: isDark ? '#0f172a' : '#ffffff',
      colorBgElevated: isDark ? '#111827' : '#ffffff',
      colorText: isDark ? 'rgba(255,255,255,0.92)' : '#000000d9',
      colorTextSecondary: isDark ? 'rgba(255,255,255,0.65)' : '#00000073',
      colorBorder: isDark ? '#243041' : '#d9d9d9',
    },
  } as const;

  return (
    <ConfigProvider 
      locale={ptBR} 
      theme={themeConfig}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemedConfigProvider;
