import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { Briefcase, Upload, FileText, CheckCircle, Clock, XCircle, ChevronRight, Search, Trophy, LayoutDashboard } from 'lucide-react'
import Layout from '../components/layout/Layout'
import api from '../services/api'

export default function DashboardCandidat() {
  // eslint-disable-next-line no-unused-vars
  const navigate                        = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const onglet                          = searchParams.get('tab') || ''
  const setOnglet                       = (tab) => setSearchParams({ tab })

  const [offres, setOffres]             = useState([])
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading]           = useState(true)
  const [uploadForm, setUploadForm]     = useState({ offreId: '', diplome: '', experience: 0 })
  const [fichier, setFichier]           = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [message, setMessage]           = useState(null)
  const [search, setSearch]             = useState('')
  const [raisonsOuvertes, setRaisonsOuvertes] = useState({})

  const toggleRaison = (id) => {
    setRaisonsOuvertes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerOffres()
    // eslint-disable-next-line react-hooks/immutability
    chargerCandidatures()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const chargerOffres = async () => {
    try {
      const res = await api.get('/offres')
      setOffres(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const chargerCandidatures = async () => {
    try {
      const res = await api.get('/cv/mes-candidatures')
      setCandidatures(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePostuler = (offreId) => {
    setUploadForm({ ...uploadForm, offreId })
    setOnglet('postuler')
    setMessage(null)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!fichier) return setMessage({ type: 'error', text: '❌ Sélectionne un fichier PDF' })
    setUploading(true)
    setMessage(null)
    try {
      const formData = new FormData()
      formData.append('cv',         fichier)
      formData.append('offreId',    uploadForm.offreId)
      formData.append('diplome',    uploadForm.diplome)
      formData.append('experience', uploadForm.experience)
      const res = await api.post('/cv/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage({ type: 'success', text: `✅ CV analysé ! Score : ${res.data.score}/100` })
      chargerCandidatures()
      setTimeout(() => setOnglet('candidatures'), 1500)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || '❌ Erreur upload' })
    } finally {
      setUploading(false)
    }
  }

  const statutConfig = {
    'en_attente': { label: 'En attente',  icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-900/20 border-amber-700'  },
    'retenu':     { label: 'Retenu ✓',    icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700'  },
    'refusé':     { label: 'Refusé',      icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700'      },
  }

  const scoreColor = (s) => s >= 75 ? 'text-green-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'
  const scoreBar   = (s) => s >= 75 ? 'bg-green-500'  : s >= 50 ? 'bg-amber-500'  : 'bg-red-500'

  const offresFiltrees = offres.filter(o =>
    o.titre.toLowerCase().includes(search.toLowerCase()) ||
    o.competences.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  const typeColors = {
    'Stage':     'bg-blue-900/30 text-blue-400 border-blue-700',
    'CDI':       'bg-green-900/30 text-green-400 border-green-700',
    'CDD':       'bg-amber-900/30 text-amber-400 border-amber-700',
    'Freelance': 'bg-purple-900/30 text-purple-400 border-purple-700',
  }

  const onglets = [
    { key: '',             label: 'Dashboard',        icon: LayoutDashboard, count: null              },
    { key: 'offres',       label: 'Offres',           icon: Briefcase, count: offres.length       },
    { key: 'postuler',     label: 'Postuler',          icon: Upload,    count: null                },
    { key: 'candidatures', label: 'Mes candidatures',  icon: FileText,  count: candidatures.length },
  ]

  return (
    <Layout>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Offres disponibles', value: offres.length,                                              color: 'text-indigo-400' },
          { label: 'Candidatures',        value: candidatures.length,                                       color: 'text-teal-400'   },
          { label: 'Retenus',             value: candidatures.filter(c => c.statut === 'retenu').length,    color: 'text-green-400'  },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
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
                onglet === o.key
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {o.label}
              {o.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  onglet === o.key ? 'bg-indigo-500' : 'bg-gray-700 text-gray-300'
                }`}>
                  {o.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── DASHBOARD (page d'accueil) ── */}
{onglet === '' && (
  <div>
    {/* Bienvenue */}
    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-1">
        Bienvenue sur ATS 👋
      </h2>
      <p className="text-gray-400 text-sm">
        Trouvez votre prochaine opportunité et suivez vos candidatures en temps réel.
      </p>
      <button
        onClick={() => setOnglet('offres')}
        className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
      >
        <Briefcase className="w-4 h-4" />
        Voir les offres disponibles
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Offres disponibles', value: offres.length,                                           color: 'text-indigo-400', bg: 'bg-indigo-900/20 border-indigo-700' },
        { label: 'Mes candidatures',   value: candidatures.length,                                     color: 'text-teal-400',   bg: 'bg-teal-900/20 border-teal-700'     },
        { label: 'Profil retenu',      value: candidatures.filter(c => c.statut === 'retenu').length,  color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700'   },
      ].map((s, i) => (
        <div key={i} className={`bg-gray-900 border rounded-xl p-5 ${s.bg}`}>
          <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-gray-500 text-xs mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-6">

      {/* Dernières candidatures */}
      <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-semibold">Mes dernières candidatures</h3>
          <button
            onClick={() => setOnglet('candidatures')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Voir tout <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {candidatures.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Aucune candidature</p>
            <button
              onClick={() => setOnglet('offres')}
              className="mt-3 text-xs text-indigo-400 hover:underline"
            >
              Parcourir les offres
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {candidatures.slice(0, 3).map(c => {
              const statut = statutConfig[c.statut] || statutConfig['en_attente']
              const SIcon  = statut.icon
              return (
                <div key={c._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-all">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{c.offreId?.titre || 'Offre supprimée'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreBar(c.score)}`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${scoreColor(c.score)}`}>{c.score}/100</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${statut.bg} ${statut.color}`}>
                    <SIcon className="w-3 h-3" />
                    {statut.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="space-y-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Voir les offres',       icon: Briefcase, action: () => setOnglet('offres'),       color: 'text-indigo-400' },
              { label: 'Postuler',              icon: Upload,    action: () => setOnglet('postuler'),     color: 'text-teal-400'   },
              { label: 'Mes candidatures',      icon: FileText,  action: () => setOnglet('candidatures'), color: 'text-amber-400'  },
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

        {/* Offres récentes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Offres récentes</h3>
          <div className="space-y-2">
            {offres.slice(0, 3).map((o, i) => (
              <div
                key={i}
                onClick={() => { setUploadForm({...uploadForm, offreId: o._id}); setOnglet('postuler') }}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                <p className="text-gray-400 text-xs truncate hover:text-white">{o.titre}</p>
              </div>
            ))}
            {offres.length === 0 && (
              <p className="text-gray-600 text-xs">Aucune offre disponible</p>
            )}
          </div>
        </div>
      </div>

    </div>
  </div>
)}

      {/* ── OFFRES ── */}
      {onglet === 'offres' && (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par titre ou compétence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-16">Chargement...</p>
          ) : offresFiltrees.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Aucune offre trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {offresFiltrees.map(offre => (
                <div key={offre._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{offre.titre}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[offre.typeContrat] || ''}`}>
                          {offre.typeContrat}
                        </span>
                        <span className="text-xs text-gray-500">{offre.niveauRequis}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-1">{offre.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {offre.competences.map((c, i) => (
                          <span key={i} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-lg">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePostuler(offre._id)}
                      className="ml-4 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-all flex-shrink-0"
                    >
                      Postuler
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── POSTULER ── */}
      {onglet === 'postuler' && (
        <div className="max-w-lg">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6">Déposer mon CV</h3>

            {message && (
              <div className={`px-4 py-3 rounded-lg mb-4 text-sm border ${
                message.type === 'success'
                  ? 'bg-green-900/20 border-green-700 text-green-400'
                  : 'bg-red-900/20 border-red-700 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Offre ciblée</label>
                <select
                  value={uploadForm.offreId}
                  onChange={e => setUploadForm({...uploadForm, offreId: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner une offre</option>
                  {offres.map(o => <option key={o._id} value={o._id}>{o.titre}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Diplôme</label>
                <input
                  type="text"
                  value={uploadForm.diplome}
                  onChange={e => setUploadForm({...uploadForm, diplome: e.target.value})}
                  placeholder="ex: Licence Informatique"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Années d'expérience</label>
                <input
                  type="number"
                  min="0"
                  value={uploadForm.experience}
                  onChange={e => setUploadForm({...uploadForm, experience: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">CV (PDF · max 5MB)</label>
                <label
                  htmlFor="cv-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
                    fichier
                      ? 'border-indigo-500 bg-indigo-900/10'
                      : 'border-gray-700 hover:border-indigo-600 hover:bg-gray-800/50'
                  }`}
                >
                  <Upload className={`w-8 h-8 mb-2 ${fichier ? 'text-indigo-400' : 'text-gray-600'}`} />
                  <p className={`text-sm ${fichier ? 'text-indigo-400' : 'text-gray-500'}`}>
                    {fichier ? fichier.name : 'Cliquer pour sélectionner un PDF'}
                  </p>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf"
                    onChange={e => setFichier(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Envoyer et analyser
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CANDIDATURES ── */}
      {onglet === 'candidatures' && (
        <div className="space-y-3">
          {candidatures.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Aucune candidature</p>
            </div>
          ) : candidatures.map(c => {
            const statut = statutConfig[c.statut] || statutConfig['en_attente']
            const SIcon  = statut.icon
            const estOuvert = !!raisonsOuvertes[c._id]
            return (
              <div key={c._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{c.offreId?.titre || 'Offre supprimée'}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {c.offreId?.typeContrat} · {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    <p className={`text-gray-400 text-sm mt-2 ${estOuvert ? '' : 'line-clamp-2'}`}>
                      {c.raisons}
                    </p>
                    {c.raisons && c.raisons.length > 100 && (
                      <button
                        onClick={() => toggleRaison(c._id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 font-medium"
                      >
                        {estOuvert ? 'Voir moins' : 'Voir plus'}
                      </button>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreBar(c.score)}`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${scoreColor(c.score)}`}>
                        {c.score}/100
                      </span>
                    </div>
                  </div>
                  <div className={`ml-4 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${statut.bg} ${statut.color} flex-shrink-0`}>
                    <SIcon className="w-3 h-3" />
                    {statut.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </Layout>
  )
}
