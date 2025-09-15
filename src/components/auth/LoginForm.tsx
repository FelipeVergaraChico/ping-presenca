import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { email: string; password: string }) => {
    const success = await login(values.email, values.password);
    
    if (success) {
      // Verifica se é professor ou aluno para redirecionar
      if (values.email.includes('professor')) {
        navigate('/professor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      messageApi.error('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container" style={{
      background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 35%, #A855F7 70%, #C084FC 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {contextHolder}
      <Card className="login-card">
        <div className="logo-container">
          <Title level={2} className="logo-title">Ping Presença</Title>
          <Title level={4} className="logo-subtitle">Grupo Ânima</Title>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu e-mail institucional!' },
              { type: 'email', message: 'E-mail inválido!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="E-mail institucional" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Senha" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              block
              size="large"
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
