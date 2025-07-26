import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './socket/SocketProvider.jsx'
import { NotificationsProvider } from './components/NotificationsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationsProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </NotificationsProvider>  
  </StrictMode>,
)
