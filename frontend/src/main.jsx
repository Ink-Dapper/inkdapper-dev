import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

function showFatalError(err) {
  console.error('[Fatal] React failed to mount:', err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height:100vh;padding:2rem;font-family:monospace;background:#fff8f8">
        <h2 style="color:#c00;font-size:1.4rem;margin-bottom:1rem">Fatal Error — React could not mount</h2>
        <pre style="background:#fff;border:1px solid #f99;border-radius:6px;padding:1rem;white-space:pre-wrap;color:#333;font-size:0.85rem">${
          err && (err.stack || err.toString())
        }</pre>
        <button onclick="location.reload()" style="margin-top:1rem;padding:0.5rem 1.5rem;background:#f97316;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:1rem">
          Refresh Page
        </button>
      </div>`;
  }
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ShopContextProvider>
            <App />
          </ShopContextProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
} catch (err) {
  showFatalError(err);
}