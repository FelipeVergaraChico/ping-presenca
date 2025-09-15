import React, { useEffect } from 'react';
import { Typography, Row, Col, Button, Card } from 'antd';
import { UserOutlined, BookOutlined, ClockCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatisticCard from '../../components/ui/StatisticCard';
import AttendanceHistory from '../../components/attendance/AttendanceHistory';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useAuthStore } from '../../store/authStore';
import { useResponsive } from '../../hooks/useResponsive';

const { Title } = Typography;

const StudentDashboard: React.FC = () => {
  const { activeCourses, classes, fetchCourses, fetchClasses } = useAttendanceStore();
  const { user } = useAuthStore();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    // Buscar aulas para todas as disciplinas
    activeCourses.forEach(course => {
      fetchClasses(course.id);
    });
  }, [activeCourses, fetchClasses]);
  
  const today = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter(c => c.date === today);
  const activeClasses = classes.filter(c => c.isAttendanceActive);

  const handleParticipateInCall = () => {
    navigate('/student/courses');
  };
  
  return (
    <AppLayout>
      <div className="dashboard-header fade-in-mobile">
        <Title level={2} className="dashboard-title">Dashboard do Aluno</Title>
        <Typography.Paragraph className="dashboard-description" style={{ 
          fontSize: isMobile ? '14px' : '16px' 
        }}>
          Bem-vindo(a), {user?.name}! Aqui você pode acompanhar suas disciplinas e registrar presença nas aulas.
        </Typography.Paragraph>
      </div>
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            title="Minhas Disciplinas"
            value={activeCourses.length}
            prefix={<BookOutlined />}
            isMobile={isMobile}
            valueColor="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            title="Aulas Hoje"
            value={todayClasses.length}
            prefix={<ClockCircleOutlined />}
            isMobile={isMobile}
            valueColor="#722ed1"
          />
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <StatisticCard
            title="Chamadas Ativas"
            value={activeClasses.length}
            prefix={<UserOutlined />}
            isMobile={isMobile}
            valueColor={activeClasses.length > 0 ? '#3f8600' : '#8c8c8c'}
            message={activeClasses.length > 0 ? 'Registre sua presença agora!' : undefined}
            messageColor="#3f8600"
            showPulse={activeClasses.length > 0}
          />
        </Col>
      </Row>

      {/* Botão para participar da chamada quando há chamadas ativas */}
      {activeClasses.length > 0 && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card style={{ textAlign: 'center' }}>
              <Typography.Title level={4} style={{ marginBottom: 16 }}>
                <LoginOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Chamada Ativa Disponível!
              </Typography.Title>
              <Typography.Paragraph style={{ marginBottom: 20, color: '#666' }}>
                Há {activeClasses.length} chamada{activeClasses.length > 1 ? 's' : ''} ativa{activeClasses.length > 1 ? 's' : ''} no momento. 
                Clique no botão abaixo para registrar sua presença.
              </Typography.Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={handleParticipateInCall}
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  padding: isMobile ? '8px 24px' : '12px 32px',
                  height: 'auto',
                  fontWeight: 'bold'
                }}
                block={isMobile}
              >
                Participar da Chamada
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      {/* Histórico de Presenças do Aluno */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <AttendanceHistory 
            isEditable={false} 
            userId={user?.id}
            userRole="student"
          />
        </Col>
      </Row>
    </AppLayout>
  );
};

export default StudentDashboard;
