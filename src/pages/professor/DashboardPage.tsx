import React, { useEffect } from 'react';
import { Typography, Card, Row, Col, Progress, List, Tag, Avatar } from 'antd';
import { UserOutlined, BookOutlined, ClockCircleOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import AppLayout from '../../components/layout/AppLayout';
import AttendanceHistory from '../../components/attendance/AttendanceHistory';
import { useAttendanceStore } from '../../store/attendanceStore';
import useAuth from '../../hooks/useAuth';
import { mapKeycloakToUser } from '../../utils/auth';
import { StatisticCard } from '../../components/ui';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Title } = Typography;

const ProfessorDashboard: React.FC = () => {
  const { activeCourses, classes, fetchCourses, fetchClasses } = useAttendanceStore();
  const { keycloak } = useAuth();
  const { user } = React.useMemo(() => mapKeycloakToUser(keycloak), [keycloak]);
  
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
  const activeClass = todayClasses.find(c => c.isAttendanceActive);
  
  // Dados mockados para demonstração
  const totalStudents = 45;
  const presentStudents = 38;
  const attendancePercentage = Math.round((presentStudents / totalStudents) * 100);
  
  const mockStudents = [
    { id: '1', name: 'Ana Silva', email: 'ana@exemplo.com', enrollment: '2023001', isPresent: true },
    { id: '2', name: 'Carlos Santos', email: 'carlos@exemplo.com', enrollment: '2023002', isPresent: true },
    { id: '3', name: 'Maria Oliveira', email: 'maria@exemplo.com', enrollment: '2023003', isPresent: false },
    { id: '4', name: 'João Costa', email: 'joao@exemplo.com', enrollment: '2023004', isPresent: true },
    { id: '5', name: 'Lucia Pereira', email: 'lucia@exemplo.com', enrollment: '2023005', isPresent: true },
  ];
  
  // Dados para gráfico de rosca
  const attendanceData = {
    labels: ['Presentes', 'Ausentes'],
    datasets: [
      {
        data: [presentStudents, totalStudents - presentStudents],
        backgroundColor: ['#52c41a', '#ff4d4f'],
        borderWidth: 0,
      },
    ],
  };
  
  // Dados para gráfico de barras (histórico semanal)
  const weeklyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    datasets: [
      {
        label: 'Presença (%)',
        data: [85, 92, 78, 88, 95],
        backgroundColor: '#1890ff',
        borderRadius: 4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };
  
  return (
    <AppLayout>
      <div className="dashboard-header">
        <Title level={2} className="dashboard-title">Dashboard do Professor</Title>
        <Typography.Paragraph className="dashboard-description">
          Bem-vindo(a), {user?.name}! Aqui você pode gerenciar suas turmas e chamadas.
        </Typography.Paragraph>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <StatisticCard
              title="Total de Disciplinas"
              value={activeCourses.length}
              prefix={<BookOutlined />}
              valueColor="#1890ff"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <StatisticCard
              title="Aulas Hoje"
              value={todayClasses.length}
              prefix={<ClockCircleOutlined />}
              valueColor="#722ed1"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <StatisticCard
              title="Total de Alunos"
              value={totalStudents}
              prefix={<UserOutlined />}
              valueColor="#ff4d4f"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <StatisticCard
              title="Presentes Hoje"
              value={presentStudents}
              prefix={<CheckCircleOutlined />}
              valueColor="#52c41a"
            />
          </Card>
        </Col>
      </Row>

      {/* Seção de Chamada Ativa */}
      {activeClass && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card 
              title="📢 Chamada Ativa"
              extra={<Tag color="green">Em Andamento</Tag>}
              style={{ 
                border: '2px solid #52c41a',
                boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)'
              }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={12}>
                  <div>
                    <Typography.Text strong style={{ fontSize: '16px' }}>
                      Presença em Tempo Real
                    </Typography.Text>
                    <div style={{ marginTop: 8 }}>
                      <Progress 
                        percent={attendancePercentage} 
                        strokeColor="#52c41a"
                        format={() => `${presentStudents}/${totalStudents} (${attendancePercentage}%)`}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <List
                    size="small"
                    header={<Typography.Text strong><TeamOutlined /> Últimos Registros</Typography.Text>}
                    dataSource={mockStudents.filter(s => s.isPresent).slice(0, 3)}
                    renderItem={(student) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar size="small">{student.name[0]}</Avatar>}
                          title={student.name}
                          description={`${student.enrollment} - Presente`}
                        />
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Gráficos */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="📊 Presença de Hoje" style={{ height: '400px' }}>
            <div style={{ height: '300px' }}>
              <Doughnut data={attendanceData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="📈 Presença Semanal" style={{ height: '400px' }}>
            <div style={{ height: '300px' }}>
              <Bar data={weeklyData} options={barOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Histórico de Presenças */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <AttendanceHistory 
            isEditable={true} 
            userRole="professor"
          />
        </Col>
      </Row>
    </AppLayout>
  );
};

export default ProfessorDashboard;
