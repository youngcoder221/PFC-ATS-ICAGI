/* eslint-disable react-hooks/immutability */
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Upload, FileText, CheckCircle, Clock, XCircle, ChevronRight, Search } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import api from '../services/api'

export default function DashboardCandidat() {
  // eslint-disable-next-line no-unused-vars
  const navigate                        = useNavigate()
  const [offres, setOffres]             = useState([])
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading]           = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
const onglet = searchParams.get('tab') || 'offres'
const setOnglet = (tab) => setSearchParams({ tab })
  const [uploadForm, setUploadForm]     = useState({ offreId: '', diplome: '', experience: 0 })
  const [fichier, setFichier]           = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [message, setMessage]           = useState(null)
  const [search, setSearch]             = useState('')

  useEffect(() => {
    chargerOffres()
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
    'en_attente': { label: 'En attente',  icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-900/20 border-amber-700' },
    'retenu':     { label: 'Retenu ✓',    icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700' },
    'refusé':     { label: 'Refusé',      icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700' },
  }

  const scoreColor = (s) => s >= 75 ? 'text-green-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'
  const scoreBar   = (s) => s >= 75 ? 'bg-green-500' : s >= 50 ? 'bg-amber-500' : 'bg-red-500'

  const offresFiltrees = offres.filter(o =>
    o.titre.toLowerCase().includes(search.toLowerCase()) ||
    o.competences.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  const typeColors = {
    'Stage': 'bg-blue-900/30 text-blue-400 border-blue-700',
    'CDI':   'bg-green-900/30 text-green-400 border-green-700',
    'CDD':   'bg-amber-900/30 text-amber-400 border-amber-700',
    'Freelance': 'bg-purple-900/30 text-purple-400 border-purple-700',
  }

  const onglets = [
    { key: 'offres',        label: 'Offres',          icon: Briefcase, count: offres.length },
    { key: 'postuler',      label: 'Postuler',         icon: Upload,    count: null },
    { key: 'candidatures',  label: 'Mes candidatures', icon: FileText,  count: candidatures.length },
  ]

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Espace Candidat</h1>
          <p className="text-gray-400 text-sm mt-1">Trouvez votre prochaine opportunité</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Offres disponibles', value: offres.length,        color: 'text-indigo-400' },
            { label: 'Candidatures',        value: candidatures.length,  color: 'text-teal-400'   },
            { label: 'Retenus',             value: candidatures.filter(c => c.statut === 'retenu').length, color: 'text-green-400' },
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
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${onglet === o.key ? 'bg-indigo-500' : 'bg-gray-700 text-gray-300'}`}>
                    {o.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── OFFRES ── */}
        {onglet === 'offres' && (
          <div>
            {/* Recherche */}
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

                {/* Zone upload */}
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
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{c.raisons}</p>

                      {/* Barre de score */}
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
      </main>
    </div>
  )
}