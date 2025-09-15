import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Import styles
import 'antd/dist/reset.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './theme.css'
import './index.css'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
