import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { MainPage } from './pages/MainPage'
import { RoutinesPage } from './pages/RoutinesPage'
import { BrainPage } from './pages/BrainPage'
import { MuseumPage } from './pages/MuseumPage'

export default function App() {
  return (
    <BrowserRouter basename="/gorisuke-tchi">
      <div className="min-h-screen bg-bg font-mono">
        <div className="max-w-sm mx-auto pb-20 min-h-screen">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/brain" element={<BrainPage />} />
            <Route path="/museum" element={<MuseumPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
