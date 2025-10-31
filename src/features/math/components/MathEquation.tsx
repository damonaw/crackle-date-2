import { useEffect, useRef } from 'react';
import { parse } from 'mathjs';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathEquationProps {
  equation: string;
  displayMode?: boolean;
  className?: string;
}

const getCssVariable = (name: string, fallback: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  return value.trim() || fallback;
};

export default function MathEquation({
  equation,
  displayMode = false,
  className = '',
}: MathEquationProps) {
  const mathRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = mathRef.current;
    if (!element) return;

    if (!equation.trim()) {
      element.textContent = '';
      return;
    }

    const errorColor = getCssVariable('--color-danger', 'rgb(239, 68, 68)');

    try {
      const latexEquation = convertToLatex(equation);
      katex.render(latexEquation, element, {
        displayMode,
        throwOnError: false,
        errorColor,
        strict: false,
      });
      return;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      element.innerHTML = formatMathFallback(equation);
    }
  }, [equation, displayMode]);

  return <span ref={mathRef} className={className} />;
}

const convertToLatex = (equation: string): string => {
  try {
    const parts = equation.split('=');
    if (parts.length === 2) {
      const leftLatex = parse(parts[0].trim()).toTex();
      const rightLatex = parse(parts[1].trim()).toTex();
      return `${leftLatex} = ${rightLatex}`;
    }

    // Render partial expressions (without equals sign) using KaTeX
    const latex = parse(equation.trim()).toTex();
    return latex;
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
