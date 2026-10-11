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

  const statsCards = [
    { label: 'Utilisateurs',    value: statsData.totalUsers,        icon: Users,      color: 'text-white'     },
    { label: 'Offres',          value: statsData.totalOffres,       icon: Briefcase,  color: 'text-[#00f098]' },
    { label: 'Candidatures',    value: statsData.totalCandidatures, icon: FileText,   color: 'text-amber-300' },
    { label: 'Administrateurs', value: 1,                           icon: Shield,     color: 'text-[#00f098]' },
  ]

  const typeColors = {
    'Stage':     'bg-white/5 text-gray-300 border-white/10',
    'CDI':       'bg-[#00f098]/10 text-[#00f098] border-[#00f098]/20',
    'CDD':       'bg-amber-400/10 text-amber-300 border-amber-400/20',
    'Freelance': 'bg-white/5 text-gray-300 border-white/10',
  }

  const onglets = [
    { key: 'stats',        label: 'Statistiques',      icon: TrendingUp },
    { key: 'offres',       label: 'Toutes les offres', icon: Briefcase  },
    { key: 'utilisateurs', label: 'Utilisateurs',      icon: Users      },
    { key: 'system',       label: 'Système',           icon: Shield     },
  ]

  return (
    <Layout>
      <div className="space-y-8 bg-[#0b1a19] p-6 md:p-8 rounded-[2rem] border border-white/5">

        {/* ── 1. HEADER AVEC BADGE EN LIGNE FDE ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Tableau de bord Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Supervision globale et performances du système ATS.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-[#00f098]/10 border border-[#00f098]/20 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,152,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f098] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f098]"></span>
              </span>
              <span className="text-xs font-bold text-[#00f098] tracking-wide">Système en ligne</span>
            </div>
          </div>
        </div>

        {/* ── 2. LES 4 CARTES KPIS (FOND RELIEF #041619) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div 
                key={i} 
                className="relative overflow-hidden bg-[#041619] border border-white/5 rounded-2xl p-5 hover:border-[#00f098]/30 hover:-translate-y-1 transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm font-medium">{s.label}</p>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0b1a19] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">{s.value}</p>
              </div>
            )
          })}
        </div>

        

      {/* ── STATS (CHARTE FDE AVEC JAUGES VERT MENTHE ET RELIEF #041619) ── */}
      {onglet === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 1. Répartition utilisateurs */}
          <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors duration-300">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00f098]" />
              Répartition des utilisateurs
            </h3>
            <div className="space-y-5">
              {[
                { role: 'candidat',  color: 'bg-white/40',  label: 'Candidats'   },
                { role: 'recruteur', color: 'bg-[#00f098]', label: 'Recruteurs'  },
                { role: 'admin',     color: 'bg-[#00f098]', label: 'Admins'      },
              ].map(r => {
                const count = users.filter(u => u.role === r.role).length
                const pct   = users.length > 0 ? Math.round((count / users.length) * 100) : 0
                return (
                  <div key={r.role}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 font-medium">{r.label}</span>
                      <span className="text-white font-bold">{count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                    </div>
                    {/* Jauge horizontale vert menthe FDE */}
                    <div className="h-2 bg-[#0b1a19] rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full rounded-full ${r.color} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 2. Offres par type de contrat */}
          <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors duration-300">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#00f098]" />
              Offres par type de contrat
            </h3>
            <div className="space-y-5">
              {['Stage', 'CDI', 'CDD', 'Freelance'].map(type => {
                const count = offres.filter(o => o.typeContrat === type).length
                const pct   = offres.length > 0 ? Math.round((count / offres.length) * 100) : 0
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 font-medium">{type}</span>
                      <span className="text-white font-bold">{count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                    </div>
                    {/* Jauge horizontale CDI allumée en vert menthe fluo */}
                    <div className="h-2 bg-[#0b1a19] rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full ${type === 'CDI' ? 'bg-[#00f098] shadow-[0_0_8px_#00f098]' : 'bg-white/40'} transition-all duration-1000 ease-out`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. Derniers utilisateurs inscrits */}
          <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Derniers inscrits</h3>
              <button
                onClick={() => setOnglet('utilisateurs')}
                className="text-xs text-gray-300 hover:text-[#00f098] font-medium bg-[#0b1a19] hover:bg-white/5 border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
              >
                Voir tout <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {users.slice(0, 4).map(u => (
                <div key={u._id} className="flex items-center gap-4 p-3.5 bg-[#0b1a19] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <div className="w-10 h-10 bg-[#041619] border border-white/5 text-[#00f098] rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0">
                    {u.prenom?.[0]}{u.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{u.prenom} {u.nom}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{u.email}</p>
                  </div>
                  {/* Badges de rôles translucides */}
                  <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg border flex-shrink-0 ${
                    u.role === 'admin'     ? 'bg-[#00f098]/10 text-[#00f098] border-[#00f098]/20' :
                    u.role === 'recruteur' ? 'bg-[#00f098]/10 text-[#00f098] border-[#00f098]/20' :
                                             'bg-white/5 text-gray-300 border-white/10'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Dernières offres publiées */}
          <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Dernières offres</h3>
              <button
                onClick={() => setOnglet('offres')}
                className="text-xs text-gray-300 hover:text-[#00f098] font-medium bg-[#0b1a19] hover:bg-white/5 border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
              >
                Voir tout <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {offres.slice(0, 4).map(o => (
                <div key={o._id} className="flex items-center gap-4 p-3.5 bg-[#0b1a19] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <div className="w-10 h-10 bg-[#041619] border border-white/5 text-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{o.titre}</p>
                    <p className="text-gray-500 text-xs mt-0.5 font-medium">Par {o.recruteurId?.prenom} {o.recruteurId?.nom}</p>
                  </div>
                  {/* Badges de contrats harmonisés */}
                  <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg border flex-shrink-0 ${typeColors[o.typeContrat] || 'bg-white/5 text-gray-300 border-white/10'}`}>
                    {o.typeContrat}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
      
      {/* ⚠️ Pense bien à fermer la div principale ouverte à l'étape 2 juste avant </Layout> : */}
      {/* </div> */}

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

      {/* ── SYSTÈME (HARMONISÉ FDE) ── */}
      {onglet === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Version',         value: '1.0.0',                                        color: 'text-white' },
            { label: 'Stack',           value: 'MERN + IA',                                    color: 'text-[#00f098]' },
            { label: 'Base de données', value: 'MongoDB Atlas',                                color: 'text-[#00f098]' },
            { label: 'Analyse CV',      value: 'API Gemini (Google)',                          color: 'text-[#00f098]' },
            { label: 'Offres actives',  value: offres.filter(o => o.statut === 'ouverte').length, color: 'text-[#00f098]' },
            { label: 'Offres fermées',  value: offres.filter(o => o.statut === 'fermée').length,  color: 'text-red-400' },
          ].map((item, i) => (
            <div key={i} className="bg-[#041619] border border-white/5 rounded-2xl p-5 shadow-sm hover:border-white/10 transition-colors">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
              <p className={`text-xl font-black mt-2 tracking-tight ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      </div>
    </Layout>
  )
}