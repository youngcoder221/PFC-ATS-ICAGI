/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Briefcase, FileText, CheckCircle, Clock, XCircle, Search, Trophy, Sparkles, X, Upload } from 'lucide-react'
import Layout from '../components/layout/Layout'
import OffreCardCandidat from '../components/OffreCardCandidat'
import api from '../services/api'

export default function DashboardCandidat() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Correction de l'aiguillage par défaut vers 'dashboard'
  const onglet                          = searchParams.get('tab') || 'dashboard'
  const setOnglet                       = (tab) => setSearchParams({ tab })

  const [offres, setOffres]             = useState([])
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading]           = useState(true)
  
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [uploadForm, setUploadForm]     = useState({ offreId: '', diplome: '', experience: 0 })
  const [fichier, setFichier]           = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [message, setMessage]           = useState(null)
  const [search, setSearch]             = useState('')

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerOffres()
    chargerCandidatures()
  }, [])

  // 🚀 ECOUTEUR DE DEEP LINKING (Ouverture auto de la modale)
  useEffect(() => {
    const offreToApply = searchParams.get('postulerOffreId')
    if (offreToApply) {
      // 1. Ouvre la modale et présélectionne l'offre
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUploadForm(prev => ({ ...prev, offreId: offreToApply }))
      setIsModalOpen(true)
      
      // 2. Nettoie l'URL pour ne pas ré-ouvrir la modale au prochain rafraîchissement (F5)
      searchParams.delete('postulerOffreId')
      setSearchParams(searchParams, { replace: true })
    }
    
  }, [searchParams])

  // --- VÉRIFICATION CANDIDATURE UNIQUE & MODALE ---
  const aDejaPostule = (offreId) => {
    return candidatures.some(c => (c.offreId?._id || c.offreId) === offreId)
  }

  const handlePostuler = (offreId) => {
    if (offreId && aDejaPostule(offreId)) return
    setUploadForm({ ...uploadForm, offreId: offreId || '' })
    setIsModalOpen(true)
    setMessage(null)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!fichier) return setMessage({ type: 'error', text: '❌ Sélectionne un fichier PDF' })
    if (!uploadForm.offreId) return setMessage({ type: 'error', text: '❌ Veuillez sélectionner une offre' })
    
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
      
      setMessage({ type: 'success', text: '✅ Candidature envoyée et analysée !' })
      chargerCandidatures()
      
      // Ferme la modale et redirige vers les candidatures après 1.5s
      setTimeout(() => {
        setIsModalOpen(false)
        setFichier(null)
        setOnglet('candidatures')
      }, 1500)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || '❌ Erreur upload' })
    } finally {
      setUploading(false)
    }
  }

  // --- CONFIGURATION STATUTS ---
  const statutConfig = {
    'en_attente': { label: 'En attente',  icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-400/10 border-amber-400/20'  },
    'retenu':     { label: 'Retenu ✓',    icon: CheckCircle,  color: 'text-[#00f098]',  bg: 'bg-[#00f098]/10 border-[#00f098]/20'  },
    'refusé':     { label: 'Refusé',      icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20'      },
  }

  const statutMessage = {
    'en_attente': "Votre candidature est en cours d'examen par le recruteur.",
    'retenu':     "Félicitations ! Votre profil a retenu l'attention du recruteur.",
    'refusé':     "Cette candidature n'a pas été retenue cette fois-ci. Continuez à postuler !",
  }

  const offresFiltrees = offres.filter(o =>
    o.titre?.toLowerCase().includes(search.toLowerCase()) ||
    o.competences?.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Layout>
      {/* ── VUE 1 : DASHBOARD (ACCUEIL HARMONISÉ FDE) ── */}
      {onglet === 'dashboard' && (
        <div className="space-y-6 md:space-y-8">
          
          {/* Header de bienvenue calibré */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Espace Candidat</h1>
              <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium">
                Gérez vos dossiers en temps réel et postulez aux meilleures opportunités du marché.
              </p>
            </div>
          </div>

          {/* 3 Cartes de statistiques (KPIs à typographie dense) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Offres disponibles', value: offres.length, icon: Briefcase, color: 'text-white' },
              { label: 'Mes candidatures',   value: candidatures.length, icon: FileText, color: 'text-white' },
              { label: 'Profil retenu',      value: candidatures.filter(c => c.statut === 'retenu').length, icon: Trophy, color: 'text-[#00f098]' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div 
                  key={i} 
                  className="relative overflow-hidden bg-[#0b1a19] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#041619] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl md:text-4xl font-black ${s.color} tracking-tight`}>{s.value}</p>
                </div>
              )
            })}
          </div>

          {/* Bannière de présentation IA compacte */}
          <div className="relative overflow-hidden bg-[#0b1a19] border border-[#00f098]/20 rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-lg">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f098]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#00f098]/10 border border-[#00f098]/20 rounded-lg px-2.5 py-1 text-[#00f098] text-[10px] font-black uppercase tracking-widest mb-3">
                  <Sparkles className="w-3 h-3" /> Espace Sécurisé
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2.5 tracking-tight leading-tight">
                  Votre carrière, gérée intelligemment
                </h2>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 font-light max-w-xl">
                  Suivez vos dossiers en temps réel et postulez aux opportunités actives. Notre Intelligence Artificielle analyse votre profil pour vous positionner sur les offres les plus pertinentes.
                </p>
                
                <button
                  onClick={() => setOnglet('offres')}
                  className="bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] px-7 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,152,0.2)] cursor-pointer"
                >
                  Découvrir les opportunités
                </button>
              </div>

              {/* Visuel d'illustration scanner IA */}
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="relative w-44 h-52 bg-[#041619] border border-white/10 rounded-2xl p-4 shadow-2xl transform rotate-2">
                  <div className="w-full h-3.5 bg-gray-800 rounded mb-3" />
                  <div className="w-3/4 h-2.5 bg-gray-800 rounded mb-2" />
                  <div className="w-5/6 h-2.5 bg-gray-800 rounded mb-5" />
                  <div className="flex gap-2 mb-3">
                    <div className="w-10 h-3.5 bg-[#00f098]/20 rounded" />
                    <div className="w-12 h-3.5 bg-[#00f098]/20 rounded" />
                  </div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#00f098] shadow-[0_0_10px_#00f098] animate-[ping_3s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </div>
          {/* ── SECTION DOUBLE COLONNE : CALIBRES ÉQUILIBRÉS (70% / 30%) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── 1. COLONNE GAUCHE (70%) : MES DERNIÈRES CANDIDATURES ── */}
            <div className="lg:col-span-2 bg-[#0b1a19] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#00f098]" />
                  <h3 className="text-white font-black text-lg tracking-tight">Mes dernières candidatures</h3>
                </div>
                <button
                  onClick={() => setOnglet('candidatures')}
                  className="text-xs text-gray-300 hover:text-[#00f098] font-bold bg-[#041619] hover:bg-[#072421] border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                >
                  Voir tout &gt;
                </button>
              </div>

              {candidatures.length === 0 ? (
                <div className="text-center py-12 bg-[#041619] rounded-xl border border-white/5">
                  <FileText className="w-8 h-8 text-gray-700 mx-auto mb-2.5" />
                  <p className="text-gray-400 text-xs font-medium">Vous n'avez postulé à aucune offre pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidatures.slice(0, 4).map(c => {
                    const statut = statutConfig[c.statut] || statutConfig['en_attente']
                    const SIcon  = statut.icon
                    return (
                      <div
                        key={c._id}
                        className="p-3.5 bg-[#041619] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#0b1a19] border border-white/5 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-[#00f098] group-hover:border-[#00f098]/30 transition-all">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-bold tracking-tight truncate">
                              {c.offreId?.titre || 'Offre supprimée'}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                              <Clock className="w-3 h-3 text-gray-600" />
                              {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        {/* Badges de statut calibrés */}
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border flex-shrink-0 ${
                          c.statut === 'retenu'
                            ? 'border-[#00f098]/20 text-[#00f098] bg-[#00f098]/10'
                            : c.statut === 'refusé'
                            ? 'border-red-400/20 text-red-400 bg-red-400/10'
                            : 'border-amber-400/20 text-amber-400 bg-amber-400/10'
                        }`}>
                          <SIcon className="w-3 h-3" />
                          <span>{statut.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ── 2. COLONNE DROITE (30%) : ACTIONS RAPIDES & AJOUTÉ RÉCEMMENT ── */}
            <div className="space-y-6">

              {/* Bloc Actions rapides */}
              <div className="bg-[#0b1a19] border border-white/5 rounded-2xl p-6 shadow-md">
                <h3 className="text-white font-black text-lg tracking-tight mb-4">Actions rapides</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Voir les offres',        icon: Briefcase, action: () => setOnglet('offres') },
                    { label: 'Nouvelle candidature',   icon: Upload,    action: () => handlePostuler('') },
                    { label: 'Mes candidatures',       icon: FileText,  action: () => setOnglet('candidatures') },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <button
                        key={i}
                        onClick={a.action}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-gray-300 bg-[#041619] border border-white/5 hover:border-[#00f098]/30 hover:text-[#00f098] transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0b1a19] border border-white/5 group-hover:border-[#00f098]/30 text-gray-400 group-hover:text-[#00f098] transition-all flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bloc Ajouté récemment */}
              <div className="bg-[#0b1a19] border border-white/5 rounded-2xl p-6 shadow-md">
                <h3 className="text-white font-black text-lg tracking-tight mb-4">Ajouté récemment</h3>
                {offres.length === 0 ? (
                  <p className="text-gray-500 text-xs">Aucune offre récente.</p>
                ) : (
                  <div className="space-y-3">
                    {offres.slice(0, 3).map(offre => (
                      <div
                        key={offre._id}
                        onClick={() => setOnglet('offres')}
                        className="flex items-center gap-2.5 cursor-pointer group p-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f098] shadow-[0_0_6px_#00f098] flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-300 text-xs font-bold group-hover:text-[#00f098] transition-colors truncate">
                          {offre.titre} <span className="text-gray-500 font-normal">{offre.typeContrat ? `(${offre.typeContrat})` : ''}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ── VUE 2 : OPPORTUNITÉS ACTIVES (CANVAS BLANC HAUT CONTRASTE) ── */}
      {onglet === 'offres' && (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          
          {/* En-tête typographique calibré */}
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Opportunités actives
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium leading-relaxed">
              Découvrez les offres disponibles et candidatez instantanément grâce à notre moteur IA.
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, compétences (ex: React, Python)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3.5 text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:border-[#00f098] focus:ring-1 focus:ring-[#00f098] transition-all shadow-inner"
            />
          </div>

          {/* Grille des cartes d'offres sombres */}
          {loading ? (
            <p className="text-center text-gray-400 py-16 font-medium text-xs">Chargement des opportunités...</p>
          ) : offresFiltrees.length === 0 ? (
            <div className="text-center py-16 bg-[#f8fafc] rounded-2xl border border-gray-100">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
              <p className="text-gray-500 font-medium text-xs">Aucune offre ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {offresFiltrees.map(offre => {
                const dejaPostule = aDejaPostule(offre._id)

                return (
                  <div
                    key={offre._id}
                    className="bg-[#0b1a19] border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                  >
                    <div>
                      {/* En-tête : Icône et Date */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#041619] border border-white/5 flex items-center justify-center flex-shrink-0 text-[#00f098] group-hover:scale-105 transition-transform">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium bg-[#041619] border border-white/5 px-2.5 py-1 rounded-lg">
                          {offre.createdAt ? new Date(offre.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
                        </span>
                      </div>

                      {/* Titre & Entreprise */}
                      <h3 className="text-white font-black text-lg group-hover:text-[#00f098] transition-colors leading-snug mb-1 line-clamp-2">
                        {offre.titre}
                      </h3>
                      <p className="text-gray-400 text-xs font-medium mb-3.5 truncate">
                        {offre.entreprise || offre.departement || 'Entreprise partenaire'}
                      </p>

                      {/* Badges d'informations */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {(offre.lieu || offre.localisation) && (
                          <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                            {offre.lieu || offre.localisation}
                          </span>
                        )}
                        {offre.typeContrat && (
                          <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                            {offre.typeContrat}
                          </span>
                        )}
                        {(offre.diplome || offre.niveauEtude) && (
                          <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                            {offre.diplome || offre.niveauEtude}
                          </span>
                        )}
                      </div>

                      {/* Puces de compétences */}
                      {offre.competences && offre.competences.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {offre.competences.slice(0, 3).map((comp, idx) => (
                            <span key={idx} className="bg-white/5 text-gray-400 text-[11px] px-2 py-0.5 rounded-md font-medium">
                              {comp}
                            </span>
                          ))}
                          {offre.competences.length > 3 && (
                            <span className="text-gray-500 text-[10px] self-center">
                              +{offre.competences.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bouton d'action */}
                    <button
                      onClick={() => !dejaPostule && handlePostuler(offre._id)}
                      disabled={dejaPostule}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        dejaPostule
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5 shadow-none'
                          : 'bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)]'
                      }`}
                    >
                      {dejaPostule ? 'Déjà postulé ✓' : 'Postuler >'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── VUE 3 : MES CANDIDATURES (CANVAS BLANC HAUT CONTRASTE) ── */}
      {onglet === 'candidatures' && (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          
          {/* En-tête typographique calibré */}
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Mes candidatures
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium leading-relaxed">
              Suivez l'état d'avancement et les retours des recruteurs sur vos dossiers.
            </p>
          </div>

          {candidatures.length === 0 ? (
            <div className="text-center py-16 bg-[#f8fafc] rounded-2xl border border-gray-100">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
              <p className="text-gray-500 font-medium text-xs">Vous n'avez soumis aucune candidature pour le moment.</p>
            </div>
          ) : (
            /* Grille de cartes verticales sombres */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatures.map(c => {
                const statut = statutConfig[c.statut] || statutConfig['en_attente']
                const SIcon  = statut.icon
                return (
                  <div
                    key={c._id}
                    className="bg-[#0b1a19] border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                  >
                    <div>
                      {/* En-tête : Icône et Date */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#041619] border border-white/5 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-[#00f098] transition-colors">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Titre & Entreprise */}
                      <h3 className="text-white font-black text-lg leading-snug mb-1 group-hover:text-[#00f098] transition-colors line-clamp-2">
                        {c.offreId?.titre || 'Offre supprimée'}
                      </h3>
                      <p className="text-gray-400 text-xs font-medium mb-3.5 truncate">
                        {c.offreId?.entreprise || c.offreId?.typeContrat || 'Entreprise partenaire'}
                      </p>

                      {/* Message de statut contextuel */}
                      <div className="bg-[#041619] border border-white/5 p-3 rounded-xl mb-5">
                        <p className="text-gray-300 text-xs leading-relaxed font-normal">
                          {statutMessage[c.statut] || statutMessage['en_attente']}
                        </p>
                      </div>
                    </div>

                    {/* Badge de statut fermant la carte */}
                    <div className={`w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider py-2.5 rounded-xl border ${statut.bg} ${statut.color}`}>
                      <SIcon className="w-3.5 h-3.5" />
                      <span>{statut.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MODALE DE POSTULATION (IA GEMINI) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041619]/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-[#0b1a19] border border-[#00f098]/30 rounded-[2rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-500 hover:text-[#00f098] transition-colors bg-[#041619] p-2 rounded-full border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f098]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 bg-[#00f098]/10 border border-[#00f098]/20 rounded-lg px-3 py-1.5 text-[#00f098] text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles className="w-3 h-3" /> Parsing API Gemini
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                  Soumettre ma candidature
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Téléversez votre CV en PDF. Notre Intelligence Artificielle extraira vos compétences clés pour évaluer votre profil instantanément.
                </p>

                {message && (
                  <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 border ${
                    message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}
                
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="mb-4">
                    <select
                      value={uploadForm.offreId}
                      onChange={e => setUploadForm({...uploadForm, offreId: e.target.value})}
                      required
                      className="w-full bg-[#041619] border border-white/10 text-white font-bold rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#00f098] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-gray-500">Sélectionnez l'offre visée...</option>
                      {offres.map(o => <option key={o._id} value={o._id}>{o.titre} ({o.typeContrat})</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full flex-1 flex items-center justify-between bg-[#041619] border border-white/10 hover:border-[#00f098]/50 px-4 py-3 rounded-xl cursor-pointer transition-all group">
                      <span className={`text-sm font-bold truncate ${fichier ? 'text-[#00f098]' : 'text-gray-400 group-hover:text-white'}`}>
                        {fichier ? fichier.name : 'Sélectionner mon CV (PDF)...'}
                      </span>
                      <FileText className={`w-5 h-5 ${fichier ? 'text-[#00f098]' : 'text-gray-600 group-hover:text-[#00f098]'}`} />
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFichier(e.target.files[0])} />
                    </label>
                    <button 
                      type="submit"
                      disabled={!fichier || uploading}
                      className="w-full sm:w-auto bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,240,152,0.2)] flex justify-center items-center gap-2"
                    >
                      {uploading ? (
                        <><span className="w-4 h-4 border-2 border-[#0b1a19]/30 border-t-[#0b1a19] rounded-full animate-spin" /> Analyse...</>
                      ) : 'Postuler'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="relative w-48 h-56 bg-[#041619] border border-white/10 rounded-2xl p-4 shadow-2xl transform rotate-3">
                  <div className="w-full h-4 bg-gray-800 rounded mb-4" />
                  <div className="w-3/4 h-3 bg-gray-800 rounded mb-2" />
                  <div className="w-5/6 h-3 bg-gray-800 rounded mb-6" />
                  <div className="flex gap-2 mb-4">
                    <div className="w-10 h-4 bg-[#00f098]/20 rounded" />
                    <div className="w-12 h-4 bg-[#00f098]/20 rounded" />
                  </div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#00f098] shadow-[0_0_10px_#00f098] animate-[ping_3s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}