import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, X, Briefcase, Users, ChevronRight, Clock, TrendingUp, XCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import api from '../services/api'
import OffreCardRecruteur from '../components/OffreCardRecruteur'

// ── Formulaire en dehors du composant ──
function FormulaireOffre({ form, setForm, handleSubmit }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <h3 className="text-white font-semibold mb-4">Créer une nouvelle offre</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Titre du poste</label>
            <input
              type="text" value={form.titre}
              onChange={e => setForm({...form, titre: e.target.value})}
              placeholder="ex: Développeur Full Stack JS" required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3} placeholder="Décrivez le poste..." required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Compétences <span className="text-gray-600">(séparées par des virgules)</span>
            </label>
            <input
              type="text" value={form.competences}
              onChange={e => setForm({...form, competences: e.target.value})}
              placeholder="React, Node.js, MongoDB, Express" required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Niveau requis</label>
            <select
              value={form.niveauRequis}
              onChange={e => setForm({...form, niveauRequis: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['Licence', 'Master', 'Ingénieur', 'Doctorat'].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Type de contrat</label>
            <select
              value={form.typeContrat}
              onChange={e => setForm({...form, typeContrat: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['Stage', 'CDD', 'CDI', 'Freelance'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all"
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

      {/* ══ VUE : MES OFFRES ══ */}
      {tabActif === 'offres' && (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Mes offres</h1>
              <p className="text-gray-400 text-sm mt-1">{offres.length} offre(s) publiée(s) sur la plateforme</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg ${
                showForm 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-950 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]'
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
            <div className="text-center py-16 text-gray-500">Chargement...</div>
          ) : offres.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Aucune offre publiée</p>
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
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord Recruteur</h1>
              <p className="text-gray-400 text-sm mt-1">Gérez vos offres et découvrez vos futurs talents grâce à l'IA.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg ${
                showForm 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-950 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]'
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              { label: 'Total offres',      value: offres.length,                                        icon: Briefcase,  color: 'text-indigo-400' },
              { label: 'Offres actives',    value: offresOuvertes,                                       icon: TrendingUp, color: 'text-green-400'  },
              { label: 'Offres fermées',    value: offresFermees,                                        icon: XCircle,    color: 'text-red-400'    },
              { label: 'Types contrats',    value: [...new Set(offres.map(o => o.typeContrat))].length,  icon: Clock,      color: 'text-amber-400'  },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-all duration-500 pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm font-medium">{s.label}</p>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-950 border border-gray-800 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold text-white tracking-tight`}>{s.value}</p>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Dernières offres */}
            <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  Dernières offres publiées
                </h2>
                <button
                  onClick={() => navigate('/recruteur?tab=offres')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-12">Chargement...</p>
              ) : dernieresOffres.length === 0 ? (
                <div className="text-center py-10 bg-gray-950/50 rounded-2xl border border-gray-800/50">
                  <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Aucune offre publiée pour le moment.</p>
                  <button onClick={() => setShowForm(true)} className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-4 py-2 rounded-lg transition-colors">
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

            {/* Actions rapides & Activité */}
            <div className="space-y-6">
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors duration-300">
                <h3 className="text-white font-semibold text-lg mb-5">Actions rapides</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Publier une offre',  icon: Plus,      action: () => setShowForm(true),                color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Voir mes offres',    icon: Briefcase, action: () => navigate('/recruteur?tab=offres'), color: 'text-teal-400',   bg: 'bg-teal-500/10'   },
                    { label: 'Voir les candidats', icon: Users,     action: () => navigate('/recruteur?tab=offres'), color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <button key={i} onClick={a.action} className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm text-gray-300 bg-gray-950/50 border border-gray-800 hover:border-gray-600 hover:bg-gray-800/80 transition-all group">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}>
                          <Icon className={`w-4 h-4 ${a.color}`} />
                        </div>
                        <span className="font-medium group-hover:text-white transition-colors">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors duration-300">
                <h3 className="text-white font-semibold text-lg mb-5">Activité récente</h3>
                <div className="space-y-3">
                  {offres.slice(0, 4).map((o, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-800/40 rounded-xl transition-colors cursor-default group">
                      <div className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-150 transition-transform flex-shrink-0" />
                      <p className="text-gray-400 text-sm truncate">
                        Offre <span className="text-white font-medium">"{o.titre}"</span> publiée
                      </p>
                    </div>
                  ))}
                  {offres.length === 0 && <p className="text-gray-600 text-sm p-2">Aucune activité récente</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}