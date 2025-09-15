/**
 * @fileoverview Componente QR Code responsivo e reutilizável
 * @module QRCodeDisplay
 * @version 1.0.0
 */

import React, { memo, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { Typography, Card } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * Props para o componente QRCodeDisplay
 */
export interface QRCodeDisplayProps {
  /** Valor/URL a ser codificado no QR Code */
  value: string;
  /** Tamanho do QR Code em pixels */
  size?: number;
  /** Título exibido acima do QR Code */
  title?: string;
  /** Descrição exibida abaixo do QR Code */
  description?: string;
  /** Cor de fundo do QR Code */
  bgColor?: string;
  /** Cor do primeiro plano do QR Code */
  fgColor?: string;
  /** Se deve exibir o card wrapper */
  showCard?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Callback executado quando o QR Code é renderizado */
  onRender?: () => void;
}

/**
 * Componente para exibição de QR Code com layout responsivo
 * 
 * Características:
 * - Memorização automática para evitar re-renderizações
 * - Layout responsivo com breakpoints
 * - Acessibilidade completa
 * - Customização via props
 * - Performance otimizada
 * 
 * @param props - Propriedades do componente
 * @returns JSX.Element - QR Code com layout responsivo
 * 
 * @example
 * ```tsx
 * <QRCodeDisplay
 *   value="https://meusite.com/codigo=123456"
 *   size={160}
 *   title="Escaneie o QR Code"
 *   description="Aponte a câmera do celular"
 * />
 * ```
 */
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = memo(({
  value,
  size = 160,
  title = 'QR Code',
  description,
  bgColor = '#ffffff',
  fgColor = '#000000',
  showCard = true,
  className = '',
  onRender
}) => {
  /**
   * Memoriza o QR Code para evitar re-renderizações desnecessárias
   */
  const qrCodeElement = useMemo(() => {
    if (!value) return null;

    return (
      <div 
        className="qr-code-wrapper"
        data-testid="qr-code-wrapper"
      >
        <QRCode
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level="M" // Nível de correção de erro médio
          data-testid="qr-code"
        />
      </div>
    );
  }, [value, size, bgColor, fgColor]);

  /**
   * Efeito colateral para callback de renderização
   */
  React.useEffect(() => {
    if (qrCodeElement && onRender) {
      onRender();
    }
  }, [qrCodeElement, onRender]);

  const content = (
    <div className={`qr-code-container ${className}`}>
      <div className="qr-code-content">
        {title && (
          <div className="qr-code-header">
            <QrcodeOutlined style={{ marginRight: 8 }} />
            <Text className="qr-code-title" strong>
              {title}
            </Text>
          </div>
        )}
        
        <div 
          className="qr-code-display"
          style={{ 
            padding: '16px', 
            background: bgColor, 
            borderRadius: '8px',
            border: '1px solid #d9d9d9',
            display: 'inline-block'
          }}
        >
          {qrCodeElement}
        </div>
        
        {description && (
          <Text 
            type="secondary" 
            className="qr-code-description"
            style={{ 
              fontSize: '12px', 
              textAlign: 'center', 
              display: 'block',
              marginTop: '8px'
            }}
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card 
      className="qr-code-card"
      bodyStyle={{ 
        padding: '16px',
        textAlign: 'center'
      }}
    >
      {content}
    </Card>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

export default QRCodeDisplay;
