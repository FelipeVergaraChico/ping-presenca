import React from 'react';
import { Typography } from 'antd';
import AppLayout from '../../components/layout/AppLayout';
import AttendanceCode from '../../components/attendance/AttendanceCode';

const { Title } = Typography;

const AttendancePage: React.FC = () => {
  return (
    <AppLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Gerenciamento de Chamada</Title>
        <Typography.Paragraph>
          Aqui você pode gerar códigos para registrar a presença dos alunos nas suas aulas.
        </Typography.Paragraph>
      </div>
      
      <AttendanceCode />
    </AppLayout>
  );
};

export default AttendancePage;
