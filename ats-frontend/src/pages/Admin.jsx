import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Users, Briefcase, FileText, Shield, LogOut, Trash2 } from 'lucide-react'
import api from '../services/api'

export default function Admin() {
  const { user, logout }        = useAuth()
  const navigate                = useNavigate()
  const [onglet, setOnglet]     = useState('stats')
  const [statsData, setStatsData] = useState({ totalUsers: 0, totalOffres: 0, totalCandidatures: 0 })
  const [users, setUsers]       = useState([])
  const [offres, setOffres]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerDonnees()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const chargerDonnees = async () => {
    try {
      const [resStats, resUsers, resOffres] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/offres'),
      ])
      setStatsData(resStats.data)
      setUsers(resUsers.data)
      setOffres(resOffres.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const statsCards = [
    { label: 'Utilisateurs',    value: statsData.totalUsers,        icon: Users,     color: 'text-indigo-400', bg: 'bg-indigo-900/20 border-indigo-700' },
    { label: 'Offres',          value: statsData.totalOffres,       icon: Briefcase, color: 'text-teal-400',   bg: 'bg-teal-900/20 border-teal-700'     },
    { label: 'Candidatures',    value: statsData.totalCandidatures, icon: FileText,  color: 'text-amber-400',  bg: 'bg-amber-900/20 border-amber-700'   },
    { label: 'Administrateurs', value: 1,                           icon: Shield,    color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-700' },
  ]

  const typeColors = {
    'Stage':     'bg-blue-900/30 text-blue-400 border-blue-700',
    'CDI':       'bg-green-900/30 text-green-400 border-green-700',
    'CDD':       'bg-amber-900/30 text-amber-400 border-amber-700',
    'Freelance': 'bg-purple-900/30 text-purple-400 border-purple-700',
  }

  const onglets = [
    { key: 'stats',        label: 'Statistiques',      icon: FileText  },
    { key: 'offres',       label: 'Toutes les offres', icon: Briefcase },
    { key: 'utilisateurs', label: 'Utilisateurs',      icon: Users     },
    { key: 'system',       label: 'Système',           icon: Shield    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">ATS Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">👤 {user?.prenom} {user?.nom}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tableau de bord Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Vue d'ensemble du système ATS</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statsCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${s.bg}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${s.color}`} />
                  <div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-gray-500 text-xs">{s.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 p-1 rounded-xl w-fit mb-6">
          {onglets.map(o => {
            const Icon = o.icon
            return (
              <button
                key={o.key}
                onClick={() => setOnglet(o.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  onglet === o.key ? 'bg-purple-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {o.label}
              </button>
            )
          })}
        </div>

        {/* ── STATS ── */}
        {onglet === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Répartition des utilisateurs</h3>
              {[
                { role: 'candidat',  color: 'bg-indigo-500' },
                { role: 'recruteur', color: 'bg-teal-500'   },
                { role: 'admin',     color: 'bg-purple-500' },
              ].map(r => {
                const count = users.filter(u => u.role === r.role).length
                const pct   = users.length > 0 ? Math.round((count / users.length) * 100) : 0
                return (
                  <div key={r.role} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 capitalize">{r.role}</span>
                      <span className="text-white font-medium">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Offres par type</h3>
              {['Stage', 'CDI', 'CDD', 'Freelance'].map(type => {
                const count = offres.filter(o => o.typeContrat === type).length
                const pct   = offres.length > 0 ? Math.round((count / offres.length) * 100) : 0
                return (
                  <div key={type} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{type}</span>
                      <span className="text-white font-medium">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── OFFRES ── */}
        {onglet === 'offres' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">Toutes les offres ({offres.length})</h2>
            </div>
            {loading ? (
              <p className="text-center text-gray-500 py-12">Chargement...</p>
            ) : offres.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Aucune offre</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {offres.map(offre => (
                  <div key={offre._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-all">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white text-sm font-medium">{offre.titre}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[offre.typeContrat] || ''}`}>
                          {offre.typeContrat}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          offre.statut === 'ouverte' ? 'text-green-400 bg-green-900/20' : 'text-gray-500 bg-gray-800'
                        }`}>
                          {offre.statut}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Par {offre.recruteurId?.prenom} {offre.recruteurId?.nom} · {offre.niveauRequis}
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {offre.competences.slice(0, 4).map((c, i) => (
                          <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── UTILISATEURS ── */}
        {onglet === 'utilisateurs' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">Utilisateurs ({users.length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {users.map(u => (
                <div key={u._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {u.prenom?.[0]}{u.nom?.[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{u.prenom} {u.nom}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      u.role === 'admin'     ? 'bg-purple-900/30 text-purple-400 border-purple-700' :
                      u.role === 'recruteur' ? 'bg-teal-900/30 text-teal-400 border-teal-700' :
                                               'bg-indigo-900/30 text-indigo-400 border-indigo-700'
                    }`}>
                      {u.role}
                    </span>
                    {u.role !== 'admin' && (
                      <button
                        onClick={async () => {
                          if (confirm(`Supprimer ${u.prenom} ${u.nom} ?`)) {
                            await api.delete(`/admin/users/${u._id}`)
                            chargerDonnees()
                          }
                        }}
                        className="text-gray-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SYSTÈME ── */}
        {onglet === 'system' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Version',         value: '1.0.0',     color: 'text-indigo-400' },
              { label: 'Stack',           value: 'MERN + IA', color: 'text-teal-400'  },
              { label: 'Base de données', value: 'MongoDB',   color: 'text-green-400' },
              { label: 'Analyse CV',      value: 'IA locale', color: 'text-amber-400' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}