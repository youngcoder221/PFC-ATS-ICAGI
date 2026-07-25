import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login              from './pages/Login'
import Register           from './pages/Register'
import DashboardRecruteur from './pages/DashboardRecruteur'
import DashboardCandidat  from './pages/DashboardCandidat'
import Ranking            from './pages/Ranking'
import Admin              from './pages/Admin'  

// Route protégée selon le rôle
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Navigate to="/login" />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/recruteur" element={
            <PrivateRoute role="recruteur">
              <DashboardRecruteur />
            </PrivateRoute>
          }/>

          <Route path="/candidat" element={
            <PrivateRoute role="candidat">
              <DashboardCandidat />
            </PrivateRoute>
          }/>

          <Route path="/ranking/:offreId" element={
            <PrivateRoute role="recruteur">
              <Ranking />
            </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}