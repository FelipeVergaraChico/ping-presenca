import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Statistic, Divider, Space, Select, Tag, Switch, Row, Col } from 'antd';
import { ClockCircleOutlined, QrcodeOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useResponsive } from '../../hooks/useResponsive';
import QRCodeDisplay from '../ui/QRCodeDisplay';
import { showToast } from '../../utils/toast';

const { Title, Text } = Typography;
const { Option } = Select;

const AttendanceCode: React.FC = () => {
  const { 
    activeCourses,
    selectedCourse,
    classes,
    selectedClass,
    isLoading,
    fetchCourses,
    selectCourse,
    fetchClasses,
    selectClass,
    generateAttendanceCode,
    clearAttendanceCode
  } = useAttendanceStore();
  
  const { isMobile } = useResponsive();
  const [code, setCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [codeActive, setCodeActive] = useState<boolean>(false);
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // URL base do sistema (em produção seria a URL real)
  const baseUrl = window.location.origin;
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    if (selectedCourse) {
      fetchClasses(selectedCourse.id);
    }
  }, [selectedCourse, fetchClasses]);
  
  useEffect(() => {
    if (selectedClass?.attendanceCode) {
      setCode(selectedClass.attendanceCode);
      setCodeActive(true);
      
      // Gerar URL do QR Code
  const url = `${baseUrl}/courses?codigo=${selectedClass.attendanceCode}`;
      setQrCodeUrl(url);
      
      // Calcular o tempo restante se houver um código ativo
      if (selectedClass.codeExpiresAt) {
        const expiresAt = new Date(selectedClass.codeExpiresAt).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeLeft(remaining);
      }
    } else {
      setCode(null);
      setCodeActive(false);
      setQrCodeUrl('');
    }
  }, [selectedClass, baseUrl]);
  
  useEffect(() => {
    let timer: number;
    
    const regenerateCode = async () => {
      const newCode = await generateAttendanceCode();
      if (newCode) {
        setCode(newCode);
        setTimeLeft(30);
        setCodeActive(true);
        
        // Atualizar URL do QR Code
  const url = `${baseUrl}/courses?codigo=${newCode}`;
        setQrCodeUrl(url);
      }
    };
    
    if (codeActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (autoGenerate) {
              // Regenerar automaticamente se estiver ativado
              regenerateCode();
            } else {
              setCodeActive(false);
              clearAttendanceCode();
            }
            return 30; // Reset para próxima iteração
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [codeActive, timeLeft, autoGenerate, clearAttendanceCode, generateAttendanceCode, baseUrl]);
  
  const handleGenerateCode = async () => {
    if (!selectedClass) {
      showToast.error('Erro', 'Selecione uma aula primeiro');
      return;
    }
    
    // Verificar se já existe uma chamada ativa
    if (selectedClass.isAttendanceActive && code) {
      showToast.warning(
        'Chamada já ativa', 
        'Já existe uma chamada aberta para esta aula. Encerre a atual antes de iniciar uma nova.'
      );
      return;
    }
    
    const newCode = await generateAttendanceCode();
    if (newCode) {
      setCode(newCode);
      setTimeLeft(30);
      setCodeActive(true);
      
      // Atualizar URL do QR Code
  const url = `${baseUrl}/courses?codigo=${newCode}`;
      setQrCodeUrl(url);
      
      showToast.success('Código Gerado', 'Um novo código de presença foi gerado');
    }
  };
  
  const handleStopGeneration = () => {
    setAutoGenerate(false);
    setCodeActive(false);
    clearAttendanceCode();
    showToast.info('Geração Interrompida', 'A geração automática de códigos foi interrompida');
  };
  
  const handleChangeCourse = (courseId: string) => {
    const course = activeCourses.find(c => c.id === courseId);
    if (course) {
      selectCourse(course);
    }
  };
  
  const handleChangeClass = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (classItem) {
      selectClass(classItem);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Card title="Gerenciamento de Chamada" loading={isLoading} className="fade-in-mobile">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>Selecione a Disciplina:</Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            placeholder="Selecione uma disciplina"
            onChange={handleChangeCourse}
            value={selectedCourse?.id}
            size={isMobile ? 'large' : 'middle'}
          >
            {activeCourses.map(course => (
              <Option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </Option>
            ))}
          </Select>
        </div>
        
        {selectedCourse && (
          <div>
            <Text strong>Selecione a Aula:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Selecione uma aula"
              onChange={handleChangeClass}
              value={selectedClass?.id}
              size={isMobile ? 'large' : 'middle'}
            >
              {classes.map(classItem => (
                <Option key={classItem.id} value={classItem.id}>
                  {classItem.date} ({classItem.startTime} - {classItem.endTime})
                  {classItem.date === today && 
                    <Tag color="green" style={{ marginLeft: 8 }}>Hoje</Tag>
                  }
                </Option>
              ))}
            </Select>
          </div>
        )}
        
        {selectedClass && (
          <>
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>
                <QrcodeOutlined style={{ marginRight: 8 }} />
                Código da Chamada
              </Title>
              
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ marginRight: 8 }}>Geração Automática:</Text>
                <Switch
                  checked={autoGenerate}
                  onChange={setAutoGenerate}
                  checkedChildren="Ativa"
                  unCheckedChildren="Inativa"
                />
              </div>
              
              {codeActive ? (
                <Row gutter={[16, 16]} align="middle" justify="center">
                  <Col xs={24} md={12}>
                    <div className="qr-code-container">
                      <div className="qr-code-wrapper">
                        <Text className="qr-code-title">Mostre este código:</Text>
                        <div
                          className="attendance-code-container"
                          style={{ 
                            margin: '20px 0', 
                            padding: '20px', 
                            background: '#f0f2f5', 
                            borderRadius: '8px',
                            border: '2px dashed #1890ff'
                          }}
                        >
                          <Title
                            style={{ 
                              fontSize: isMobile ? 28 : 36, 
                              margin: 0, 
                              fontFamily: 'monospace',
                              letterSpacing: isMobile ? 2 : 4,
                              color: '#1890ff'
                            }}
                            className="attendance-code-text"
                          >
                            {code}
                          </Title>
                        </div>
                        
                        <Statistic 
                          title="Expira em" 
                          value={timeLeft} 
                          suffix="segundos" 
                          prefix={<ClockCircleOutlined />}
                          valueStyle={{ 
                            color: timeLeft <= 10 ? '#ff4d4f' : '#1890ff',
                            fontSize: isMobile ? '18px' : '24px'
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    {qrCodeUrl && (
                      <QRCodeDisplay
                        value={qrCodeUrl}
                        size={isMobile ? 120 : 160}
                        title="Ou escaneie o QR Code:"
                        description="Aponte a câmera do celular"
                        showCard={true}
                      />
                    )}
                  </Col>
                </Row>
              ) : (
                <div style={{ margin: '20px 0' }}>
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={handleGenerateCode}
                    size="large"
                    className="btn-responsive interactive-element"
                  >
                    Iniciar Chamada
                  </Button>
                </div>
              )}
              
              {codeActive && (
                <Space style={{ marginTop: 16 }} size="middle">
                  <Button 
                    type="primary" 
                    onClick={handleGenerateCode}
                    className="btn-responsive interactive-element"
                    size={isMobile ? 'large' : 'middle'}
                  >
                    Gerar Novo Código
                  </Button>
                  
                  {autoGenerate && (
                    <Button 
                      danger
                      icon={<StopOutlined />}
                      onClick={handleStopGeneration}
                      className="btn-responsive interactive-element"
                      size={isMobile ? 'large' : 'middle'}
                    >
                      Parar Geração
                    </Button>
                  )}
                </Space>
              )}
            </div>
          </>
        )}
      </Space>
    </Card>
  );
};

export default AttendanceCode;
