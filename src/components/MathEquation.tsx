import React, { useEffect, useRef } from 'react';

// Import KaTeX CSS (you'll need to add this to your index.html or install the package)
// For now, I'll provide the CDN link to add to your HTML

interface MathEquationProps {
  equation: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Component to render mathematical equations using KaTeX
 * Provides textbook-quality mathematical notation
 */
const MathEquation: React.FC<MathEquationProps> = ({ 
  equation, 
  displayMode = false, 
  className = '' 
}) => {
  const mathRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if KaTeX is loaded
    if (typeof window !== 'undefined' && (window as any).katex && mathRef.current) {
      try {
        // Convert common math operators to LaTeX syntax
        const latexEquation = convertToLatex(equation);
        
        // Render with KaTeX
        (window as any).katex.render(latexEquation, mathRef.current, {
          displayMode: displayMode,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        // Fallback to plain text if KaTeX fails
        if (mathRef.current) {
          mathRef.current.textContent = equation;
        }
      }
    } else {
      // Fallback rendering without KaTeX
      if (mathRef.current) {
        mathRef.current.innerHTML = formatMathFallback(equation);
      }
    }
  }, [equation, displayMode]);

  return <span ref={mathRef} className={className} />;
};

/**
 * Convert basic math notation to LaTeX syntax
 */
const convertToLatex = (equation: string): string => {
  let latexEquation = equation;
  
  // Convert complex fractions with parentheses: (expression)/(expression)
  latexEquation = latexEquation.replace(/(\([^)]+\))\/(\([^)]+\))/g, '\\frac{$1}{$2}');
  
  // Convert fractions with parentheses on one side: (expression)/number or number/(expression)
  latexEquation = latexEquation.replace(/(\([^)]+\))\/(\d+)/g, '\\frac{$1}{$2}');
  latexEquation = latexEquation.replace(/(\d+)\/(\([^)]+\))/g, '\\frac{$1}{$2}');
  
  // Convert multi-digit number fractions: 10/20, 123/456, etc.
  latexEquation = latexEquation.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
  
  // Convert variable/expression fractions: x/(y+z), (a+b)/c, etc.
  latexEquation = latexEquation.replace(/([a-zA-Z]+)\/(\([^)]+\))/g, '\\frac{$1}{$2}');
  latexEquation = latexEquation.replace(/(\([^)]+\))\/([a-zA-Z]+)/g, '\\frac{$1}{$2}');
  latexEquation = latexEquation.replace(/([a-zA-Z]+)\/([a-zA-Z]+)/g, '\\frac{$1}{$2}');
  
  // Convert square roots BEFORE exponent processing: sqrt(expression) to \sqrt{expression}
  // Handle nested parentheses first: sqrt((a+b))
  latexEquation = latexEquation.replace(/sqrt\((\([^)]+\))\)/gi, '\\\\sqrt{$1}');
  // Handle simple expressions: sqrt(16), sqrt(x+y), etc.
  latexEquation = latexEquation.replace(/sqrt\(([^)]+)\)/gi, '\\\\sqrt{$1}');
  // Handle bare sqrt without parentheses if any: sqrt4 -> sqrt{4}
  latexEquation = latexEquation.replace(/sqrt(\d+)/gi, '\\\\sqrt{$1}');
  
  // Convert complex exponents: (expression)^(expression), (expression)^number, number^(expression)
  latexEquation = latexEquation.replace(/(\([^)]+\))\^(\([^)]+\))/g, '{$1}^{$2}');
  latexEquation = latexEquation.replace(/(\([^)]+\))\^(\d+)/g, '{$1}^{$2}');
  latexEquation = latexEquation.replace(/(\d+)\^(\([^)]+\))/g, '$1^{$2}');
  
  // Convert multi-digit exponents: 10^23, 2^10, etc.
  latexEquation = latexEquation.replace(/(\d+)\^(\d+)/g, '$1^{$2}');
  
  // Convert single digit exponents: 2^3, x^2, etc.
  latexEquation = latexEquation.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9])/g, '$1^{$2}');
  
  // Convert complex absolute values: abs((expression)), abs(multi-digit), etc.
  latexEquation = latexEquation.replace(/abs\((\([^)]+\))\)/g, '\\left|$1\\right|');
  latexEquation = latexEquation.replace(/abs\(([^)]+)\)/g, '\\left|$1\\right|');
  
  // Convert factorials for expressions: (expression)!, number!, variable!
  latexEquation = latexEquation.replace(/(\([^)]+\))!/g, '{$1}!');
  latexEquation = latexEquation.replace(/(\d+)!/g, '$1!');
  latexEquation = latexEquation.replace(/([a-zA-Z]+)!/g, '$1!');
  
  return latexEquation
    // Replace basic operators with LaTeX equivalents
    .replace(/\*/g, ' \\times ')
    .replace(/=/g, ' = ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' - ')
    .trim();
};

/**
 * Fallback formatting without KaTeX (uses HTML/CSS)
 */
const formatMathFallback = (equation: string): string => {
  let formatted = equation;
  
  // Convert simple fractions to Unicode fractions when possible
  const fractionMap: { [key: string]: string } = {
    '1/2': '½',
    '1/3': '⅓',
    '2/3': '⅔',
    '1/4': '¼',
    '3/4': '¾',
    '1/5': '⅕',
    '2/5': '⅖',
    '3/5': '⅗',
    '4/5': '⅘',
    '1/6': '⅙',
    '5/6': '⅚',
    '1/8': '⅛',
    '3/8': '⅜',
    '5/8': '⅝',
    '7/8': '⅞',
  };
  
  // Replace common fractions with Unicode symbols
  Object.entries(fractionMap).forEach(([fraction, unicode]) => {
    formatted = formatted.replace(new RegExp(fraction, 'g'), unicode);
  });
  
  // Handle complex exponents: (expression)^(expression), etc.
  formatted = formatted.replace(/(\([^)]+\))\^(\([^)]+\))/g, '<span class="expression">$1</span><sup>$2</sup>');
  formatted = formatted.replace(/(\([^)]+\))\^(\d+)/g, '<span class="expression">$1</span><sup>$2</sup>');
  formatted = formatted.replace(/(\d+)\^(\([^)]+\))/g, '$1<sup>$2</sup>');
  
  // Handle multi-digit and simple exponents
  formatted = formatted.replace(/(\d+)\^(\d+)/g, '$1<sup>$2</sup>');
  formatted = formatted.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9])/g, '$1<sup>$2</sup>');
  
  // Handle square roots - convert sqrt(expression) to √(expression)
  // Handle nested parentheses first: sqrt((a+b)) -> √((a+b))
  formatted = formatted.replace(/sqrt\((\([^)]+\))\)/gi, '√$1');
  // Handle simple expressions: sqrt(16) -> √(16), sqrt(x+y) -> √(x+y)
  formatted = formatted.replace(/sqrt\(([^)]+)\)/gi, '√($1)');
  // Handle bare sqrt without parentheses: sqrt4 -> √4
  formatted = formatted.replace(/sqrt(\d+)/gi, '√$1');
  
  // Handle absolute values
  formatted = formatted.replace(/abs\((\([^)]+\))\)/g, '|$1|');
  formatted = formatted.replace(/abs\(([^)]+)\)/g, '|$1|');
  
  // Handle factorials
  formatted = formatted.replace(/(\([^)]+\))!/g, '$1!');
  formatted = formatted.replace(/(\d+)!/g, '$1!');
  formatted = formatted.replace(/([a-zA-Z]+)!/g, '$1!');
  
  // For other fractions, use HTML superscript/subscript styling
  formatted = formatted.replace(/(\d+)\/(\d+)/g, '<span class="fraction"><sup>$1</sup>/<sub>$2</sub></span>');
  
  return formatted
    .replace(/\*/g, '×')
    .replace(/=/g, ' = ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' − ')
    .trim();
};

export default MathEquation;