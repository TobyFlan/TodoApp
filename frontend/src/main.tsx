import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Button } from '@/components/ui/button'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Button className="bg-gray-700"><p className="min-w-11 text-opacity-0">Hello, world!</p></Button>
    
  </StrictMode>,
)
