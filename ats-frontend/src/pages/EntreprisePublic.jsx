import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, Coins, ExternalLink, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logoAts from '../assets/logo-icon-small.png'

export default function EntreprisePublic() {
  const { nom } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const nomEntreprise = decodeURIComponent(nom)

  const [offres, setOffres]   = useState([])
  const [loading, setLoading] = useState(true)

  // 🚀 Redirection intelligente vers le Login avec mémorisation de l'offre
  const handlePostuler = (offreId) => {
    if (!user) {
      navigate('/login', { state: { targetOffreId: offreId } })
    } else if (user.role === 'candidat') {
      navigate(`/candidat?postulerOffreId=${offreId}`)
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    const fetchOffresEntreprise = async () => {
      try {
        const res = await api.get(`/offres?entreprise=${encodeURIComponent(nomEntreprise)}`)
        setOffres(res.data)
      } catch (err) {
        console.error("Erreur chargement offres entreprise :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffresEntreprise()
  }, [nomEntreprise])

  // Récupérer le logo depuis la première offre disponible
  const premierLogo = offres.find(o => o.logoUrl)?.logoUrl

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* ── NAVBAR ── */}
      <nav className="bg-[#0b1a19] border-b border-white/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
            <img src={logoAts} alt="ATS Sénégal" className="w-9 h-9 object-contain" />
            <span className="text-white font-black text-lg tracking-tight">
              ATS <span className="text-[#00f098]">Sénégal</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/#offres')}
            className="text-gray-400 hover:text-[#00f098] text-xs font-bold transition-colors cursor-pointer"
          >
            Toutes les offres
          </button>
        </div>
      </nav>

      {/* ── HEADER BANDEAU ENTREPRISE (STYLE FDE) ── */}
      <header className="bg-[#0b1a19] text-white pt-8 pb-14 px-6 border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f098] text-xs font-bold transition-colors mb-8 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#00f098] group-hover:-translate-x-1 transition-transform" />
            Retour à l'offre
          </button>

          {/* Logo Géant + Nom de l'entreprise (Exactement comme FDE) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#041619] border border-white/10 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl">
              {premierLogo ? (
                <img 
                  src={premierLogo} 
                  alt={nomEntreprise} 
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="text-[#00f098] font-black text-2xl md:text-3xl">
                  {nomEntreprise.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                {nomEntreprise}
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mt-1.5 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00f098] shadow-[0_0_8px_#00f098]" />
                Entreprise partenaire vérifiée sur ATS Sénégal
              </p>
            </div>
          </div>

          {/* Lien externe entreprise */}
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#00f098] hover:underline font-bold cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" /> Profil employeur certifié
            </span>
          </div>

        </div>
      </header>

      {/* ── LISTE DES OPPORTUNITÉS DE CETTE PME (FOND BLANC FDE) ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="border-b border-gray-100 pb-4 mb-8 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Postes ouverts chez {nomEntreprise}
            </h2>
            <p className="text-gray-500 text-xs mt-1 font-medium">
              {offres.length} opportunité(s) activement ouverte(s) aux candidatures.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-16 text-xs font-medium">Chargement des postes...</p>
        ) : offres.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
            <p className="text-gray-500 font-medium text-xs">Aucun autre poste ouvert pour le moment.</p>
          </div>
        ) : (
          /* Liste de cartes horizontales épurées style FDE */
          <div className="space-y-4">
            {offres.map(o => (
              <div
                key={o._id}
                onClick={() => navigate(`/offres/${o._id}`)}
                className="p-5 md:p-6 bg-white border border-gray-200 hover:border-[#00f098] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                {/* Logo + Titre + Métadonnées */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#041619] border border-white/5 p-1 flex items-center justify-center flex-shrink-0">
                    {o.logoUrl ? (
                      <img src={o.logoUrl} alt={nomEntreprise} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <span className="text-[#00f098] font-black text-xs">{nomEntreprise.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#041619] transition-colors truncate">
                      {o.titre}
                    </h3>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">{nomEntreprise}</p>
                    
                    {/* Infos en ligne (Lieu, Contrat, Salaire) */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {o.localisation || 'Sénégal'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {o.typeContrat}
                      </span>
                      {o.salaire && o.salaire !== 'À négocier' && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#041619] font-bold">
                            <Coins className="w-3.5 h-3.5 text-[#00f098]" /> {o.salaire}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton Postuler menant au Login avec le colis de l'offre */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePostuler(o._id)
                  }}
                  className="bg-[#041619] hover:bg-[#00f098] text-white hover:text-[#041619] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                >
                  Postuler <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}