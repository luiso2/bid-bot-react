import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Verificar entorno de Telegram WebApp
if (!window.Telegram || !window.Telegram.WebApp) {
  console.error('Esta aplicación solo funciona dentro de Telegram')
  document.body.innerHTML = '<div style="padding:20px;text-align:center;">Esta aplicación solo funciona dentro de Telegram</div>'
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
