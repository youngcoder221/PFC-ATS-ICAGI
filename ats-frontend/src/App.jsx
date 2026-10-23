import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login              from './pages/Login'
import Landing from './pages/Landing'
import Register           from './pages/Register'
import DashboardRecruteur from './pages/DashboardRecruteur'
import DashboardCandidat  from './pages/DashboardCandidat'
import Ranking            from './pages/Ranking'
import Admin              from './pages/Admin'
import OffreDetailsPublic from './pages/OffreDetailsPublic' 
import EntreprisePublic from './pages/EntreprisePublic' 

// Route protégée selon le rôle
// Route protégée selon le rôle
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth()
  // On utilise 'replace' pour écraser l'historique et éviter les boucles de redirection au clic sur "Retour"
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/offres/:id" element={<OffreDetailsPublic />} />
          <Route path="/entreprises/:nom" element={<EntreprisePublic />} />
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

          <Route path="/admin" element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }/>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}