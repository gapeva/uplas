import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { UplasProvider } from './contexts/UplasContext.jsx';

// Import Legacy CSS (Order Matters)
import './css/variables.css';
import './css/global.css';
import './css/header.css'; // Ensure this exists or use provided fallback styles
import './css/uhome.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UplasProvider>
        <App />
      </UplasProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
