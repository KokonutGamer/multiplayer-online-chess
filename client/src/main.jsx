import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage.jsx'
import GamePage from './pages/GamePage.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="play" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
