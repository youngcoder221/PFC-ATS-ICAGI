import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { Briefcase, Upload, FileText, CheckCircle, Clock, XCircle, ChevronRight, Search, Trophy, LayoutDashboard } from 'lucide-react'
import Layout from '../components/layout/Layout'
import OffreCardCandidat from '../components/OffreCardCandidat'
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
      await api.post('/cv/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage({ type: 'success', text: '✅ Candidature envoyée ! Le recruteur examinera votre profil.' })
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

  // Note : le score et l'explication détaillée de l'IA sont des outils internes
  // réservés au recruteur (voir Ranking.jsx). Le candidat ne voit qu'un message
  // de statut clair, jamais le score chiffré ni le détail de l'analyse.
  const statutMessage = {
    'en_attente': "Votre candidature est en cours d'examen par le recruteur.",
    'retenu':     "Félicitations ! Votre profil a retenu l'attention du recruteur.",
    'refusé':     "Cette candidature n'a pas été retenue cette fois-ci. Continuez à postuler !",
  }

  const offresFiltrees = offres.filter(o =>
    o.titre.toLowerCase().includes(search.toLowerCase()) ||
    o.competences.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )



  const onglets = [
    { key: '',             label: 'Dashboard',        icon: LayoutDashboard, count: null              },
    { key: 'offres',       label: 'Offres',           icon: Briefcase, count: offres.length       },
    { key: 'postuler',     label: 'Postuler',          icon: Upload,    count: null                },
    { key: 'candidatures', label: 'Mes candidatures',  icon: FileText,  count: candidatures.length },
  ]

  return (
    <Layout>

      {/* Header & Stats rapides */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Espace Candidat</h1>
          <p className="text-gray-400 text-sm mt-1">Gérez vos candidatures et trouvez votre prochaine opportunité.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Offres disponibles', value: offres.length, icon: Briefcase, color: 'text-indigo-400' },
          { label: 'Mes candidatures',   value: candidatures.length, icon: FileText, color: 'text-teal-400'   },
          { label: 'Profil retenu',      value: candidatures.filter(c => c.statut === 'retenu').length, icon: Trophy, color: 'text-green-400'  },
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

      {/* Onglets */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-gray-900/50 backdrop-blur-md border border-gray-800 p-1.5 rounded-2xl w-fit mb-8 shadow-sm">
        {onglets.map(o => {
          const Icon = o.icon
          const isActive = onglet === o.key
          return (
            <button
              key={o.key}
              onClick={() => setOnglet(o.key)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700/50' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
              {o.label}
              {o.count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
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
        <div className="space-y-6">
          
          {/* Bienvenue */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-gray-900 border border-indigo-700/30 rounded-3xl p-8 md:p-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Trouvez votre prochaine opportunité 🚀
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-6">
                Votre espace est prêt. Découvrez les offres correspondant à vos compétences, soumettez votre CV et suivez l'évolution de vos candidatures grâce à notre système d'analyse.
              </p>
              <button
                onClick={() => setOnglet('offres')}
                className="flex items-center gap-2 bg-white text-gray-950 hover:bg-indigo-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] w-fit"
              >
                <Briefcase className="w-4 h-4" />
                Explorer les offres
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Dernières candidatures */}
            <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Mes dernières candidatures
                </h3>
                <button
                  onClick={() => setOnglet('candidatures')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {candidatures.length === 0 ? (
                <div className="text-center py-10 bg-gray-950/50 rounded-2xl border border-gray-800/50">
                  <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Vous n'avez postulé à aucune offre pour le moment.</p>
                  <button
                    onClick={() => setOnglet('offres')}
                    className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    Parcourir les offres
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {candidatures.slice(0, 4).map(c => {
                    const statut = statutConfig[c.statut] || statutConfig['en_attente']
                    const SIcon  = statut.icon
                    return (
                      <div key={c._id} className="p-4 bg-gray-950/50 border border-gray-800/80 rounded-2xl flex items-center justify-between hover:bg-gray-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/50 transition-colors">
                            <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{c.offreId?.titre || 'Offre supprimée'}</p>
                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border ${statut.bg} ${statut.color}`}>
                          <SIcon className="w-3.5 h-3.5" />
                          {statut.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Actions rapides & Offres récentes */}
            <div className="space-y-6">
              
              {/* Actions rapides */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors duration-300">
                <h3 className="text-white font-semibold text-lg mb-5">Actions rapides</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Voir les offres',       icon: Briefcase, action: () => setOnglet('offres'),       color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Nouvelle candidature',  icon: Upload,    action: () => setOnglet('postuler'),     color: 'text-teal-400',   bg: 'bg-teal-500/10'   },
                    { label: 'Mes candidatures',      icon: FileText,  action: () => setOnglet('candidatures'), color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <button
                        key={i}
                        onClick={a.action}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl text-sm text-gray-300 bg-gray-950/50 border border-gray-800 hover:border-gray-600 hover:bg-gray-800/80 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}>
                          <Icon className={`w-4 h-4 ${a.color}`} />
                        </div>
                        <span className="font-medium group-hover:text-white transition-colors">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Offres récentes */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors duration-300">
                <h3 className="text-white font-semibold text-lg mb-5">Ajouté récemment</h3>
                <div className="space-y-3">
                  {offres.slice(0, 3).map((o, i) => (
                    <div
                      key={i}
                      onClick={() => { setUploadForm({...uploadForm, offreId: o._id}); setOnglet('postuler') }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                      <p className="text-gray-400 text-sm truncate font-medium group-hover:text-white transition-colors">{o.titre}</p>
                    </div>
                  ))}
                  {offres.length === 0 && (
                    <p className="text-gray-600 text-sm">Aucune offre disponible</p>
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

          {/* Remplacement dans la section ── OFFRES ── */}
            {loading ? (
              <p className="text-center text-gray-500 py-16">Chargement...</p>
            ) : offresFiltrees.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">Aucune offre trouvée</p>
              </div>
            ) : (
              /* ✨ Voici la nouvelle grille responsive */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {offresFiltrees.map(offre => (
                  <OffreCardCandidat 
                    key={offre._id} 
                    offre={offre} 
                    onPostuler={handlePostuler} 
                  />
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
            return (
              <div key={c._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{c.offreId?.titre || 'Offre supprimée'}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {c.offreId?.typeContrat} · {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-gray-400 text-sm mt-2 italic">
                      {statutMessage[c.statut] || statutMessage['en_attente']}
                    </p>
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
