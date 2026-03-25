import '@fontsource/syne/latin-700.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource-variable/noto-sans-sc'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './styles/tokens.css'
import './styles/base.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js?v=${__APP_VERSION__}`

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(serviceWorkerUrl)
  })
}
