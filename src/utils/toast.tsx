import toast from 'react-hot-toast';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

// Configuração personalizada dos toasts
export const toastConfig = {
  duration: 4000,
  position: 'top-center' as const,
  style: {
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
};

// Funções de toast personalizadas
export const showToast = {
  success: (message: string, description?: string) => {
    toast.custom((t) => (
      <div
        className={`toast-container ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={{
          ...toastConfig.style,
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          color: '#389e0d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircleOutlined style={{ 
            fontSize: '18px', 
            color: '#52c41a',
            marginTop: '2px'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: description ? '4px' : '0' }}>
              {message}
            </div>
            {description && (
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8,
                lineHeight: '1.4'
              }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#389e0d',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '8px'
            }}
          >
            ✕
          </button>
        </div>
      </div>
    ), { duration: toastConfig.duration });
  },

  error: (message: string, description?: string) => {
    toast.custom((t) => (
      <div
        className={`toast-container ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={{
          ...toastConfig.style,
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          color: '#cf1322',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CloseCircleOutlined style={{ 
            fontSize: '18px', 
            color: '#ff4d4f',
            marginTop: '2px'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: description ? '4px' : '0' }}>
              {message}
            </div>
            {description && (
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8,
                lineHeight: '1.4'
              }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#cf1322',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '8px'
            }}
          >
            ✕
          </button>
        </div>
      </div>
    ), { duration: toastConfig.duration });
  },

  warning: (message: string, description?: string) => {
    toast.custom((t) => (
      <div
        className={`toast-container ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={{
          ...toastConfig.style,
          backgroundColor: '#fffbe6',
          border: '1px solid #ffe58f',
          color: '#d46b08',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <ExclamationCircleOutlined style={{ 
            fontSize: '18px', 
            color: '#fa8c16',
            marginTop: '2px'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: description ? '4px' : '0' }}>
              {message}
            </div>
            {description && (
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8,
                lineHeight: '1.4'
              }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#d46b08',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '8px'
            }}
          >
            ✕
          </button>
        </div>
      </div>
    ), { duration: toastConfig.duration });
  },

  info: (message: string, description?: string) => {
    toast.custom((t) => (
      <div
        className={`toast-container ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={{
          ...toastConfig.style,
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          color: '#0958d9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <InfoCircleOutlined style={{ 
            fontSize: '18px', 
            color: '#1890ff',
            marginTop: '2px'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: description ? '4px' : '0' }}>
              {message}
            </div>
            {description && (
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8,
                lineHeight: '1.4'
              }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0958d9',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '8px'
            }}
          >
            ✕
          </button>
        </div>
      </div>
    ), { duration: toastConfig.duration });
  }
};
