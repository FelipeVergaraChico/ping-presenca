import React from 'react';
import { ConfigProvider, theme } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { useTheme } from '../../hooks/useTheme';

interface ThemedConfigProviderProps {
  children: React.ReactNode;
}

const ThemedConfigProvider: React.FC<ThemedConfigProviderProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  const themeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDarkMode ? '#00796b' : '#1890ff',
      colorBgBase: isDarkMode ? '#141414' : '#ffffff',
      colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      colorBgElevated: isDarkMode ? '#262626' : '#ffffff',
      colorText: isDarkMode ? '#ffffffd9' : '#000000d9',
      colorTextSecondary: isDarkMode ? '#ffffff73' : '#00000073',
      colorBorder: isDarkMode ? '#434343' : '#d9d9d9',
    },
  };

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
