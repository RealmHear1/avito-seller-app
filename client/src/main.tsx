import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import App from './App.tsx'
import { QueryProvider } from './providers/QueryProvider'
import { MuiThemeProvider } from './providers/MuiThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <MuiThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MuiThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
