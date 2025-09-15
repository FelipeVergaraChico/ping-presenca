/**
 * @fileoverview Componente de menu hamburguer responsivo
 * @module HamburgerMenu
 * @version 1.0.0
 */

import React, { memo } from 'react';

/**
 * Props para o componente HamburgerMenu
 */
export interface HamburgerMenuProps {
  /** Estado ativo/inativo do menu */
  isActive: boolean;
  /** Callback executado ao clicar no botão */
  onClick: () => void;
  /** Label para acessibilidade */
  ariaLabel?: string;
  /** Classe CSS adicional */
  className?: string;
  /** Cor das linhas do hamburguer */
  color?: string;
}

/**
 * Componente de menu hamburguer com animação suave
 * 
 * Características:
 * - Animação CSS pura para melhor performance
 * - Acessibilidade completa com ARIA labels
 * - Customizável via props
 * - Memorizado para evitar re-renderizações desnecessárias
 * 
 * @param props - Propriedades do componente
 * @returns JSX.Element - Botão hamburguer animado
 * 
 * @example
 * ```tsx
 * <HamburgerMenu
 *   isActive={menuOpen}
 *   onClick={() => setMenuOpen(!menuOpen)}
 *   ariaLabel="Abrir menu de navegação"
 * />
 * ```
 */
const HamburgerMenu: React.FC<HamburgerMenuProps> = memo(({
  isActive,
  onClick,
  ariaLabel = 'Menu',
  className = '',
  color = '#ffffff'
}) => {
  return (
    <button
      type="button"
      className={`hamburger-button ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isActive}
      aria-controls="mobile-menu"
      data-testid="hamburger-menu"
    >
      <span 
        className="hamburger-line" 
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span 
        className="hamburger-line" 
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span 
        className="hamburger-line" 
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="sr-only">
        {isActive ? 'Fechar menu' : 'Abrir menu'}
      </span>
    </button>
  );
});

HamburgerMenu.displayName = 'HamburgerMenu';

export default HamburgerMenu;
