import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initTheme } from './utils/themeToggle'

// Import styles
import 'antd/dist/reset.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './theme.css'
import './index.css'
import './App.css'
import './styles/theme.css'

// Initialize theme before rendering
initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
