import { useEffect, useRef } from 'react';
import { parse } from 'mathjs';
import { useTheme } from '../hooks/useTheme';

// KaTeX type declaration
declare global {
  interface Window {
    katex?: {
      render: (
        tex: string,
        element: HTMLElement,
        options?: {
          displayMode?: boolean;
          throwOnError?: boolean;
          errorColor?: string;
          strict?: boolean;
        }
      ) => void;
    };
  }
}

interface MathEquationProps {
  equation: string;
  displayMode?: boolean;
  className?: string;
}

export default function MathEquation({
  equation,
  displayMode = false,
  className = '',
}: MathEquationProps) {
  const { theme } = useTheme();
  const mathRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = mathRef.current;
    if (!element) return;

    if (!equation.trim()) {
      element.textContent = '';
      return;
    }

    if (typeof window !== 'undefined' && window.katex) {
      try {
        const latexEquation = convertToLatex(equation);
        window.katex.render(latexEquation, element, {
          displayMode,
          throwOnError: false,
          errorColor: theme.palette.error.main,
          strict: false,
        });
        return;
      } catch (error) {
        console.error('KaTeX rendering error:', error);
      }
    }

    element.innerHTML = formatMathFallback(equation);
  }, [equation, displayMode, theme]);

  return <span ref={mathRef} className={className} />;
}

const convertToLatex = (equation: string): string => {
  try {
    const parts = equation.split('=');
    if (parts.length !== 2) {
      return formatMathFallback(equation);
    }

    const leftLatex = parse(parts[0].trim()).toTex();
    const rightLatex = parse(parts[1].trim()).toTex();

    return `${leftLatex} = ${rightLatex}`;
  } catch (error) {
    console.warn('LaTeX conversion failed, using fallback formatting:', error);
    return formatMathFallback(equation);
  }
};

const formatMathFallback = (equation: string): string => {
  const safe = escapeHtml(equation)
    .replace(/\*/g, '×')
    .replace(/sqrt\(/gi, '√(')
    .replace(/abs\(([^)]+)\)/gi, '|$1|')
    .replace(/(\w+|\))(\^)(\w+|\([^)]+\))/g, '$1<sup>$3</sup>')
    .replace(/(\d+)\^(\d+)/g, '$1<sup>$2</sup>')
    .replace(/=/g, ' = ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' − ')
    .trim();
  return safe;
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
