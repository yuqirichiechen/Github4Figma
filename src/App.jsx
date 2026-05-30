import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './layout/AppShell'
import ChangesView from './flows/changes/ChangesView'
import ReviewView from './flows/review/ReviewView'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/changes" replace />} />
        <Route path="/changes" element={<ChangesView />} />
        <Route path="/review" element={<ReviewView />} />
        <Route path="*" element={<Navigate to="/changes" replace />} />
      </Route>
    </Routes>
  )
}
