import React from 'react';
import { Card, Typography, Button } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Course, Class } from '../../types';

const { Title, Text } = Typography;

interface AttendanceSuccessProps {
  course: Course;
  classInfo: Class;
  onClose: () => void;
  visible: boolean;
}

const AttendanceSuccess: React.FC<AttendanceSuccessProps> = ({
  course,
  classInfo,
  onClose,
  visible
}) => {
  if (!visible) return null;

  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="attendance-success-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in'
      }}
      onClick={onClose}
    >
      <Card
        style={{
          width: '90%',
          maxWidth: 400,
          textAlign: 'center',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          animation: 'slideUp 0.4s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px 0' }}>
          {/* Ícone de sucesso animado */}
          <div 
            style={{
              fontSize: 80,
              color: '#52c41a',
              marginBottom: 24,
              animation: 'bounceIn 0.6s ease-out'
            }}
          >
            <CheckCircleOutlined />
          </div>

          {/* Título principal */}
          <Title 
            level={3} 
            style={{ 
              color: '#52c41a', 
              marginBottom: 16,
              fontWeight: 'bold'
            }}
          >
            Presença Registrada!
          </Title>

          {/* Informações da aula */}
          <div style={{ marginBottom: 24 }}>
            <Text 
              strong 
              style={{ 
                fontSize: 18, 
                display: 'block', 
                marginBottom: 8,
                color: '#1a1a1a'
              }}
            >
              {course.name}
            </Text>
            
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 14, 
                display: 'block', 
                marginBottom: 12 
              }}
            >
              {course.code}
            </Text>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 8,
              marginBottom: 8
            }}>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              <Text strong style={{ color: '#1890ff' }}>
                {classInfo.startTime} - {classInfo.endTime}
              </Text>
            </div>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Registrado às {currentTime}
            </Text>
          </div>

          {/* Mensagem de confirmação */}
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24
          }}>
            <Text style={{ color: '#389e0d', fontSize: 14 }}>
              ✅ Sua presença foi registrada com sucesso!
            </Text>
          </div>

          {/* Botão de fechar */}
          <Button 
            type="primary" 
            size="large"
            onClick={onClose}
            style={{
              borderRadius: 8,
              height: 48,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
              border: 'none'
            }}
          >
            Continuar
          </Button>
        </div>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceSuccess;
