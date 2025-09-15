import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      padding: '4px 8px',
      borderRadius: '6px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease'
    }}>
      <BulbOutlined style={{ 
        color: isDarkMode ? '#faad14' : '#ffffff',
        fontSize: '14px'
      }} />
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        size="small"
        style={{
          backgroundColor: isDarkMode ? '#00796b' : '#1890ff'
        }}
      />
    </div>
  );
};

export default ThemeToggle;
