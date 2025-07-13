import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Basic styles
const basicStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8fafc;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Inject styles
const style = document.createElement('style');
style.textContent = basicStyles;
document.head.appendChild(style);

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML file.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)