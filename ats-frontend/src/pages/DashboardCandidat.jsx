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

  // --- GESTION DE LA MODALE ---
  const handlePostuler = (offreId) => {
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
      {/* ── VUE 1 : DASHBOARD (ACCUEIL) ── */}
      {onglet === 'dashboard' && (
        <div className="space-y-8">
          {/* Header de bienvenue */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Espace Candidat</h1>
              <p className="text-gray-400 text-sm mt-1">Gérez vos candidatures et trouvez votre prochaine opportunité.</p>
            </div>
          </div>

          {/* 3 Cartes de statistiques (KPIs) */}
          {/* Conteneur de présentation : "Votre carrière, gérée intelligemment" */}
          <div className="relative overflow-hidden bg-[#0b1a19] border border-[#00f098]/20 rounded-[2rem] p-8 md:p-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f098]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#00f098]/10 border border-[#00f098]/20 rounded-lg px-3 py-1.5 text-[#00f098] text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles className="w-3 h-3" /> Espace Sécurisé
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                  Votre carrière, gérée intelligemment
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Suivez vos dossiers en temps réel et postulez aux opportunités actives. Notre Intelligence Artificielle analyse votre profil pour vous positionner sur les meilleures offres du marché.
                </p>
                
                <button
                  onClick={() => setOnglet('offres')}
                  className="bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,152,0.2)]"
                >
                  Découvrir les opportunités
                </button>
              </div>

              {/* Animation visuelle d'illustration du CV */}
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
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* ── SECTION DOUBLE COLONNE : CHARTE FDE HARMONISÉE (70% / 30%) ────── */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── 1. COLONNE GAUCHE (70%) : MES DERNIÈRES CANDIDATURES ── */}
            <div className="lg:col-span-2 bg-[#0b1a19] border border-white/5 rounded-[2rem] p-7">
              {/* En-tête de la section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#00f098]" />
                  <h3 className="text-white font-bold text-lg">Mes dernières candidatures</h3>
                </div>
                {/* Bouton pilule FDE */}
                <button
                  onClick={() => setOnglet('candidatures')}
                  className="text-xs text-gray-300 hover:text-[#00f098] font-medium bg-[#041619] hover:bg-[#072421] border border-white/5 hover:border-[#00f098]/30 px-4 py-1.5 rounded-full transition-all flex items-center gap-1"
                >
                  Voir tout &gt;
                </button>
              </div>

              {/* Liste des candidatures */}
              {candidatures.length === 0 ? (
                <div className="text-center py-14 bg-[#041619] rounded-2xl border border-white/5">
                  <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Vous n'avez postulé à aucune offre pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {candidatures.slice(0, 4).map(c => {
                    const statut = statutConfig[c.statut] || statutConfig['en_attente']
                    const SIcon  = statut.icon
                    return (
                      <div
                        key={c._id}
                        className="p-4 bg-[#041619] border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#0b1a19] border border-white/5 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-[#00f098] group-hover:border-[#00f098]/30 transition-all">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold tracking-wide">
                              {c.offreId?.titre || 'Offre supprimée'}
                            </p>
                            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        {/* Badges de statut harmonisés FDE */}
                        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${
                          c.statut === 'retenu'
                            ? 'border-[#00f098]/20 text-[#00f098] bg-[#00f098]/10'
                            : c.statut === 'refusé'
                            ? 'border-red-400/20 text-red-400 bg-red-400/10'
                            : 'border-amber-400/20 text-amber-400 bg-amber-400/10'
                        }`}>
                          <SIcon className="w-3.5 h-3.5" />
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

              {/* Bloc A : Actions rapides */}
              <div className="bg-[#0b1a19] border border-white/5 rounded-[2rem] p-7">
                <h3 className="text-white font-bold text-lg mb-5">Actions rapides</h3>
                <div className="space-y-3">
                  {/* Action 1 : Voir les offres */}
                  <button
                    onClick={() => setOnglet('offres')}
                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#041619] border border-white/5 hover:border-[#00f098]/30 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0b1a19] border border-white/5 group-hover:border-[#00f098]/30 text-gray-400 group-hover:text-[#00f098] transition-all flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-white font-semibold text-sm group-hover:text-[#00f098] transition-colors">Voir les offres</span>
                  </button>

                  {/* Action 2 : Nouvelle candidature (Modal IA) */}
                  <button
                    onClick={() => handlePostuler('')}
                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#041619] border border-white/5 hover:border-[#00f098]/30 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00f098]/10 border border-[#00f098]/20 text-[#00f098] group-hover:scale-105 transition-all flex-shrink-0">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-white font-semibold text-sm group-hover:text-[#00f098] transition-colors">Nouvelle candidature</span>
                  </button>

                  {/* Action 3 : Mes candidatures */}
                  <button
                    onClick={() => setOnglet('candidatures')}
                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#041619] border border-white/5 hover:border-[#00f098]/30 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20 text-amber-400 group-hover:scale-105 transition-all flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-white font-semibold text-sm group-hover:text-[#00f098] transition-colors">Mes candidatures</span>
                  </button>
                </div>
              </div>

              {/* Bloc B : Ajouté récemment */}
              <div className="bg-[#0b1a19] border border-white/5 rounded-[2rem] p-7">
                <h3 className="text-white font-bold text-lg mb-5">Ajouté récemment</h3>
                {offres.length === 0 ? (
                  <p className="text-gray-500 text-xs">Aucune offre récente.</p>
                ) : (
                  <div className="space-y-4">
                    {offres.slice(0, 3).map(offre => (
                      <div
                        key={offre._id}
                        onClick={() => setOnglet('offres')}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        {/* Puce vert menthe avec lueur FDE */}
                        <span className="w-2 h-2 rounded-full bg-[#00f098] shadow-[0_0_8px_#00f098] flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="text-gray-300 text-sm font-medium group-hover:text-[#00f098] transition-colors truncate">
                          {offre.titre} {offre.typeContrat ? `(${offre.typeContrat})` : ''}
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

      {/* ── VUE 2 : LISTE DES OFFRES (HARMONISÉE FDE) ── */}
      {onglet === 'offres' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Opportunités actives</h2>
            <p className="text-gray-400 text-sm mt-1">Découvrez les opportunités correspondant à votre profil et postulez directement.</p>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par titre ou compétence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0b1a19] border border-white/5 text-white rounded-2xl pl-12 pr-4 py-4 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] focus:ring-1 focus:ring-[#00f098] transition-all shadow-sm"
            />
          </div>

          {/* Grille des cartes d'offres FDE */}
          {loading ? (
            <p className="text-center text-gray-500 py-16">Chargement des offres...</p>
          ) : offresFiltrees.length === 0 ? (
            <div className="text-center py-16 bg-[#0b1a19] rounded-[2rem] border border-white/5">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucune offre trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {offresFiltrees.map(offre => (
                <div
                  key={offre._id}
                  className="bg-[#0b1a19] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00f098]/30 transition-all duration-300 group shadow-lg"
                >
                  <div>
                    {/* En-tête : Icône et Date */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#041619] border border-white/5 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-[#00f098] group-hover:scale-105 transition-all">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium bg-[#041619] border border-white/5 px-2.5 py-1 rounded-lg">
                        {offre.createdAt ? new Date(offre.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
                      </span>
                    </div>

                    {/* Titre et Entreprise */}
                    <h3 className="text-white font-bold text-lg group-hover:text-[#00f098] transition-colors leading-snug mb-1">
                      {offre.titre}
                    </h3>
                    <p className="text-gray-400 text-xs font-medium mb-4">
                      {offre.entreprise || offre.departement || 'Entreprise partenaire'}
                    </p>

                    {/* Badges d'informations (Lieu, Type de contrat, Diplôme) */}
                    <div className="flex flex-wrap gap-2 mb-4">
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
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {offre.competences.slice(0, 3).map((comp, idx) => (
                          <span key={idx} className="bg-white/5 text-gray-400 text-[11px] px-2 py-0.5 rounded-md">
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

                  {/* Bouton Postuler vert menthe fluo */}
                  <button
                    onClick={() => handlePostuler(offre._id)}
                    className="w-full bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,152,0.15)] hover:shadow-[0_0_20px_rgba(0,240,152,0.3)] flex items-center justify-center gap-1.5"
                  >
                    Postuler &gt;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VUE 3 : MES CANDIDATURES (GRILLE DE CARTES FDE) ── */}
      {onglet === 'candidatures' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Mes candidatures</h2>
            <p className="text-gray-400 text-sm mt-1">Suivez en temps réel l'avancement et le statut de vos dossiers.</p>
          </div>

          {candidatures.length === 0 ? (
            <div className="text-center py-16 bg-[#0b1a19] rounded-[2rem] border border-white/5">
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucune candidature effectuée pour le moment.</p>
            </div>
          ) : (
            /* Grille moderne en 3 colonnes */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatures.map(c => {
                const statut = statutConfig[c.statut] || statutConfig['en_attente']
                const SIcon  = statut.icon
                return (
                  <div
                    key={c._id}
                    className="bg-[#0b1a19] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300 shadow-lg group"
                  >
                    <div>
                      {/* En-tête : Icône et Date */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#041619] border border-white/5 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-[#00f098] transition-colors">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-gray-500 text-xs flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Titre du poste et Entreprise */}
                      <h3 className="text-white font-bold text-lg leading-snug mb-1 group-hover:text-[#00f098] transition-colors">
                        {c.offreId?.titre || 'Offre supprimée'}
                      </h3>
                      <p className="text-gray-400 text-xs font-medium mb-4">
                        {c.offreId?.entreprise || c.offreId?.typeContrat || 'Entreprise partenaire'}
                      </p>

                      {/* Description du statut en petit au centre */}
                      <div className="bg-[#041619] border border-white/5 p-3.5 rounded-xl mb-6">
                        <p className="text-gray-400 text-xs leading-relaxed">
                          {statutMessage[c.statut] || statutMessage['en_attente']}
                        </p>
                      </div>
                    </div>

                    {/* Badge de couleur tout en bas pour fermer le design */}
                    <div className={`w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl border ${statut.bg} ${statut.color}`}>
                      <SIcon className="w-4 h-4" />
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