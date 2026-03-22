import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import App from './App.tsx'
import { ReduxProvider } from './providers/ReduxProvider'
import { QueryProvider } from './providers/QueryProvider'
import { MuiThemeProvider } from './providers/MuiThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <QueryProvider>
        <MuiThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MuiThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  </StrictMode>,
)
