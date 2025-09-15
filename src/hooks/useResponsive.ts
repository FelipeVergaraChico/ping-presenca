/**
 * @fileoverview Hook personalizado para detecção responsiva de breakpoints
 * @module useResponsive
 * @version 1.0.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Breakpoints padrão do sistema
 */
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
} as const;

/**
 * Interface de retorno do hook useResponsive
 */
interface UseResponsiveReturn {
  /** Se está em tela mobile (< 768px) */
  isMobile: boolean;
  /** Se está em tela de tablet (768px - 1199px) */
  isTablet: boolean;
  /** Se está em tela de desktop (≥ 1200px) */
  isDesktop: boolean;
  /** Largura atual da tela */
  width: number;
  /** Altura atual da tela */
  height: number;
  /** Orientação atual (portrait/landscape) */
  orientation: 'portrait' | 'landscape';
}

/**
 * Hook personalizado para detecção responsiva com performance otimizada
 * 
 * Características:
 * - Debounce automático para evitar re-renderizações excessivas
 * - Memorização de valores calculados
 * - Suporte a orientação de tela
 * - Cleanup automático de event listeners
 * - Compatível com SSR
 * 
 * @param debounceMs - Tempo de debounce em milissegundos (padrão: 150ms)
 * @returns Objeto com informações responsivas
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useResponsive();
 * 
 * return (
 *   <div>
 *     {isMobile && <MobileComponent />}
 *     {isTablet && <TabletComponent />}
 *     {isDesktop && <DesktopComponent />}
 *   </div>
 * );
 * ```
 */
export const useResponsive = (debounceMs: number = 150): UseResponsiveReturn => {
  // Estado inicial seguro para SSR
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  /**
   * Handler otimizado para resize com debounce
   */
  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  /**
   * Effect para setup e cleanup de event listeners
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, debounceMs);
    };

    // Event listeners
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, [handleResize, debounceMs]);

  /**
   * Valores memorized para evitar recálculos desnecessários
   */
  const responsiveValues = useMemo((): UseResponsiveReturn => {
    const { width, height } = windowSize;

    return {
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isDesktop: width >= BREAKPOINTS.tablet,
      width,
      height,
      orientation: height > width ? 'portrait' : 'landscape',
    };
  }, [windowSize]);

  return responsiveValues;
};
