import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 👉 ADD THIS IMPORT
import { AppProvider } from './components/ContextStore'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👉 WRAP APP HERE */}
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)