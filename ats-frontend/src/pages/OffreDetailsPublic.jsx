import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Calendar, Share2, Sparkles, Building2, Check, Clock, X, CheckCircle, XCircle, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logo from '../assets/logo-icon-small.png'

export default function OffreDetailsPublic() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [offre, setOffre]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [copie, setCopie]         = useState(false)

  // États pour la modale de candidature
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [diplome, setDiplome]         = useState('')
  const [experience, setExperience]   = useState(0)
  const [fichier, setFichier]         = useState(null)
  const [uploading, setUploading]     = useState(false)
  const [message, setMessage]         = useState(null)

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const res = await api.get(`/offres/${id}`)
        setOffre(res.data)
      } catch (err) {
        console.error('Erreur chargement offre :', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffre()
  }, [id])

  const handlePartager = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopie(true)
    setTimeout(() => setCopie(false), 2500)
  }

  // Ouvrir la modale ou rediriger
  const handleOuvrirModal = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'candidat') {
      alert("⚠️ Seuls les comptes candidats peuvent postuler aux offres.")
      return
    }
    setIsModalOpen(true)
    setMessage(null)
  }

  // Envoi sécurisé du CV au backend
  const handleUpload = async (e) => {
    e.preventDefault()
    if (!fichier) {
      setMessage({ type: 'error', text: '❌ Veuillez sélectionner un fichier PDF' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('cv', fichier)
      formData.append('offreId', id)
      formData.append('diplome', diplome)
      formData.append('experience', experience)

      // On laisse Axios définir automatiquement le Content-Type avec son boundary
      await api.post('/cv/upload', formData)

      setMessage({ type: 'success', text: '✅ Candidature envoyée et analysée avec succès !' })
      setTimeout(() => {
        setIsModalOpen(false)
        setFichier(null)
        navigate('/candidat?tab=candidatures')
      }, 1500)
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || '❌ Erreur lors de l\'envoi de la candidature' 
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#041619] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00f098]/30 border-t-[#00f098] rounded-full animate-spin" />
          <p className="text-gray-400 text-xs font-medium">Chargement de l'opportunité...</p>
        </div>
      </div>
    )
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-[#041619] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-black mb-2">Offre introuvable</h2>
        <p className="text-gray-400 text-sm mb-6">Cette opportunité a été retirée ou n'existe plus.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#00f098] text-[#041619] px-6 py-2.5 rounded-xl font-bold text-xs uppercase"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  const nomEntreprise = offre.recruteurId?.entreprise || offre.recruteurId?.nom 
    ? `${offre.recruteurId?.prenom || ''} ${offre.recruteurId?.nom || ''}`.trim()
    : 'Entreprise partenaire'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* ── NAVBAR PUBLIQUE ── */}
      <nav className="bg-[#0b1a19] border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="ATS Sénégal" className="w-9 h-9 object-contain" />
            <span className="text-white font-black text-lg tracking-tight">
              ATS <span className="text-[#00f098]">Sénégal</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-[#00f098] text-xs font-bold transition-colors cursor-pointer"
          >
            Toutes les offres
          </button>
        </div>
      </nav>

      {/* ── BANDEAU SUPÉRIEUR ── */}
      <header className="bg-[#0b1a19] text-white pt-8 pb-12 px-6 border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f098] text-xs font-bold transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux opportunités
          </button>

          <p className="text-[#00f098] font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" />
            {nomEntreprise} <span className="text-gray-600">•</span> {offre.localisation || 'Sénégal'}
          </p>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            {offre.titre}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-medium">
            <span className="bg-[#041619] border border-white/10 px-3 py-1 rounded-lg">
              {offre.secteur || 'Technologie & Numérique'}
            </span>
            <span className="bg-[#041619] border border-white/10 px-3 py-1 rounded-lg">
              {offre.typeContrat || 'CDI'}
            </span>
            <span className="bg-[#00f098]/10 text-[#00f098] border border-[#00f098]/20 px-3 py-1 rounded-lg flex items-center gap-1 font-bold">
              <Check className="w-3 h-3" /> Offre active
            </span>
          </div>
        </div>
      </header>

      {/* ── CONTENU EN DEUX COLONNES ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* GAUCHE : Description & Compétences */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3">
                À propos de l'offre
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
                {offre.description}
              </p>
            </div>

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

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3">
                Profil recherché & Niveau d'études
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Niveau d'études exigé : <span className="font-bold text-gray-900">{offre.niveauRequis || 'Non spécifié'}</span>. 
                Une analyse sémantique sera automatiquement effectuée sur votre CV par notre IA pour évaluer votre profil.
              </p>
            </div>
          </div>

          {/* DROITE : Récapitulatif & Action Postuler */}
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

            <div className="space-y-3 pt-2">
              <button
                onClick={handleOuvrirModal}
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
          </aside>

        </div>
      </main>

      {/* ── MODALE DE DÉPÔT DE CANDIDATURE (PARSING IA GEMINI) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041619]/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-[#0b1a19] border border-[#00f098]/30 rounded-[2rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-500 hover:text-[#00f098] transition-colors bg-[#041619] p-2 rounded-full border border-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f098]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 bg-[#00f098]/10 border border-[#00f098]/20 rounded-lg px-3 py-1.5 text-[#00f098] text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles className="w-3 h-3" /> Parsing API Gemini
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                  Postuler à ce poste
                </h2>
                <p className="text-[#00f098] text-sm font-bold mb-3">
                  {offre.titre} — {nomEntreprise}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Téléversez votre CV en PDF. Notre Intelligence Artificielle analysera vos compétences pour calculer votre adéquation avec l'offre.
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Dernier diplôme obtenu
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Licence 3, Master 2..."
                        value={diplome}
                        onChange={(e) => setDiplome(e.target.value)}
                        className="w-full bg-[#041619] border border-white/10 text-white rounded-xl px-4 py-3 text-xs placeholder-gray-500 focus:outline-none focus:border-[#00f098]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Années d'expérience
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-[#041619] border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#00f098]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <label className="w-full flex-1 flex items-center justify-between bg-[#041619] border border-white/10 hover:border-[#00f098]/50 px-4 py-3.5 rounded-xl cursor-pointer transition-all group">
                      <span className={`text-xs font-bold truncate ${fichier ? 'text-[#00f098]' : 'text-gray-400 group-hover:text-white'}`}>
                        {fichier ? fichier.name : 'Sélectionner mon CV (PDF)...'}
                      </span>
                      <FileText className={`w-5 h-5 ${fichier ? 'text-[#00f098]' : 'text-gray-600 group-hover:text-[#00f098]'}`} />
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFichier(e.target.files[0])} />
                    </label>
                    <button 
                      type="submit"
                      disabled={!fichier || uploading}
                      className="w-full sm:w-auto bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,240,152,0.2)] flex justify-center items-center gap-2 cursor-pointer"
                    >
                      {uploading ? (
                        <><span className="w-4 h-4 border-2 border-[#0b1a19]/30 border-t-[#0b1a19] rounded-full animate-spin" /> Analyse...</>
                      ) : 'Envoyer ma candidature'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Visuel scanner IA */}
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

    </div>
  )
}