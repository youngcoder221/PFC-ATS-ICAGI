import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, X, Briefcase, Users, ChevronRight, Clock, TrendingUp, XCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import api from '../services/api'

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

  const typeColors = {
    'Stage':     'bg-blue-900/30 text-blue-400 border-blue-700',
    'CDI':       'bg-green-900/30 text-green-400 border-green-700',
    'CDD':       'bg-amber-900/30 text-amber-400 border-amber-700',
    'Freelance': 'bg-purple-900/30 text-purple-400 border-purple-700',
  }

  const offresOuvertes  = offres.filter(o => o.statut === 'ouverte').length
  const offresFermees   = offres.filter(o => o.statut === 'fermée').length
  const dernieresOffres = offres.slice(0, 3)

  // ── Formulaire partagé ──
  const FormulaireOffre = () => (
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

  return (
    <Layout>

      {/* ══ VUE : MES OFFRES ══ */}
      {tabActif === 'offres' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Mes offres</h1>
              <p className="text-gray-400 text-sm mt-1">{offres.length} offre(s) publiée(s)</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Nouvelle offre'}
            </button>
          </div>

          {showForm && <FormulaireOffre />}

          {loading ? (
            <div className="text-center py-16 text-gray-500">Chargement...</div>
          ) : offres.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Aucune offre publiée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {offres.map(offre => (
                <div key={offre._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{offre.titre}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[offre.typeContrat] || ''}`}>
                          {offre.typeContrat}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          offre.statut === 'ouverte' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {offre.statut}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-1">{offre.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {offre.competences.map((comp, i) => (
                          <span key={i} className="text-xs bg-gray-800 text-gray-300 border border-gray-700 px-2.5 py-1 rounded-lg">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/ranking/${offre._id}`)}
                      className="ml-4 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-all flex-shrink-0"
                    >
                      Voir candidats <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ VUE : DASHBOARD (défaut) ══ */}
      {tabActif === '' && (
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
              <p className="text-gray-400 text-sm mt-1">Gérez vos offres et suivez vos candidats</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Nouvelle offre'}
            </button>
          </div>

          {showForm && <FormulaireOffre />}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total offres',   value: offres.length,  icon: Briefcase,  color: 'text-indigo-400', bg: 'bg-indigo-900/20 border-indigo-700' },
              { label: 'Offres actives', value: offresOuvertes, icon: TrendingUp, color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700'   },
              { label: 'Offres fermées', value: offresFermees,  icon: XCircle,    color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700'       },
              { label: 'Types de contrats', value: [...new Set(offres.map(o => o.typeContrat))].length,            icon: Clock,      color: 'text-amber-400',  bg: 'bg-amber-900/20 border-amber-700'   },
            ].map((s, i) => {
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

          <div className="grid grid-cols-3 gap-6">

            {/* Dernières offres */}
            <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-white font-semibold">Dernières offres</h2>
                <button
                  onClick={() => navigate('/recruteur?tab=offres')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-12">Chargement...</p>
              ) : dernieresOffres.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Aucune offre publiée</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 text-xs text-indigo-400 hover:underline"
                  >
                    Créer ma première offre
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {dernieresOffres.map(offre => (
                    <div key={offre._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white text-sm font-medium">{offre.titre}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[offre.typeContrat] || ''}`}>
                            {offre.typeContrat}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {offre.competences.slice(0, 3).map((c, i) => (
                            <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/ranking/${offre._id}`)}
                        className="ml-4 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-all flex-shrink-0"
                      >
                        Candidats <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">

              {/* Actions rapides */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Publier une offre',  icon: Plus,      action: () => setShowForm(true),                color: 'text-indigo-400' },
                    { label: 'Voir mes offres',    icon: Briefcase, action: () => navigate('/recruteur?tab=offres'), color: 'text-teal-400'   },
                    { label: 'Voir les candidats', icon: Users,     action: () => navigate('/recruteur?tab=offres'), color: 'text-amber-400'  },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <button
                        key={i}
                        onClick={a.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                      >
                        <Icon className={`w-4 h-4 ${a.color}`} />
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {offres.slice(0, 4).map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      <p className="text-gray-400 text-xs truncate">
                        Offre <span className="text-white">"{o.titre}"</span> publiée
                      </p>
                    </div>
                  ))}
                  {offres.length === 0 && (
                    <p className="text-gray-600 text-xs">Aucune activité récente</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}