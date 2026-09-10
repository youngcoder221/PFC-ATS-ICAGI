import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo-icon-small.png'
import {
  LayoutDashboard, Briefcase, FileText,
  Users, LogOut, ChevronRight, Trophy,Shield
} from 'lucide-react'

const menuAdmin = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/admin', tab: ''             },
  { label: 'Statistiques',   icon: FileText,         path: '/admin', tab: 'stats'        },
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
  { label: 'Postuler',         icon: Trophy,           path: '/candidat', tab: 'postuler'     },
  { label: 'Mes candidatures', icon: FileText,         path: '/candidat', tab: 'candidatures' },
]

export default function Sidebar() {
  const { user, logout }       = useAuth()
  const navigate               = useNavigate()
  const location               = useLocation()
  const [searchParams]         = useSearchParams()
  const tabActif               = searchParams.get('tab') || ''

    const menu = user?.role === 'recruteur' ? menuRecruteur :
                 user?.role === 'admin'     ? menuAdmin     : menuCandidat

  const handleLogout = () => {
    logout()
    navigate('/login')
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
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="ATS Platform"
            className="w-9 h-9 object-contain"
          />
          <div>
            <h1 className="text-white font-bold text-sm">ATS Platform</h1>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const Icon   = item.icon
          const active = isActive(item)
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3" />}
            </button>
          )
        })}
      </nav>

      {/* Profil + Déconnexion */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}