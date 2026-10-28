import { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo-icon-small.png'
import {
  LayoutDashboard, Briefcase, FileText,
  Users, LogOut, ChevronRight, ChevronLeft, Shield
} from 'lucide-react'

const menuAdmin = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/admin', tab: ''             },
  { label: 'Offres',         icon: Briefcase,        path: '/admin', tab: 'offres'       },
  { label: 'Utilisateurs',   icon: Users,            path: '/admin', tab: 'utilisateurs' },
  { label: 'Système',        icon: Shield,           path: '/admin', tab: 'system'       },
]

const menuRecruteur = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/recruteur', tab: '' },
  { label: 'Mes offres',  icon: Briefcase,        path: '/recruteur', tab: 'offres' },
]

const menuCandidat = [
  { label: 'Dashboard',        icon: LayoutDashboard, path: '/candidat', tab: ''             },
  { label: 'Offres',           icon: Briefcase,        path: '/candidat', tab: 'offres'       },
  { label: 'Mes candidatures', icon: FileText,         path: '/candidat', tab: 'candidatures' },
]

export default function Sidebar() {
  const { user, logout }       = useAuth()
  const navigate               = useNavigate()
  const location               = useLocation()
  const [searchParams]         = useSearchParams()
  const tabActif               = searchParams.get('tab') || ''

  // 🔑 Clé de préférence isolée par compte utilisateur
  const userId = user?.id || user?._id
  const storageKey = userId ? `ats_sidebar_${userId}_collapsed` : 'ats_sidebar_collapsed'

  // 💾 Initialisation directe sans effet secondaire (100% conforme ESLint)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(storageKey) === 'true'
  })

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev
      localStorage.setItem(storageKey, String(next))
      return next
    })
  }
  const menu = user?.role === 'recruteur' ? menuRecruteur :
               user?.role === 'admin'     ? menuAdmin     : menuCandidat

  const handleLogout = () => {
    // 1. On force le scroll tout en haut de la page
    window.scrollTo(0, 0)
    
    // 2. On retourne sur l'accueil immédiatement
    navigate('/', { replace: true })
    
    // 3. On décale la destruction de la session
    setTimeout(() => {
      logout()
    }, 50)
  }

  const isActive = (item) => {
  if (location.pathname !== item.path) return false
  if (item.tab === '' && (tabActif === '' || tabActif === null)) return true
  return tabActif === item.tab
}

  const handleClick = (item) => {
    if (item.tab) {
      navigate(`${item.path}?tab=${item.tab}`)
    } else {
      navigate(item.path)
    }
  }

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} min-h-screen bg-[#0b1a19] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out relative flex-shrink-0 select-none`}>

      {/* 🔘 Bouton flottant moderne sur la bordure latérale (Style Linear/Notion) */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute -right-3 top-5 z-30 w-6 h-6 rounded-full bg-[#041619] border border-white/15 text-gray-400 hover:text-[#00f098] hover:border-[#00f098] hover:scale-110 flex items-center justify-center shadow-lg cursor-pointer transition-all"
        title={isCollapsed ? "Déplier le menu" : "Réduire le menu"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* En-tête : Aligné exactement sur la hauteur h-16 de la Topbar */}
      <div className={`h-16 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'} transition-all`}>
        <div 
          onClick={() => isCollapsed && toggleSidebar()}
          className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'cursor-pointer' : ''}`}
          title={isCollapsed ? "Cliquer pour agrandir le menu" : undefined}
        >
          <img
            src={logo}
            alt="ATS Platform"
            className="w-9 h-9 object-contain flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-white font-bold text-sm tracking-tight truncate">ATS Platform</h1>
              <p className="text-gray-500 text-[11px] capitalize truncate">{user?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu de navigation avec géométrie en carrés parfaits en mode réduit */}
      <nav className={`flex-1 py-4 ${isCollapsed ? 'px-2 space-y-2' : 'px-3 space-y-1.5'}`}>
        {menu.map((item) => {
          const Icon   = item.icon
          const active = isActive(item)
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center transition-all cursor-pointer ${
                isCollapsed
                  ? 'w-11 h-11 mx-auto justify-center rounded-xl'
                  : 'w-full gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium'
              } ${
                active
                  ? 'bg-[#00f098] text-[#0b1a19] shadow-[0_0_15px_rgba(0,240,152,0.25)] font-bold'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* Profil + Déconnexion avec alignement géométrique parfait */}
      <div className={`border-t border-white/5 transition-all ${isCollapsed ? 'p-3 flex flex-col items-center gap-2.5' : 'p-4'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#00f098] rounded-xl flex items-center justify-center text-[#0b1a19] text-xs font-black flex-shrink-0 shadow-sm">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-500 text-[11px] truncate">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Déconnexion</span>
            </button>
          </>
        ) : (
          <>
            <div 
              className="w-11 h-11 bg-[#00f098] rounded-xl flex items-center justify-center text-[#0b1a19] text-xs font-black shadow-sm cursor-pointer hover:scale-105 transition-transform"
              title={`${user?.prenom} ${user?.nom} (${user?.role})`}
            >
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

    </aside>
  )
}