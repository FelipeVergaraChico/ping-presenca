import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Typography, Drawer } from 'antd';
import { LogoutOutlined, UserOutlined, BookOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { mapKeycloakToUser } from '../../utils/auth';
import { useResponsive } from '../../hooks/useResponsive';
import HamburgerMenu from '../ui/HamburgerMenu';
import ThemeToggle from '../ui/ThemeToggle';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { keycloak, logout } = useAuth();
  const { user } = React.useMemo(() => mapKeycloakToUser(keycloak), [keycloak]);
  const { isMobile } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isStudent = user?.role === 'student';

  const menuItems = [
    {
      key: `/dashboard`,
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: `/courses`,
      icon: <BookOutlined />,
      label: 'Disciplinas',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const sidebarContent = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
      onClick={handleMenuClick}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 24px',
        background: '#001529',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <span style={{ marginRight: 12 }}>
              <HamburgerMenu
                isActive={mobileMenuOpen}
                onClick={toggleMobileMenu}
                ariaLabel="Abrir menu de navegação"
              />
            </span>
          )}
          <Title level={isMobile ? 4 : 3} style={{ color: 'white', margin: 0 }}>
            {isMobile ? 'Ping' : 'Ping Presença'}
          </Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isMobile && (
            <Text style={{ color: 'white', marginRight: 12 }}>
              {user?.givenName} {user?.familyName}
            </Text>
          )}
          <ThemeToggle />
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ color: 'white' }}
            aria-label="Sair do sistema"
            className="touch-target"
          />
        </div>
      </Header>
      
      <Layout>
        {isMobile ? (
          <Drawer
            title="Menu de Navegação"
            placement="left"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            width={280}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ 
              padding: '16px', 
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fafafa'
            }}>
              <Text strong>{user?.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {isStudent ? 'Aluno' : 'Professor'}
              </Text>
            </div>
            {sidebarContent}
          </Drawer>
        ) : (
          <Sider width={200} style={{ background: '#fff' }}>
            {sidebarContent}
          </Sider>
        )}
        
        <Layout style={{ 
          padding: isMobile ? '12px' : '24px',
          marginLeft: isMobile ? 0 : undefined 
        }}>
          <Content style={{
            padding: isMobile ? 16 : 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
            borderRadius: 4,
            position: 'relative'
          }}>
            <div className="fade-in-mobile">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
