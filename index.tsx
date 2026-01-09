import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Render Error:", error);
  rootElement.innerHTML = `<div style="color:red; padding: 20px;">
    <h3>Erro na Inicialização</h3>
    <pre>${error instanceof Error ? error.message : JSON.stringify(error)}</pre>
  </div>`;
}