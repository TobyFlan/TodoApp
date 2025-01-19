import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './components/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
        <App />
      </div>
    </AuthProvider>
  </StrictMode>
)
