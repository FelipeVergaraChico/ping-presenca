import React from 'react';
import { Toaster } from 'react-hot-toast';
import { toastConfig } from '../../utils/toast';

// Componente do Toaster para ser usado no App
export const ToastProvider: React.FC = () => {
  return (
    <Toaster 
      position={toastConfig.position}
      containerStyle={{
        top: 20,
      }}
    />
  );
};

export default ToastProvider;
