import { useEffect } from 'react';

declare global {
  interface Window {
    katex: any;
  }
}

// Load KaTeX if not already loaded
export function useKaTeX() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.katex) {
      // Load KaTeX CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);

      // Load KaTeX JS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
}

// Render math expression
export function renderMath(expression: string, displayMode: boolean = false): string {
  if (typeof window !== 'undefined' && window.katex) {
    try {
      return window.katex.renderToString(expression, {
        displayMode,
        throwOnError: false
      });
    } catch (error) {
      console.error('KaTeX render error:', error);
      return expression;
    }
  }
  return expression;
}

// Convert text with inline math to HTML with KaTeX
export function processTextWithMath(text: string): string {
  if (!text) return '';

  // Replace ^3 style notation with proper KaTeX superscript
  let processed = text.replace(/\^(\d+)/g, (match, num) => `^{${num}}`);

  // Replace inline math expressions $...$ with KaTeX
  processed = processed.replace(/\$([^$]+)\$/g, (match, expr) => {
    return renderMath(expr, false);
  });

  // Replace display math expressions $$...$$ with KaTeX
  processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, expr) => {
    return renderMath(expr, true);
  });

  return processed;
}

// Component for rendering math text
interface MathTextProps {
  children: string;
  className?: string;
}

export function MathText({ children, className }: MathTextProps) {
  useKaTeX();

  const html = processTextWithMath(children);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
