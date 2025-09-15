/**
 * @fileoverview Componente de estatística responsivo e reutilizável
 * @module StatisticCard
 * @version 1.0.0
 */

import React, { memo } from 'react';
import { Card, Statistic, Typography } from 'antd';
import type { StatisticProps } from 'antd/es/statistic';

const { Text } = Typography;

/**
 * Props para o componente StatisticCard
 */
interface StatisticCardProps extends Omit<StatisticProps, 'size'> {
  /** Se deve mostrar animação de pulso */
  showPulse?: boolean;
  /** Cor personalizada para o valor */
  valueColor?: string;
  /** Mensagem adicional abaixo da estatística */
  message?: string;
  /** Cor da mensagem */
  messageColor?: string;
  /** Se está em modo mobile */
  isMobile?: boolean;
  /** Callback ao clicar no card */
  onClick?: () => void;
  /** Se o card é clicável */
  clickable?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente de card de estatística com layout responsivo
 * 
 * Características:
 * - Responsivo com tamanhos adaptativos
 * - Animações condicionais (pulse)
 * - Acessibilidade completa
 * - Performance otimizada com memo
 * - Customização via props
 * 
 * @param props - Propriedades do componente
 * @returns JSX.Element - Card de estatística responsivo
 * 
 * @example
 * ```tsx
 * <StatisticCard
 *   title="Total de Aulas"
 *   value={15}
 *   prefix={<BookOutlined />}
 *   showPulse={true}
 *   valueColor="#52c41a"
 *   message="Todas as disciplinas"
 *   isMobile={isMobile}
 * />
 * ```
 */
const StatisticCard: React.FC<StatisticCardProps> = memo(({
  title,
  value,
  prefix,
  suffix,
  showPulse = false,
  valueColor,
  message,
  messageColor = '#8c8c8c',
  isMobile = false,
  onClick,
  clickable = false,
  className = '',
  ...statisticProps
}) => {
  const handleCardClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && clickable && onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={`
        stat-card 
        interactive-element 
        ${showPulse ? 'pulse' : ''} 
        ${clickable ? 'clickable' : ''} 
        ${className}
      `}
      bodyStyle={{
        padding: isMobile ? '16px' : '24px',
        textAlign: 'center'
      }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? `${title}: ${value}` : undefined}
      data-testid="statistic-card"
    >
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{
          fontSize: isMobile ? '24px' : '32px',
          color: valueColor,
          fontWeight: 'bold'
        }}
        {...statisticProps}
      />
      
      {message && (
        <div style={{ marginTop: 8 }}>
          <Text
            style={{
              color: messageColor,
              fontSize: isMobile ? '12px' : '14px',
              display: 'block'
            }}
          >
            {message}
          </Text>
        </div>
      )}
    </Card>
  );
});

StatisticCard.displayName = 'StatisticCard';

export default StatisticCard;
