/**
 * F1 Tifosi Tracker - Entry Point
 * Purpose: Initializes the React environment and mounts the root application component.
 * Features:
 * - Concurrent Rendering: Utilizes the createRoot API for optimized performance.
 * - Strict Mode: Enables additional development-time checks for side-effect management 
 * and deprecated API usage.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Root Element Mounting
// Selects the 'root' div from the public/index.html and initializes the React Virtual DOM.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  /**
   * React.StrictMode:
   * A developmental tool that highlights potential problems in the application 
   * without rendering any visible UI. It activates checks for unsafe lifecycles 
   * and ensures that the App remains resilient and performant.
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);