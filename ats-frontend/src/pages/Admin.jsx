import { useState, useEffect } from 'react'
import { Users, Briefcase, FileText, Shield, Trash2, ChevronRight } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const onglet                          = searchParams.get('tab') || ''
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

  // ─── SUPPRESSION D'UNE CANDIDATURE (ADMIN) ─────────────
  const handleSupprimerCandidature = async (candidatureId) => {
    if (!confirm("Voulez-vous vraiment supprimer cette candidature ?")) return

    try {
      await api.delete(`/admin/candidatures/${candidatureId}`)

      // Mise à jour instantanée de l'état local sans rechargement
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.candidatures) {
          return {
            ...u,
            candidatures: u.candidatures.filter(c => c._id !== candidatureId)
          }
        }
        return u
      }))

      // Décrémenter le compteur global de candidatures
      setStatsData(prev => ({
        ...prev,
        totalCandidatures: Math.max(0, prev.totalCandidatures - 1)
      }))
    } catch (err) {
      console.error("Erreur lors de la suppression de la candidature :", err)
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


  return (
    <Layout>
      <div className="space-y-6 md:space-y-8 bg-[#0b1a19] p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5">

        {/* ── 1. HEADER AVEC CALIBRE HARMONISÉ ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Tableau de bord Admin</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium">Supervision globale et performances du système ATS.</p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="px-3 py-1 bg-[#00f098]/10 border border-[#00f098]/20 rounded-full flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,152,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f098] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f098]"></span>
              </span>
              <span className="text-[11px] font-black text-[#00f098] uppercase tracking-wider">Système en ligne</span>
            </div>
          </div>
        </div>

        {/* ── 2. LES 4 CARTES KPIS (TYPOGRAPHIE DENSE & RELIEF) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div 
                key={i} 
                className="relative overflow-hidden bg-[#041619] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-[#00f098]/30 hover:-translate-y-1 transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0b1a19] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{s.value}</p>
              </div>
            )
          })}
        </div>

          {/* ── 3. VUE DASHBOARD / STATISTIQUES (CALIBRES ÉQUILIBRÉS) ── */}
        {(onglet === '' || onglet === 'stats') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 1. Répartition utilisateurs */}
            <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2.5 mb-5">
                <Users className="w-4 h-4 text-[#00f098]" />
                <h3 className="text-white font-black text-lg tracking-tight">
                  Répartition des utilisateurs
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { role: 'candidat',  color: 'bg-white/40',  label: 'Candidats'   },
                  { role: 'recruteur', color: 'bg-[#00f098]', label: 'Recruteurs'  },
                  { role: 'admin',     color: 'bg-[#00f098]', label: 'Admins'      },
                ].map(r => {
                  const count = users.filter(u => u.role === r.role).length
                  const pct   = users.length > 0 ? Math.round((count / users.length) * 100) : 0
                  return (
                    <div key={r.role}>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-gray-400">{r.label}</span>
                        <span className="text-white font-bold">{count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-[#0b1a19] rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full rounded-full ${r.color} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Offres par type de contrat */}
            <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2.5 mb-5">
                <Briefcase className="w-4 h-4 text-[#00f098]" />
                <h3 className="text-white font-black text-lg tracking-tight">
                  Offres par type de contrat
                </h3>
              </div>
              <div className="space-y-4">
                {['Stage', 'CDI', 'CDD', 'Freelance'].map(type => {
                  const count = offres.filter(o => o.typeContrat === type).length
                  const pct   = offres.length > 0 ? Math.round((count / offres.length) * 100) : 0
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-gray-400">{type}</span>
                        <span className="text-white font-bold">{count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-[#0b1a19] rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full ${type === 'CDI' ? 'bg-[#00f098] shadow-[0_0_6px_#00f098]' : 'bg-white/40'} transition-all duration-700 ease-out`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. Derniers utilisateurs inscrits */}
            <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-black text-lg tracking-tight">Derniers inscrits</h3>
                <button
                  onClick={() => setOnglet('utilisateurs')}
                  className="text-xs text-gray-300 hover:text-[#00f098] font-bold bg-[#0b1a19] hover:bg-white/5 border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2.5">
                {users.slice(0, 4).map(u => (
                  <div key={u._id} className="flex items-center gap-3.5 p-3 bg-[#0b1a19] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                    <div className="w-9 h-9 bg-[#041619] border border-white/5 text-[#00f098] rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0">
                      {u.prenom?.[0]}{u.nom?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold tracking-tight truncate">{u.prenom} {u.nom}</p>
                      <p className="text-gray-500 text-xs truncate">{u.email}</p>
                    </div>
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
            <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-black text-lg tracking-tight">Dernières offres</h3>
                <button
                  onClick={() => setOnglet('offres')}
                  className="text-xs text-gray-300 hover:text-[#00f098] font-bold bg-[#0b1a19] hover:bg-white/5 border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2.5">
                {offres.slice(0, 4).map(o => (
                  <div key={o._id} className="flex items-center gap-3.5 p-3 bg-[#0b1a19] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                    <div className="w-9 h-9 bg-[#041619] border border-white/5 text-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold tracking-tight truncate">{o.titre}</p>
                      <p className="text-gray-500 text-xs truncate">Par {o.recruteurId?.prenom} {o.recruteurId?.nom}</p>
                    </div>
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

      {/* ── 4. VUE TOUTES LES OFFRES (CANVAS BLANC HAUT CONTRASTE) ── */}
      {onglet === 'offres' && (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          
          {/* En-tête calibré */}
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Toutes les offres ({offres.length})
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium leading-relaxed">
              Supervision globale et gestion des statuts de recrutement.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-16 font-medium text-xs">Chargement des offres...</p>
          ) : offres.length === 0 ? (
            <div className="text-center py-16 bg-[#f8fafc] rounded-2xl border border-gray-100">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
              <p className="text-gray-500 font-medium text-xs">Aucune offre disponible dans le système.</p>
            </div>
          ) : (
            /* Grille moderne de cartes verticales (Cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offres.map(offre => (
                <div
                  key={offre._id}
                  className="bg-[#041619] border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >
                  <div>
                    {/* En haut : Titre du poste et Badge contrat */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <h3 className="text-white text-lg font-black group-hover:text-[#00f098] transition-colors leading-snug line-clamp-2 flex-1">
                        {offre.titre}
                      </h3>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border flex-shrink-0 ${typeColors[offre.typeContrat] || 'bg-white/5 text-gray-300 border-white/10'}`}>
                        {offre.typeContrat}
                      </span>
                    </div>

                    {/* Au centre : Nom du recruteur et Badge statut */}
                    <div className="flex items-center justify-between gap-2 py-3 border-y border-white/5 mb-4">
                      <p className="text-gray-400 text-xs font-medium truncate">
                        Publiée par <span className="text-gray-200 font-bold">{offre.recruteurId?.prenom} {offre.recruteurId?.nom}</span>
                      </p>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
                        offre.statut === 'ouverte'
                          ? 'bg-[#00f098]/10 text-[#00f098] border-[#00f098]/20 shadow-[0_0_10px_rgba(0,240,152,0.15)]'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {offre.statut === 'ouverte' ? 'OUVERTE' : 'FERMÉE'}
                      </span>
                    </div>

                    {/* En dessous : Badges de compétences */}
                    <div className="flex gap-1.5 flex-wrap mb-6">
                      {offre.competences?.slice(0, 3).map((c, i) => (
                        <span key={i} className="text-[11px] bg-white/5 border border-white/5 text-gray-300 px-2.5 py-1 rounded-lg font-medium">
                          {c}
                        </span>
                      ))}
                      {offre.competences?.length > 3 && (
                        <span className="text-[11px] text-gray-500 self-center font-medium">
                          +{offre.competences.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'action Fermer / Rouvrir */}
                  <button
                    onClick={async () => {
                      await api.patch(`/offres/${offre._id}/statut`)
                      chargerDonnees()
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                      offre.statut === 'ouverte'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white'
                        : 'bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)]'
                    }`}
                  >
                    {offre.statut === 'ouverte' ? 'Fermer l\'offre' : 'Rouvrir l\'offre'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 5. VUE UTILISATEURS (CANVAS BLANC HAUT CONTRASTE) ── */}
      {onglet === 'utilisateurs' && (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          
          {/* En-tête calibré */}
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Utilisateurs ({users.length})
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium leading-relaxed">
              Annuaire complet des comptes enregistrés sur la plateforme ATS.
            </p>
          </div>

          {/* Liste des cartes d'utilisateurs */}
          <div className="space-y-3">
            {users.map(u => (
              <div
                key={u._id}
                className="p-4 md:p-5 bg-[#041619] border border-black/5 rounded-2xl flex flex-col gap-4 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Ligne principale du profil utilisateur */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 bg-[#0b1a19] border border-white/5 text-[#00f098] rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0">
                      {u.prenom?.[0]}{u.nom?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-bold tracking-tight truncate">
                        {u.prenom} {u.nom}
                      </p>
                      <p className="text-gray-400 text-xs truncate mt-0.5 font-medium">
                        {u.email}
                      </p>
                      {u.poste && (
                        <p className="text-gray-500 text-[11px] truncate mt-0.5 font-normal">
                          {u.poste}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badge de rôle & Suppression compte */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-lg border ${
                      u.role === 'recruteur' ? 'text-[#00f098] bg-[#00f098]/10 border-[#00f098]/20' :
                      u.role === 'candidat'  ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                                               'text-purple-400 bg-purple-500/10 border-purple-500/20'
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
                        className="p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sous-section : Candidatures associées au candidat avec corbeille de suppression */}
                {u.role === 'candidat' && u.candidatures && u.candidatures.length > 0 && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      Candidatures soumises ({u.candidatures.length}) :
                    </p>
                    <div className="space-y-1.5">
                      {u.candidatures.map(cand => (
                        <div
                          key={cand._id}
                          className="flex items-center justify-between p-2.5 bg-[#0b1a19] border border-white/5 rounded-xl text-xs hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00f098] flex-shrink-0" />
                            <span className="text-white font-bold truncate">
                              {cand.offreId?.titre || cand.titre || 'Poste postulé'}
                            </span>
                            <span className="text-gray-500 text-[11px] hidden sm:inline">
                              • {new Date(cand.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>

                          {/* Bouton corbeille dédié à la suppression de cette candidature */}
                          <button
                            onClick={() => handleSupprimerCandidature(cand._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex-shrink-0"
                            title="Supprimer cette candidature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. VUE SYSTÈME (CONSOLE DE SUPERVISION SOMBRE FDE) ── */}
      {onglet === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: 'Version',         value: '1.0.0',                                        color: 'text-white' },
            { label: 'Stack',           value: 'MERN + IA',                                    color: 'text-[#00f098]' },
            { label: 'Base de données', value: 'MongoDB Atlas',                                color: 'text-[#00f098]' },
            { label: 'Analyse CV',      value: 'API Gemini (Google)',                          color: 'text-[#00f098]' },
            { label: 'Offres actives',  value: offres.filter(o => o.statut === 'ouverte').length, color: 'text-[#00f098]' },
            { label: 'Offres fermées',  value: offres.filter(o => o.statut === 'fermée').length,  color: 'text-red-400' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md hover:border-[#00f098]/30 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-2xl font-black mt-3 tracking-tight ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      </div>
    </Layout>
  )
}