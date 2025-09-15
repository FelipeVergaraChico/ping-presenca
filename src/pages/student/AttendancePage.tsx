import React from 'react';
import { Typography } from 'antd';
import AppLayout from '../../components/layout/AppLayout';
import AttendanceCheckIn from '../../components/attendance/AttendanceCheckIn';

const { Title } = Typography;

const AttendancePage: React.FC = () => {
  return (
    <AppLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Registro de Presença</Title>
        <Typography.Paragraph>
          Aqui você pode registrar sua presença nas aulas informando o código fornecido pelo professor.
        </Typography.Paragraph>
      </div>
      
      <AttendanceCheckIn />
    </AppLayout>
  );
};

export default AttendancePage;
