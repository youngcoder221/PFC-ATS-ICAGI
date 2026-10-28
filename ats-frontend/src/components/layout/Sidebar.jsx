import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo-icon-small.png'
import {
  LayoutDashboard, Briefcase, FileText,
  Users, LogOut, ChevronRight, Shield, X
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

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { user, logout }       = useAuth()
  const navigate               = useNavigate()
  const location               = useLocation()
  const [searchParams]         = useSearchParams()
  const tabActif               = searchParams.get('tab') || ''

  const menu = user?.role === 'recruteur' ? menuRecruteur :
               user?.role === 'admin'     ? menuAdmin     : menuCandidat

  const handleLogout = () => {
    navigate('/', { replace: true })
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
    // Ferme automatiquement le tiroir sur mobile après sélection
    if (setMobileMenuOpen) setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Fond sombre transparent pour fermer le menu au clic extérieur (Mobile) */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Barre latérale : tiroir coulissant z-50 sur mobile, fixe w-64 sur desktop (md:) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 min-h-screen bg-[#0b1a19] border-r border-white/5 flex flex-col select-none transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex-shrink-0
      `}>

        {/* En-tête Logo + Bouton fermer sur mobile */}
        <div className="p-5 sm:p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ATS Platform"
              className="w-9 h-9 object-contain"
            />
            <div>
              <h1 className="text-white font-bold text-sm tracking-tight">ATS Platform</h1>
              <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Bouton X de fermeture visible uniquement sur mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg bg-[#041619] border border-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                active
                  ? 'bg-[#00f098] text-[#0b1a19] shadow-[0_0_15px_rgba(0,240,152,0.2)] font-bold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )
        })}
      </nav>

      {/* Profil + Déconnexion */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#00f098] rounded-full flex items-center justify-center text-[#0b1a19] text-xs font-black shadow-sm">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      </aside>
    </>
  )
}