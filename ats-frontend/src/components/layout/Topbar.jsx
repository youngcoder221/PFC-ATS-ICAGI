import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, LogOut, User, CheckCircle, Clock, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const pageTitles = {
  '/recruteur':  { title: 'Mes offres',          sub: 'Gestion des offres' },
  '/candidat':   { title: 'Espace candidat',      sub: 'Offres et candidatures' },
  '/admin':      { title: 'Tableau de bord',      sub: 'Administration système' },
}

const initialesDe = (prenom, nom) =>
  `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase()

export default function Topbar() {
  const location              = useLocation()
  const navigate              = useNavigate()
  const { user, logout }      = useAuth()
  const [openNotif, setOpenNotif]   = useState(false)
  const [openProfil, setOpenProfil] = useState(false)
  const [notifs, setNotifs]         = useState([])
  const [search, setSearch]         = useState('')
  const notifRef  = useRef(null)
  const profilRef = useRef(null)

  const page = pageTitles[location.pathname] || { title: 'ATS', sub: '' }

  // Charger les notifications selon le rôle
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerNotifs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const chargerNotifs = async () => {
    try {
      if (user?.role === 'recruteur') {
        const res = await api.get('/offres/mes/offres')
        const liste = []
        if (res.data.length > 0) {
          liste.push({
            id: 'offres',
            type: 'ok',
            texte: `${res.data.length} offre(s) publiée(s)`
          })
        }
        liste.push({ id: 'bienvenue', type: 'ok', texte: `Bienvenue ${user?.prenom} !` })
        setNotifs(liste)
      } else if (user?.role === 'candidat') {
        const res = await api.get('/cv/mes-candidatures')
        const liste = []
        const enAttente = res.data.filter(c => c.statut === 'en_attente').length
        const retenus   = res.data.filter(c => c.statut === 'retenu').length
        if (enAttente > 0) {
          liste.push({ id: 'attente', type: 'warn', texte: `${enAttente} candidature(s) en attente` })
        }
        if (retenus > 0) {
          liste.push({ id: 'retenu', type: 'ok', texte: `🎉 ${retenus} candidature(s) retenue(s) !` })
        }
        liste.push({ id: 'bienvenue', type: 'ok', texte: `Bienvenue ${user?.prenom} !` })
        setNotifs(liste)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Fermer au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current  && !notifRef.current.contains(e.target))  setOpenNotif(false)
      if (profilRef.current && !profilRef.current.contains(e.target)) setOpenProfil(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-4 px-6 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">

      {/* Titre de page */}
      <div>
        <h1 className="text-[16px] font-semibold text-white">{page.title}</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">
          ATS / <span className="text-indigo-400">{page.sub}</span>
        </p>
      </div>

      {/* Recherche */}
      <div className="ml-8 hidden md:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2 min-w-[220px] focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <Search className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-500 w-full"
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <X className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
          </button>
        )}
      </div>

      {/* Actions à droite */}
      <div className="ml-auto flex items-center gap-2">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setOpenNotif(v => !v); setOpenProfil(false) }}
            className="relative w-9 h-9 rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-gray-700 transition-all"
          >
            <Bell className="w-4 h-4" />
            {notifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900" />
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <span className="text-xs bg-indigo-900/50 text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                  {notifs.length}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-gray-500">Aucune notification</p>
                ) : notifs.map(n => (
                  <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    {n.type === 'warn'
                      ? <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      : <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    }
                    <p className="text-xs text-gray-300 leading-snug">{n.texte}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profil */}
        <div className="relative" ref={profilRef}>
          <button
            onClick={() => { setOpenProfil(v => !v); setOpenNotif(false) }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg"
          >
            {user ? initialesDe(user.prenom, user.nom) : <User className="w-4 h-4" />}
          </button>

          {openProfil && (
            <div className="absolute right-0 mt-2 w-60 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-sm font-bold">
                  {initialesDe(user?.prenom, user?.nom)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.prenom} {user?.nom}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}