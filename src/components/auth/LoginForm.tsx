import React, { useMemo, useEffect } from 'react';
import { Button, Card, Typography, Spin, Alert } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { mapKeycloakToUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, keycloak, isInitialized } = useAuth();
  const { user } = useMemo(() => mapKeycloakToUser(keycloak), [keycloak]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="login-container" style={{
      background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 35%, #A855F7 70%, #C084FC 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card className="login-card">
        <div className="logo-container" style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} className="logo-title">Ping Presença</Title>
          <Title level={4} className="logo-subtitle" style={{ marginTop: 0 }}>Grupo Ânima</Title>
        </div>
        {!isInitialized && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
            <Typography.Paragraph style={{ marginTop: 16 }}>Conectando ao servidor de autenticação...</Typography.Paragraph>
          </div>
        )}
        {isInitialized && !isAuthenticated && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Alert
              type="info"
              showIcon
              message="Autenticação via Keycloak"
              description="Clique no botão abaixo para entrar usando sua conta institucional."
            />
            <Button
              type="primary"
              icon={<LoginOutlined />}
              size="large"
              onClick={() => login()}
              block
            >
              Entrar com Keycloak
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginForm;
