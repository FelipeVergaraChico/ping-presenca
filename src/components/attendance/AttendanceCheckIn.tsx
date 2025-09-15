import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Input, Form, List, Tag, Row, Col } from 'antd';
import { CheckCircleOutlined, FieldTimeOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useResponsive } from '../../hooks/useResponsive';
import { useLocation } from 'react-router-dom';
import AttendanceSuccess from './AttendanceSuccess';
import { showToast } from '../../utils/toast';
import type { Course } from '../../types';
import type { Class } from '../../types';

const { Title, Text } = Typography;

const AttendanceCheckIn: React.FC = () => {
  const {
    activeCourses,
    classes,
    isLoading,
    fetchCourses,
    fetchClasses,
    markAttendance
  } = useAttendanceStore();
  
  const { isMobile } = useResponsive();
  const location = useLocation();
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    course: Course;
    classInfo: Class;
  } | null>(null);
  
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

  // Filtrar aulas de hoje
  const todayClasses = classes.filter(c => c.date === today);

  // Detectar código na URL (vindo do QR Code)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const codigoFromUrl = urlParams.get('codigo');
    
    const autoSubmit = async (code: string) => {
      try {
        const success = await markAttendance(code);
        
        if (success) {
          // Encontrar a aula e curso correspondentes
          const currentClass = todayClasses.find(c => c.isAttendanceActive);
          const course = currentClass ? activeCourses.find(c => c.id === currentClass.courseId) : null;
          
          if (currentClass && course) {
            setSuccessData({ course, classInfo: currentClass });
            setShowSuccessModal(true);
          } else {
            showToast.success('Presença registrada via QR Code', 'Sua presença foi registrada automaticamente!');
          }
          
          form.resetFields();
          
          // Limpar URL
          window.history.replaceState({}, '', location.pathname);
        } else {
          showToast.error('Código QR inválido', 'Código inválido ou expirado.');
        }
      } catch {
        showToast.error('Erro', 'Ocorreu um erro ao registrar presença via QR Code.');
      }
    };
    
    if (codigoFromUrl && codigoFromUrl.length === 6) {
      form.setFieldsValue({ code: codigoFromUrl });
      // Auto-submeter o formulário se o código vier da URL
      autoSubmit(codigoFromUrl);
    }
  }, [location.search, location.pathname, form, markAttendance, activeCourses, todayClasses]);
  
  const handleSubmit = async (values: { code: string }) => {
    setSubmitLoading(true);
    
    try {
      const success = await markAttendance(values.code);
      
      if (success) {
        // Encontrar a aula e curso correspondentes
        const currentClass = todayClasses.find(c => c.isAttendanceActive);
        const course = currentClass ? activeCourses.find(c => c.id === currentClass.courseId) : null;
        
        if (currentClass && course) {
          setSuccessData({ course, classInfo: currentClass });
          setShowSuccessModal(true);
        } else {
          showToast.success('Presença registrada', 'Sua presença foi registrada com sucesso!');
        }
        
        form.resetFields();
        
        // Limpar URL se veio do QR Code
        if (location.search.includes('codigo=')) {
          window.history.replaceState({}, '', location.pathname);
        }
      } else {
        showToast.error('Código inválido', 'Código inválido ou expirado. Tente novamente.');
      }
    } catch {
      showToast.error('Erro', 'Ocorreu um erro ao registrar presença.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  return (
    <div className="fade-in-mobile">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Registro de Presença" loading={isLoading}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={4}>
                <QrcodeOutlined style={{ marginRight: 8 }} />
                Informe o código de presença
              </Title>
              <Text type="secondary">
                Digite o código de 6 dígitos fornecido pelo professor ou escaneie o QR Code
              </Text>
              
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                style={{ maxWidth: isMobile ? '100%' : 300, margin: '24px auto' }}
              >
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: 'Informe o código de presença' },
                    { len: 6, message: 'O código deve ter 6 dígitos' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Código de 6 dígitos"
                    maxLength={6}
                    style={{ 
                      textAlign: 'center', 
                      fontSize: isMobile ? 18 : 20,
                      letterSpacing: '2px'
                    }}
                    className="interactive-element"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<CheckCircleOutlined />}
                    loading={submitLoading}
                    block
                    size="large"
                    className="btn-responsive interactive-element"
                  >
                    Confirmar Presença
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Aulas de Hoje" 
            loading={isLoading}
            extra={
              <Tag color={todayClasses.length > 0 ? 'blue' : 'default'}>
                {todayClasses.length} aula{todayClasses.length !== 1 ? 's' : ''}
              </Tag>
            }
          >
            {todayClasses.length > 0 ? (
              <List
                dataSource={todayClasses}
                renderItem={item => {
                  const course = activeCourses.find(c => c.id === item.courseId);
                  return (
                    <List.Item className="interactive-element" style={{ 
                      borderRadius: '8px',
                      margin: '8px 0',
                      padding: '12px',
                      border: '1px solid #f0f0f0'
                    }}>
                      <List.Item.Meta
                        title={
                          <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                            {course ? course.name : 'Disciplina'}
                          </Text>
                        }
                        description={
                          <Text type="secondary">
                            {item.startTime} - {item.endTime}
                          </Text>
                        }
                      />
                      <div>
                        {item.isAttendanceActive ? (
                          <Tag color="green" icon={<FieldTimeOutlined />} className="pulse">
                            Chamada Ativa
                          </Tag>
                        ) : (
                          <Tag color="default">Aguardando</Tag>
                        )}
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
                  Não há aulas programadas para hoje.
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal de sucesso */}
      {successData && (
        <AttendanceSuccess
          course={successData.course}
          classInfo={successData.classInfo}
          visible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setSuccessData(null);
          }}
        />
      )}
    </div>
  );
};

export default AttendanceCheckIn;
