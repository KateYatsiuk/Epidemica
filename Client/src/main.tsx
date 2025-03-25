import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { ApiProvider } from './api/ApiProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </Provider>
  </StrictMode>,
)
