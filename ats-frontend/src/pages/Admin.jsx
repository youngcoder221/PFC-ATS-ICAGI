import { useState, useEffect } from 'react'
import { Users, Briefcase, FileText, Shield, Trash2, TrendingUp, ChevronRight } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const onglet                          = searchParams.get('tab') || 'stats'
  const setOnglet                       = (tab) => setSearchParams({ tab })
  const [statsData, setStatsData]       = useState({ totalUsers: 0, totalOffres: 0, totalCandidatures: 0 })
  const [users, setUsers]               = useState([])
  const [offres, setOffres]             = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
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

  const statsCards = [
    { label: 'Utilisateurs',    value: statsData.totalUsers,        icon: Users,      color: 'text-indigo-400', bg: 'bg-indigo-900/20 border-indigo-700' },
    { label: 'Offres',          value: statsData.totalOffres,       icon: Briefcase,  color: 'text-teal-400',   bg: 'bg-teal-900/20 border-teal-700'     },
    { label: 'Candidatures',    value: statsData.totalCandidatures, icon: FileText,   color: 'text-amber-400',  bg: 'bg-amber-900/20 border-amber-700'   },
    { label: 'Administrateurs', value: 1,                           icon: Shield,     color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-700' },
  ]

  const typeColors = {
    'Stage':     'bg-blue-900/30 text-blue-400 border-blue-700',
    'CDI':       'bg-green-900/30 text-green-400 border-green-700',
    'CDD':       'bg-amber-900/30 text-amber-400 border-amber-700',
    'Freelance': 'bg-purple-900/30 text-purple-400 border-purple-700',
  }

  const onglets = [
    { key: 'stats',        label: 'Statistiques',      icon: TrendingUp },
    { key: 'offres',       label: 'Toutes les offres', icon: Briefcase  },
    { key: 'utilisateurs', label: 'Utilisateurs',      icon: Users      },
    { key: 'system',       label: 'Système',           icon: Shield     },
  ]

  return (
    <Layout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tableau de bord Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Vue d'ensemble du système ATS</p>
      </div>

      {/* Stats globales — toujours visibles */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`bg-gray-900 border rounded-xl p-5 ${s.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-medium">{s.label}</p>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
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

          {/* Répartition utilisateurs */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Répartition des utilisateurs</h3>
            {[
              { role: 'candidat',  color: 'bg-indigo-500', label: 'Candidats'   },
              { role: 'recruteur', color: 'bg-teal-500',   label: 'Recruteurs'  },
              { role: 'admin',     color: 'bg-purple-500', label: 'Admins'      },
            ].map(r => {
              const count = users.filter(u => u.role === r.role).length
              const pct   = users.length > 0 ? Math.round((count / users.length) * 100) : 0
              return (
                <div key={r.role} className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="text-white font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Offres par type */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Offres par type de contrat</h3>
            {['Stage', 'CDI', 'CDD', 'Freelance'].map(type => {
              const count = offres.filter(o => o.typeContrat === type).length
              const pct   = offres.length > 0 ? Math.round((count / offres.length) * 100) : 0
              return (
                <div key={type} className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">{type}</span>
                    <span className="text-white font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Derniers utilisateurs */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Derniers inscrits</h3>
              <button
                onClick={() => setOnglet('utilisateurs')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Voir tout <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {users.slice(0, 4).map(u => (
                <div key={u._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {u.prenom?.[0]}{u.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{u.prenom} {u.nom}</p>
                    <p className="text-gray-500 text-xs truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    u.role === 'admin'     ? 'bg-purple-900/30 text-purple-400 border-purple-700' :
                    u.role === 'recruteur' ? 'bg-teal-900/30 text-teal-400 border-teal-700' :
                                             'bg-indigo-900/30 text-indigo-400 border-indigo-700'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dernières offres */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Dernières offres</h3>
              <button
                onClick={() => setOnglet('offres')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Voir tout <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {offres.slice(0, 4).map(o => (
                <div key={o._id} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{o.titre}</p>
                    <p className="text-gray-500 text-xs">{o.recruteurId?.prenom} {o.recruteurId?.nom}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${typeColors[o.typeContrat] || ''}`}>
                    {o.typeContrat}
                  </span>
                </div>
              ))}
            </div>
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
                  <div className="flex-1">
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
                  {/* Bouton fermer/rouvrir */}
                  <button
                    onClick={async () => {
                      await api.patch(`/offres/${offre._id}/statut`)
                      chargerDonnees()
                    }}
                    className={`ml-4 text-xs px-3 py-1.5 rounded-lg border transition-all flex-shrink-0 ${
                      offre.statut === 'ouverte'
                        ? 'border-red-700 text-red-400 hover:bg-red-900/20'
                        : 'border-green-700 text-green-400 hover:bg-green-900/20'
                    }`}
                  >
                    {offre.statut === 'ouverte' ? 'Fermer' : 'Rouvrir'}
                  </button>
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
                    {u.poste && <p className="text-gray-600 text-xs">{u.poste}</p>}
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
            { label: 'Version',         value: '1.0.0',                                    color: 'text-indigo-400' },
            { label: 'Stack',           value: 'MERN + IA',                                color: 'text-teal-400'  },
            { label: 'Base de données', value: 'MongoDB',                                  color: 'text-green-400' },
            { label: 'Analyse CV',      value: 'IA locale',                                color: 'text-amber-400' },
            { label: 'Offres actives',  value: offres.filter(o=>o.statut==='ouverte').length, color: 'text-green-400' },
            { label: 'Offres fermées',  value: offres.filter(o=>o.statut==='fermée').length,  color: 'text-red-400'   },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

    </Layout>
  )
}