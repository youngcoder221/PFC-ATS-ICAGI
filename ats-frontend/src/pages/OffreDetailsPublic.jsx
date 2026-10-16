import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Calendar, Share2, Sparkles, Building2, Check, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logo from '../assets/logo-icon-small.png'

export default function OffreDetailsPublic() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [offre, setOffre]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [copie, setCopie]     = useState(false)

  // Chargement des données complètes de l'offre
  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const res = await api.get(`/offres/${id}`)
        setOffre(res.data)
      } catch (err) {
        console.error("Erreur lors de la récupération de l'offre :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffre()
  }, [id])

  // Partager l'offre (copie de l'URL)
  const handlePartager = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopie(true)
    setTimeout(() => setCopie(false), 2500)
  }

  // Workflow de candidature avec mémorisation de l'offre
  const handlePostuler = () => {
    if (!user) {
      navigate('/login', { state: { targetOffreId: id } })
    } else if (user.role === 'candidat') {
      navigate(`/candidat?postulerOffreId=${id}`)
    } else {
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#041619] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00f098]/30 border-t-[#00f098] rounded-full animate-spin" />
          <p className="text-gray-400 text-xs font-medium">Chargement de l'offre...</p>
        </div>
      </div>
    )
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-[#041619] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-black mb-2">Offre introuvable</h2>
        <p className="text-gray-400 text-sm mb-6">Cette opportunité n'existe plus ou a été retirée.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#00f098] text-[#041619] px-6 py-2.5 rounded-xl font-bold text-xs uppercase"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  const nomEntreprise = offre.recruteurId?.entreprise || `${offre.recruteurId?.prenom || ''} ${offre.recruteurId?.nom || ''}`.trim() || 'Entreprise partenaire'

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* ── NAVBAR PUBLIQUE (ÉPURÉE SANS LIEN REDONDANT) ── */}
      <nav className="bg-[#0b1a19] border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
            <img src={logo} alt="ATS Sénégal" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
            <span className="text-white font-black text-lg tracking-tight">
              ATS <span className="text-[#00f098]">Sénégal</span>
            </span>
          </button>
        </div>
      </nav>

      {/* ── BANDEAU DU TITRE (INSPIRATION FDE / HANDSHAKE) ── */}
      <header className="bg-[#0b1a19] text-white pt-8 pb-12 px-6 border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. Bouton retour intact */}
          <button
            onClick={() => navigate('/#offres')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f098] text-xs font-bold transition-colors mb-6 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#00f098] group-hover:-translate-x-1 transition-transform" />
            Retour aux offres
          </button>

          {/* 2. Titre du poste aéré avec espacement généreux FDE */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 md:mb-10 leading-[1.2] max-w-3xl md:max-w-4xl text-balance">
            {offre.titre}
          </h1>

          {/* 3. Entreprise en dessous : "Publié par [Entreprise]" */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-gray-400 text-sm font-medium">Publié par</span>
            <div className="inline-flex items-center gap-2 bg-[#041619] border border-white/10 px-3 py-1.5 rounded-xl shadow-sm">
              <Building2 className="w-4 h-4 text-[#00f098]" />
              <span className="text-white font-bold text-sm tracking-wide">{nomEntreprise}</span>
            </div>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="text-gray-400 text-xs font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              {offre.localisation || 'Sénégal'}
            </span>
          </div>

          {/* 4. Badges d'informations complémentaires */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300 font-medium">
            <span className="bg-[#041619] border border-white/10 px-3 py-1.5 rounded-xl">
              {offre.secteur || 'Technologie & Numérique'}
            </span>
            <span className="bg-[#041619] border border-white/10 px-3 py-1.5 rounded-xl">
              {offre.typeContrat || 'CDI'}
            </span>
            <span className="bg-[#00f098]/10 text-[#00f098] border border-[#00f098]/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold">
              <Check className="w-3.5 h-3.5" /> Offre active
            </span>
          </div>

        </div>
      </header>

      {/* ── 3. CONTENU EN DEUX COLONNES (CANVAS BLANC PUR) ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* COLONNE GAUCHE (70%) : Description, Compétences et Profil */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
            
            {/* Description générale */}
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3">
                À propos de l'offre
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
                {offre.description}
              </p>
            </div>

            {/* Compétences requises */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00f098]" /> Compétences ciblées
              </h2>
              <div className="flex flex-wrap gap-2">
                {offre.competences?.map((c, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Profil recherché */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3">
                Profil recherché & Niveau d'études
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Niveau d'études exigé : <span className="font-bold text-gray-900">{offre.niveauRequis || 'Non spécifié'}</span>.
                Une évaluation automatisée sera effectuée lors du dépôt de votre CV pour analyser l'adéquation de vos compétences.
              </p>
            </div>
          </div>

          {/* COLONNE DROITE (30%) : Bloc vertical de résumé (#041619) */}
          <aside className="bg-[#041619] text-white rounded-2xl p-6 border border-white/5 shadow-xl space-y-6 sticky top-24">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#00f098]">
              Détails du recrutement
            </h3>

            <div className="space-y-4 text-xs">
              <div className="border-b border-white/5 pb-3">
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Lieu</p>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00f098]" />
                  {offre.localisation || 'Sénégal'}
                </p>
              </div>

              <div className="border-b border-white/5 pb-3">
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Contrat</p>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00f098]" />
                  {offre.typeContrat || 'CDI'}
                </p>
              </div>

              <div className="border-b border-white/5 pb-3">
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Niveau d'études</p>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#00f098]" />
                  {offre.niveauRequis || 'Tous profils'}
                </p>
              </div>

              <div className="border-b border-white/5 pb-3">
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Publication</p>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(offre.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Date limite</p>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Non précisée
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handlePostuler}
                className="w-full bg-[#00f098] hover:bg-[#00d084] text-[#041619] py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,152,0.25)] cursor-pointer"
              >
                Postuler à l'offre
              </button>

              <button
                onClick={handlePartager}
                className="w-full bg-[#0b1a19] hover:bg-white/5 text-gray-300 hover:text-white border border-white/10 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copie ? 'Lien copié ✓' : 'Partager cette offre'}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 text-center leading-tight">
              Analyse automatisée du profil par l'Intelligence Artificielle.
            </p>
          </aside>

        </div>
      </main>

    </div>
  )
}