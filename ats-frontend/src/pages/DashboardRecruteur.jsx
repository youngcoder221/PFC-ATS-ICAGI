import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, X, Briefcase, Users, ChevronRight, Clock, TrendingUp, XCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import api from '../services/api'
import OffreCardRecruteur from '../components/OffreCardRecruteur'

// ── Formulaire d'offre harmonisé FDE ──
function FormulaireOffre({ form, setForm, handleSubmit }) {
  return (
    <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 mb-6 shadow-xl">
      <h3 className="text-white font-bold text-lg mb-4">Créer une nouvelle offre</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Titre du poste</label>
            <input
              type="text" value={form.titre}
              onChange={e => setForm({...form, titre: e.target.value})}
              placeholder="ex: Développeur Full Stack JS" required
              className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-colors"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3} placeholder="Décrivez le poste..." required
              className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-colors resize-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Compétences <span className="text-gray-500 text-[11px] font-normal">(séparées par des virgules)</span>
            </label>
            <input
              type="text" value={form.competences}
              onChange={e => setForm({...form, competences: e.target.value})}
              placeholder="React, Node.js, MongoDB, Express" required
              className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Niveau requis</label>
            <select
              value={form.niveauRequis}
              onChange={e => setForm({...form, niveauRequis: e.target.value})}
              className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f098] transition-colors cursor-pointer"
            >
              {['Licence', 'Master', 'Ingénieur', 'Doctorat'].map(n => <option key={n} value={n} className="bg-[#0b1a19]">{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Type de contrat</label>
            <select
              value={form.typeContrat}
              onChange={e => setForm({...form, typeContrat: e.target.value})}
              className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f098] transition-colors cursor-pointer"
            >
              {['Stage', 'CDD', 'CDI', 'Freelance'].map(t => <option key={t} value={t} className="bg-[#0b1a19]">{t}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#00f098] hover:bg-[#00d084] text-[#0b1a19] py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,152,0.2)] mt-2"
        >
          Publier l'offre
        </button>
      </form>
    </div>
  )
}

export default function DashboardRecruteur() {
  const navigate                = useNavigate()
  const [searchParams]          = useSearchParams()
  const tabActif                = searchParams.get('tab') || ''
  const [offres, setOffres]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({
    titre: '', description: '',
    competences: '', niveauRequis: 'Licence', typeContrat: 'Stage'
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerOffres()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const chargerOffres = async () => {
    try {
      const res = await api.get('/offres/mes/offres')
      setOffres(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/offres', {
        ...form,
        competences: form.competences.split(',').map(c => c.trim())
      })
      setShowForm(false)
      setForm({ titre: '', description: '', competences: '', niveauRequis: 'Licence', typeContrat: 'Stage' })
      chargerOffres()
    } catch (err) {
      console.error(err)
    }
  }

  const offresOuvertes  = offres.filter(o => o.statut === 'ouverte').length
  const offresFermees   = offres.filter(o => o.statut === 'fermée').length
  const dernieresOffres = offres.slice(0, 3)

  return (
    <Layout>

      {/* ══ VUE : MES OFFRES (HARMONISÉE FDE) ══ */}
      {tabActif === 'offres' && (
        <div className="space-y-8 bg-[#0b1a19] p-6 md:p-8 rounded-[2rem] border border-white/5">
          
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Mes offres</h1>
              <p className="text-gray-400 text-sm mt-1">{offres.length} offre(s) publiée(s) sur la plateforme</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                showForm 
                  ? 'bg-[#041619] text-white border border-white/10 hover:bg-white/5' 
                  : 'bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)]'
              }`}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler la création' : 'Publier une offre'}
            </button>
          </div>

          {showForm && (
            <FormulaireOffre
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
            />
          )}

          {loading ? (
            <div className="text-center py-16 text-gray-500 font-medium">Chargement des offres...</div>
          ) : offres.length === 0 ? (
            <div className="text-center py-16 bg-[#041619] rounded-2xl border border-white/5">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucune offre publiée pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {offres.map(offre => (
                <OffreCardRecruteur 
                  key={offre._id} 
                  offre={offre} 
                  onToggleStatut={async (id) => {
                    await api.patch(`/offres/${id}/statut`)
                    chargerOffres()
                  }}
                  onVoirCandidats={(id) => navigate(`/ranking/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ VUE : DASHBOARD (défaut) ══ */}
      {tabActif === '' && (
        <div className="space-y-8 bg-[#0b1a19] p-6 md:p-8 rounded-[2rem] border border-white/5">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Tableau de bord Recruteur</h1>
              <p className="text-gray-400 text-sm mt-1">Gérez vos offres et découvrez vos futurs talents grâce à l'IA.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                showForm 
                  ? 'bg-[#041619] text-white border border-white/10 hover:bg-white/5' 
                  : 'bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)]'
              }`}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler la création' : 'Publier une offre'}
            </button>
          </div>

          {showForm && (
            <FormulaireOffre
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
            />
          )}

          {/* Stats KPIs (Cartes relief #041619 et icônes vert menthe / blanc) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              { label: 'Total offres',      value: offres.length,                                        icon: Briefcase,  color: 'text-white'     },
              { label: 'Offres actives',    value: offresOuvertes,                                       icon: TrendingUp, color: 'text-[#00f098]' },
              { label: 'Offres fermées',    value: offresFermees,                                        icon: XCircle,    color: 'text-white'     },
              { label: 'Types contrats',    value: [...new Set(offres.map(o => o.typeContrat))].length,  icon: Clock,      color: 'text-[#00f098]' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div 
                  key={i} 
                  className="relative overflow-hidden bg-[#041619] border border-white/5 rounded-2xl p-5 hover:border-[#00f098]/30 hover:-translate-y-1 transition-all duration-300 group"
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

          {/* [SUITE INCHANGÉE : La grille en double colonne "Dernières offres" et "Actions rapides" continue ici] */}

          {/* ── DOUBLE COLONNE HARMONISÉE FDE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Dernières offres (Harmonisées FDE) */}
            <div className="lg:col-span-2 bg-[#041619] border border-white/5 rounded-[2rem] p-7 hover:border-white/10 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#00f098]" />
                  Dernières offres publiées
                </h2>
                <button
                  onClick={() => navigate('/recruteur?tab=offres')}
                  className="text-xs text-gray-300 hover:text-[#00f098] font-medium bg-[#0b1a19] hover:bg-white/5 border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-12 font-medium">Chargement...</p>
              ) : dernieresOffres.length === 0 ? (
                <div className="text-center py-12 bg-[#0b1a19] rounded-2xl border border-white/5">
                  <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">Aucune offre publiée pour le moment.</p>
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="mt-4 text-xs bg-[#00f098] text-[#0b1a19] font-black px-4 py-2 rounded-xl hover:bg-[#00d084] transition-all"
                  >
                    Créer ma première offre
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dernieresOffres.map(offre => (
                    <OffreCardRecruteur 
                      key={offre._id} 
                      offre={offre} 
                      onToggleStatut={async (id) => {
                        await api.patch(`/offres/${id}/statut`)
                        chargerOffres()
                      }}
                      onVoirCandidats={(id) => navigate(`/ranking/${id}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite (30%) : Actions rapides & Activité */}
            <div className="space-y-6">
              
              {/* Actions rapides */}
              <div className="bg-[#041619] border border-white/5 rounded-[2rem] p-7 hover:border-white/10 transition-colors duration-300">
                <h3 className="text-white font-bold text-lg mb-5">Actions rapides</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Publier une offre',  icon: Plus,      action: () => setShowForm(true) },
                    { label: 'Voir mes offres',    icon: Briefcase, action: () => navigate('/recruteur?tab=offres') },
                    { label: 'Voir les candidats', icon: Users,     action: () => navigate('/recruteur?tab=offres') },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <button 
                        key={i} 
                        onClick={a.action} 
                        className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-sm text-gray-300 bg-[#0b1a19] border border-white/5 hover:border-[#00f098]/30 hover:text-[#00f098] transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#041619] border border-white/5 group-hover:border-[#00f098]/30 text-gray-400 group-hover:text-[#00f098] transition-all">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-xs text-white group-hover:text-[#00f098] transition-colors">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-[#041619] border border-white/5 rounded-[2rem] p-7 hover:border-white/10 transition-colors duration-300">
                <h3 className="text-white font-bold text-lg mb-5">Activité récente</h3>
                <div className="space-y-3.5">
                  {offres.slice(0, 4).map((o, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#00f098] shadow-[0_0_8px_#00f098] flex-shrink-0" />
                      <p className="text-gray-400 text-xs truncate">
                        Offre <span className="text-white font-semibold">"{o.titre}"</span> publiée
                      </p>
                    </div>
                  ))}
                  {offres.length === 0 && <p className="text-gray-500 text-xs">Aucune activité récente</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}