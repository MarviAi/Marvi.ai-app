import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { validateEnv } from './utils/envValidation';

// Validate environment variables before rendering
if (!validateEnv()) {
  console.error('Application cannot start due to missing environment variables');
} else {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}