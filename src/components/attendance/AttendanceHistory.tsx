import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Checkbox, Button, Tooltip, Space, Select, Row, Col } from 'antd';
import { EditOutlined, SaveOutlined, UndoOutlined, HistoryOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AttendanceRecord } from '../../types';
import { useResponsive } from '../../hooks/useResponsive';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

interface AttendanceHistoryProps {
  isEditable?: boolean;
  userId?: string;
  userRole?: 'student' | 'professor';
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ 
  isEditable = false, 
  userId,
  userRole = 'student'
}) => {
  const { isMobile } = useResponsive();
  const [editMode, setEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    // Dados mockados para o aluno logado (assumindo userId como string do email)
    {
      id: '1',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl1',
      date: '2024-12-09',
      courseName: 'Programação Web',
      isPresent: true,
      timestamp: '2024-12-09T19:15:00'
    },
    {
      id: '7',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl3',
      date: '2024-12-02',
      courseName: 'Programação Web',
      isPresent: true,
      timestamp: '2024-12-02T19:12:00'
    },
    {
      id: '8',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl4',
      date: '2024-11-25',
      courseName: 'Programação Web',
      isPresent: false
    },
    {
      id: '9',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl5',
      date: '2024-11-18',
      courseName: 'Programação Web',
      isPresent: true,
      timestamp: '2024-11-18T19:08:00'
    },
    {
      id: '10',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl6',
      date: '2024-12-05',
      courseName: 'Algoritmos e Estruturas de Dados',
      isPresent: true,
      timestamp: '2024-12-05T20:45:00'
    },
    {
      id: '11',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl7',
      date: '2024-11-28',
      courseName: 'Algoritmos e Estruturas de Dados',
      isPresent: true,
      timestamp: '2024-11-28T20:52:00'
    },
    {
      id: '12',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl8',
      date: '2024-11-21',
      courseName: 'Algoritmos e Estruturas de Dados',
      isPresent: false
    },
    {
      id: '13',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl9',
      date: '2024-12-03',
      courseName: 'Banco de Dados',
      isPresent: true,
      timestamp: '2024-12-03T18:35:00'
    },
    {
      id: '14',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl10',
      date: '2024-11-26',
      courseName: 'Banco de Dados',
      isPresent: true,
      timestamp: '2024-11-26T18:42:00'
    },
    {
      id: '15',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl11',
      date: '2024-11-19',
      courseName: 'Banco de Dados',
      isPresent: false
    },
    {
      id: '16',
      student: {
        id: userId || 'aluno',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl12',
      date: '2024-11-12',
      courseName: 'Banco de Dados',
      isPresent: true,
      timestamp: '2024-11-12T18:38:00'
    },
    
    // Dados de outros alunos (para visualização do professor)
    {
      id: '2',
      student: {
        id: 'st2',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        enrollment: '2024002'
      },
      classId: 'cl1',
      date: '2024-12-09',
      courseName: 'Programação Web',
      isPresent: false
    },
    {
      id: '3',
      student: {
        id: 'st3',
        name: 'Pedro Costa',
        email: 'pedro.costa@email.com',
        enrollment: '2024003'
      },
      classId: 'cl1',
      date: '2024-12-09',
      courseName: 'Programação Web',
      isPresent: true,
      timestamp: '2024-12-09T19:20:00'
    },
    {
      id: '4',
      student: {
        id: 'st1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        enrollment: '2024001'
      },
      classId: 'cl2',
      date: '2024-12-02',
      courseName: 'Algoritmos e Estruturas de Dados',
      isPresent: true,
      timestamp: '2024-12-02T19:10:00'
    },
    {
      id: '5',
      student: {
        id: 'st2',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        enrollment: '2024002'
      },
      classId: 'cl2',
      date: '2024-12-02',
      courseName: 'Algoritmos e Estruturas de Dados',
      isPresent: true,
      timestamp: '2024-12-02T19:18:00'
    },
    {
      id: '6',
      student: {
        id: 'st4',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@email.com',
        enrollment: '2024004'
      },
      classId: 'cl1',
      date: '2024-12-09',
      courseName: 'Programação Web',
      isPresent: false
    },
    {
      id: '17',
      student: {
        id: 'st5',
        name: 'Carlos Lima',
        email: 'carlos.lima@email.com',
        enrollment: '2024005'
      },
      classId: 'cl1',
      date: '2024-12-09',
      courseName: 'Programação Web',
      isPresent: true,
      timestamp: '2024-12-09T19:25:00'
    },
    {
      id: '18',
      student: {
        id: 'st6',
        name: 'Julia Ferreira',
        email: 'julia.ferreira@email.com',
        enrollment: '2024006'
      },
      classId: 'cl1',
      date: '2024-12-09',
      courseName: 'Programação Web',
      isPresent: false
    }
  ]);

  // Filtrar dados baseado no usuário (se for aluno, mostrar apenas seus registros)
  const filteredData = userRole === 'student' && userId 
    ? attendanceData.filter(record => record.student.id === userId)
    : attendanceData;

  // Aplicar filtros de curso e data
  const finalFilteredData = filteredData.filter(record => {
    const courseMatch = selectedCourse === 'all' || record.courseName === selectedCourse;
    const dateMatch = selectedDate === 'all' || record.date === selectedDate;
    return courseMatch && dateMatch;
  });

  const handlePresenceChange = (recordId: string, isPresent: boolean) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              isPresent,
              timestamp: isPresent ? new Date().toISOString() : undefined
            }
          : record
      )
    );
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = () => {
    setEditMode(false);
    // Aqui você implementaria a lógica para salvar no backend
    console.log('Salvando alterações:', attendanceData);
  };

  const cancelEdit = () => {
    setEditMode(false);
    // Aqui você recarregaria os dados originais
    console.log('Cancelando edição');
  };

  // Obter listas únicas para filtros
  const uniqueCourses = [...new Set(attendanceData.map(record => record.courseName))];
  const uniqueDates = [...new Set(attendanceData.map(record => record.date))].sort().reverse();

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: 'Aluno',
      dataIndex: ['student', 'name'],
      key: 'studentName',
      width: isMobile ? 120 : 200,
      render: (name: string, record: AttendanceRecord) => (
        <div>
          <Text strong style={{ fontSize: isMobile ? '12px' : '14px' }}>
            {name}
          </Text>
          {!isMobile && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.student.enrollment}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Disciplina',
      dataIndex: 'courseName',
      key: 'courseName',
      width: isMobile ? 100 : 180,
      render: (courseName: string) => (
        <Text style={{ fontSize: isMobile ? '12px' : '14px' }}>
          {courseName}
        </Text>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      width: isMobile ? 80 : 120,
      render: (date: string) => (
        <Text style={{ fontSize: isMobile ? '12px' : '14px' }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </Text>
      ),
    },
    {
      title: 'Participou',
      key: 'present',
      width: isMobile ? 80 : 100,
      align: 'center' as const,
      render: (_, record: AttendanceRecord) => (
        <div style={{ textAlign: 'center' }}>
          {isEditable && editMode ? (
            <Checkbox
              checked={record.isPresent}
              onChange={(e) => handlePresenceChange(record.id, e.target.checked)}
            />
          ) : (
            <Tag color={record.isPresent ? 'success' : 'default'}>
              {record.isPresent ? '✓' : '✗'}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Horário',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: isMobile ? 80 : 120,
      render: (timestamp: string) => (
        <Text style={{ fontSize: isMobile ? '12px' : '14px' }}>
          {timestamp ? dayjs(timestamp).format('HH:mm') : '-'}
        </Text>
      ),
    },
  ];

  // Para alunos, remover coluna de aluno se estiver vendo apenas os próprios registros
  const finalColumns = userRole === 'student' 
    ? columns.filter(col => col.key !== 'studentName')
    : columns;

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HistoryOutlined />
          <span>Histórico de Presenças</span>
        </div>
      }
      extra={
        isEditable && (
          <Space>
            {editMode ? (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={saveChanges}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Salvar'}
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={cancelEdit}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Cancelar'}
                </Button>
              </>
            ) : (
              <Tooltip title="Editar presenças">
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={toggleEditMode}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Editar'}
                </Button>
              </Tooltip>
            )}
          </Space>
        )
      }
    >
      {/* Filtros */}
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        gap: 16, 
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : '200px' }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>
            Disciplina:
          </Text>
          <Select
            style={{ width: '100%' }}
            value={selectedCourse}
            onChange={setSelectedCourse}
            size={isMobile ? 'large' : 'middle'}
          >
            <Option value="all">Todas as disciplinas</Option>
            {uniqueCourses.map(course => (
              <Option key={course} value={course}>{course}</Option>
            ))}
          </Select>
        </div>
        
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : '200px' }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>
            Data:
          </Text>
          <Select
            style={{ width: '100%' }}
            value={selectedDate}
            onChange={setSelectedDate}
            size={isMobile ? 'large' : 'middle'}
          >
            <Option value="all">Todas as datas</Option>
            {uniqueDates.map(date => (
              <Option key={date} value={date}>
                {dayjs(date).format('DD/MM/YYYY')}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <Table
        columns={finalColumns}
        dataSource={finalFilteredData}
        rowKey="id"
        pagination={{
          pageSize: isMobile ? 5 : 10,
          showSizeChanger: !isMobile,
          showQuickJumper: !isMobile,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} de ${total} registros`,
        }}
        scroll={{ x: isMobile ? 600 : undefined }}
        size={isMobile ? 'small' : 'middle'}
        loading={false}
        locale={{
          emptyText: 'Nenhum registro de presença encontrado'
        }}
      />
      
      {/* Estatísticas do Aluno */}
      {userRole === 'student' && finalFilteredData.length > 0 && (
        <div style={{ 
          marginTop: 16, 
          padding: 16, 
          backgroundColor: '#f0f9ff', 
          borderRadius: 8,
          border: '1px solid #bae7ff'
        }}>
          <Typography.Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
            📊 Suas Estatísticas de Presença
          </Typography.Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {finalFilteredData.filter(r => r.isPresent).length}
                </div>
                <Text style={{ fontSize: '12px', color: '#666' }}>Presenças</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  {finalFilteredData.filter(r => !r.isPresent).length}
                </div>
                <Text style={{ fontSize: '12px', color: '#666' }}>Faltas</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {finalFilteredData.length}
                </div>
                <Text style={{ fontSize: '12px', color: '#666' }}>Total Aulas</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: finalFilteredData.length > 0 
                    ? ((finalFilteredData.filter(r => r.isPresent).length / finalFilteredData.length) * 100) >= 75 
                      ? '#52c41a' 
                      : '#faad14'
                    : '#666'
                }}>
                  {finalFilteredData.length > 0 
                    ? Math.round((finalFilteredData.filter(r => r.isPresent).length / finalFilteredData.length) * 100)
                    : 0}%
                </div>
                <Text style={{ fontSize: '12px', color: '#666' }}>Frequência</Text>
              </div>
            </Col>
          </Row>
          
          {finalFilteredData.length > 0 && (
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              {((finalFilteredData.filter(r => r.isPresent).length / finalFilteredData.length) * 100) >= 75 ? (
                <Tag color="success" style={{ fontSize: '12px' }}>
                  🎉 Excelente frequência! Continue assim!
                </Tag>
              ) : ((finalFilteredData.filter(r => r.isPresent).length / finalFilteredData.length) * 100) >= 50 ? (
                <Tag color="warning" style={{ fontSize: '12px' }}>
                  ⚠️ Atenção à frequência mínima necessária
                </Tag>
              ) : (
                <Tag color="error" style={{ fontSize: '12px' }}>
                  🚨 Frequência baixa - procure o professor
                </Tag>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Legenda */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 6 
      }}>
        <Space wrap>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Tag color="success">✓</Tag>
            <Text style={{ fontSize: '12px' }}>Presente</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Tag color="default">✗</Tag>
            <Text style={{ fontSize: '12px' }}>Ausente</Text>
          </div>
          {isEditable && (
            <Text style={{ fontSize: '12px', fontStyle: 'italic' }}>
              * Clique em "Editar" para modificar os registros de presença
            </Text>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default AttendanceHistory;
