import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/variables.css' 
import './styles/global.css' 
import './index.css

// --- LEGACY STYLE IMPORTS (Fixed: Visual Integrity) ---
// Loading these ensures that variables (--primary-color), fonts, 
// and custom component styles from the HTML version are available.
import './styles/variables.css';
import './styles/global.css';
import './styles/uhome.css';     // Home page specific styles
import './styles/mcourse.css';   // Learning interface styles
import './styles/mcourseD.css';  // Course detail styles
import './styles/uprojects.css'; // Projects page styles

// Note: If you have a Tailwind index.css, import it here as well
// import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
