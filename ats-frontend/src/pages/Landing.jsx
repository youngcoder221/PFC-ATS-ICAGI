import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Briefcase, Check, ArrowUpRight, ArrowRight, FileText, Bot, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo-icon-small.png'
import heroBg from '../assets/hero-bg.png'
import api from '../services/api'

export default function Landing() {
  const navigate                      = useNavigate()
  const location                      = useLocation()
  const { user }                      = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [offres, setOffres]           = useState([])

  // Chargement des offres au montage de la page
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await api.get('/offres')
        setOffres(res.data.filter(o => o.statut === 'ouverte'))
      } catch (err) {
        console.error("Erreur chargement offres:", err)
      }
    }
    fetchOffres()
  }, [])

  // 🎯 Défilement automatique vers la liste des offres si l'URL contient #offres
  useEffect(() => {
    if (location.hash === '#offres') {
      setTimeout(() => {
        const el = document.getElementById('offres')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }, [location])

  // 🚀 Mémorisation de l'offre ciblée (Deep Linking)
  const handlePostulerCarte = (offreId) => {
    if (!user) {
      // On passe l'ID de l'offre dans l'état du routeur pour que le Login s'en souvienne
      navigate('/login', { state: { targetOffreId: offreId } })
    } else if (user.role === 'candidat') {
      // Si déjà connecté, on envoie directement au dashboard avec le paramètre
      navigate(`/candidat?postulerOffreId=${offreId}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#041619]">
      
      {/* ── TOPBAR (Charte FDE & Liens initiaux) ── */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#0b1a19] border-b border-white/5 sticky top-0 z-50 backdrop-blur-sm">
        
        {/* 1. SECTION GAUCHE (Branding) */}
        <div className="flex-1">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer w-fit group">
            <img src={logo} alt="ATS Platform" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
            <span className="text-white font-bold text-lg tracking-tight">ATS <span className="text-[#00f098]">Sénégal</span></span>
          </button>
        </div>

        {/* 2. SECTION CENTRALE (Navigation structurelle) */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {['Fonctionnalités', 'Comment ça marche ?', 'À propos'].map((item) => (
            <span 
              key={item} 
              className="text-gray-400 text-sm font-medium hover:text-white transition-colors duration-300 cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>

        {/* 3. SECTION DROITE (Authentification) */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-transparent text-white font-medium px-4 py-2 rounded-lg hover:text-[#00f098] transition-colors duration-300 text-sm"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#00f098] text-[#0b1a19] font-black px-5 py-2.5 rounded-xl transition-all hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)] text-sm tracking-wide"
          >
            S'inscrire
          </button>
        </div>

      </nav>

      {/* ── HERO COMPACTÉ (CALÉ PILE SUR L'IMAGE SANS VIDE EN BAS) ── */}
      <section 
        className="relative flex flex-col px-6 pt-12 pb-10 md:pt-16 md:pb-12 justify-center border-b border-white/5"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(4, 22, 25, 0.98) 0%, rgba(4, 22, 25, 0.85) 50%, rgba(4, 22, 25, 0.15) 100%), url(${heroBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          
          {/* Badge catégorie */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-[#00f098]"></div>
            <span className="text-[#00f098] font-bold text-xs tracking-widest uppercase">Recrutement 2.0</span>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl lg:text-[4.2rem] font-extrabold text-white mb-4 tracking-tight leading-[1.1] max-w-3xl">
            Le recrutement réinventé <br className="hidden md:block"/> par l'<span className="text-[#00f098]">Intelligence Artificielle.</span>
          </h1>
          
          {/* Description courte */}
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl font-light leading-relaxed">
            Conçu pour les PME sénégalaises et d'Afrique de l'Ouest. Centralisez vos candidatures, automatisez le tri des CV et recrutez les meilleurs talents en quelques secondes grâce à notre moteur de scoring IA.
          </p>

          {/* Boutons d'action regroupés et remontés */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-[#00f098] hover:bg-[#00d084] text-[#041619] px-7 py-3 rounded-xl font-black transition-all text-sm shadow-[0_0_15px_rgba(0,240,152,0.25)] cursor-pointer"
            >
              Espace Entreprise
            </button>
            <button 
              onClick={() => document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth' })} 
              className="bg-[#e8d5a5] hover:bg-[#d4c194] text-[#041619] px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-[0_0_15px_rgba(232,213,165,0.15)] cursor-pointer"
            >
              Déposer mon CV
            </button>
            <div className="text-xs border-l border-white/20 pl-4 py-1">
              <p className="text-white font-bold">Propulsé par l'IA</p>
              <p className="text-[#00f098] font-semibold">Analyse sémantique Gemini</p>
            </div>
          </div>

          {/* Chiffres clés directement calés sous les boutons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 max-w-3xl">
            <div>
              <p className="text-3xl md:text-4xl font-black text-white mb-1">654</p>
              <p className="text-[10px] text-[#00f098] uppercase tracking-widest font-bold">opportunités actives</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-white mb-1">358</p>
              <p className="text-[10px] text-[#00f098] uppercase tracking-widest font-bold">organisations</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-white mb-1">43</p>
              <p className="text-[10px] text-[#00f098] uppercase tracking-widest font-bold">stages disponibles</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── LISTE DES OFFRES (CANVAS BLANC HAUT CONTRASTE) ── */}
      <main id="offres" className="flex-1 w-full bg-white py-14 md:py-18 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* En-tête de section équilibré */}
          <div className="mb-8">
            <p className="text-[#00f098] font-black text-xs tracking-widest uppercase mb-2">
              Opportunités de carrière
            </p>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-black text-[#041619] max-w-2xl leading-[1.15] tracking-tight">
                Découvrez les postes ouverts et postulez en un clic
              </h2>
              <p className="text-gray-600 max-w-md text-sm md:text-base leading-relaxed">
                Consultez les offres publiées par nos entreprises partenaires et laissez notre algorithme analyser votre profil pour un matching parfait.
              </p>
            </div>
          </div>

          {/* Filtres de contrats */}
          <div className="flex flex-wrap gap-3 mb-6 text-xs md:text-sm font-bold">
            <button className="bg-[#08282d] border border-[#00f098]/30 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,240,152,0.1)] cursor-pointer">
              Postes ouverts <span className="bg-[#00f098] text-[#041619] px-2 py-0.5 rounded-full text-xs font-black">584</span>
            </button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer">
              CDI & CDD <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">515</span>
            </button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer">
              Stages <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">43</span>
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="bg-[#08282d] border border-white/5 rounded-2xl p-2.5 mb-10 shadow-lg flex flex-col md:flex-row gap-2.5 items-center">
            <div className="flex-1 w-full flex items-center gap-3 bg-[#041619] px-4 py-3 rounded-xl border border-white/5 focus-within:border-[#00f098]/50 transition-colors">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Poste, entreprise, compétence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 font-medium"
              />
            </div>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-3 rounded-xl w-full md:w-auto transition-colors text-xs uppercase tracking-wider cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>

          {offres.length === 0 ? (
            <div className="text-center py-16 bg-[#08282d] rounded-2xl border border-white/10 shadow-sm">
              <Briefcase className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-white font-bold text-base">Aucune offre disponible pour le moment</h3>
            </div>
          ) : (
            <>
              {/* Grille des cartes d'offres sombres FDE */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offres
                  .filter(o => 
                    searchQuery === '' || 
                    o.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.competences?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((offre) => {
                  return (
                    <div 
                      key={offre._id} 
                      className="bg-[#08282d] border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:border-[#00f098]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                    >
                      {/* Header de carte */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00f098]"></div>
                          <span className="text-gray-400 font-bold text-xs tracking-wider uppercase">
                            {offre.recruteurId?.entreprise || 'Confidentiel'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#00f098] bg-[#00f098]/10 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-[#00f098]/20">
                          <Check className="w-3 h-3" /> Vérifiée
                        </div>
                      </div>

                      {/* Titre */}
                      <h3 className="text-lg md:text-xl font-black text-white mb-4 line-clamp-2 leading-snug group-hover:text-[#00f098] transition-colors">
                        {offre.titre}
                      </h3>

                      {/* Badges métadonnées */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                          {offre.secteur || 'Technologies'}
                        </span>
                        <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                          {offre.typeContrat}
                        </span>
                      </div>

                      {/* Informations dates & lieu */}
                      <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 py-3 mb-4">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Localisation</p>
                          <p className="text-xs text-white font-bold truncate">{offre.localisation || 'Sénégal'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Publication</p>
                          <p className="text-xs text-white font-bold">
                            {new Date(offre.createdAt).toLocaleDateString('fr-FR', {day: '2-digit', month:'short'})}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Date limite</p>
                          <p className="text-xs text-white font-bold">Non précisée</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-xs md:text-sm mb-4 line-clamp-2 leading-relaxed">
                        {offre.description}
                      </p>

                      <p className="text-[#00f098] text-xs font-bold mb-6 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Scoring IA disponible pour cette offre
                      </p>

                      {/* Boutons CTA */}
                      <div className="mt-auto flex items-center gap-2.5">
                        <button 
                          onClick={() => navigate(`/offres/${offre._id}`)}
                          className="flex-1 bg-[#041619] border border-white/10 text-white font-bold py-2.5 rounded-xl hover:border-[#00f098]/50 hover:text-[#00f098] transition-colors text-xs cursor-pointer"
                        >
                          Détails
                        </button>
                        <button 
                          onClick={() => handlePostulerCarte(offre._id)}
                          className="flex-1 bg-[#00f098] text-[#041619] font-black py-2.5 rounded-xl hover:bg-[#00d084] transition-colors flex items-center justify-center gap-1.5 text-xs shadow-[0_0_12px_rgba(0,240,152,0.2)] cursor-pointer"
                        >
                          Postuler <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-center mt-10">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#08282d] border border-white/10 text-white font-bold px-8 py-3.5 rounded-xl hover:border-[#00f098]/50 hover:text-[#00f098] transition-all text-sm flex items-center gap-2 cursor-pointer shadow-md"
                >
                  Afficher toutes les opportunités ({offres.length})
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── SECTION ÉCOSYSTÈME ATS (RYTHME COMPACTÉ & TITRES COHÉRENTS) ── */}
      <section className="bg-[#020e10] py-16 md:py-20 px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-[#00f098] font-bold text-xs tracking-widest uppercase mb-2">
            L'écosystème ATS
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-black text-white mb-3 tracking-tight max-w-3xl leading-[1.15]">
            Une plateforme unifiée, trois espaces dédiés
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-2xl font-light leading-relaxed">
            Une solution complète qui connecte intelligemment les candidats aux recruteurs grâce à la puissance des grands modèles de langage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Carte 1 : Candidat */}
            <div className="bg-[#08282d] border border-white/10 rounded-2xl p-7 flex flex-col hover:border-[#e8d5a5]/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#e8d5a5] rounded-xl flex items-center justify-center font-black text-[#041619] text-lg mb-6 shadow-[0_0_15px_rgba(232,213,165,0.2)]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">Espace Candidat</h3>
              <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed">
                Déposez votre CV au format PDF en quelques secondes. Suivez l'état d'avancement de vos candidatures en temps réel et postulez aux offres en un clic.
              </p>
              <button 
                onClick={() => navigate('/login')} 
                className="mt-auto w-full bg-[#e8d5a5] text-[#041619] font-black py-3 px-5 rounded-xl flex justify-between items-center hover:bg-[#d4c194] transition-colors text-xs uppercase tracking-wider cursor-pointer"
              >
                Accéder à l'Espace <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Carte 2 : Recruteur */}
            <div className="bg-[#08282d] border border-white/10 rounded-2xl p-7 flex flex-col hover:border-[#00f098]/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#00f098] rounded-xl flex items-center justify-center font-black text-[#041619] text-lg mb-6 shadow-[0_0_15px_rgba(0,240,152,0.2)]">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">Espace Entreprise</h3>
              <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed">
                Publiez vos offres et laissez l'IA faire le reste. Accédez instantanément à un classement (ranking) automatisé et objectif des meilleurs profils.
              </p>
              <button 
                onClick={() => navigate('/login')} 
                className="mt-auto w-full bg-[#00f098] text-[#041619] font-black py-3 px-5 rounded-xl flex justify-between items-center hover:bg-[#00d084] transition-colors shadow-[0_0_15px_rgba(0,240,152,0.25)] text-xs uppercase tracking-wider cursor-pointer"
              >
                Accéder à l'Espace <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Carte 3 : Technologie IA */}
            <div className="bg-[#08282d] border border-white/10 rounded-2xl p-7 flex flex-col hover:border-[#00f098]/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#041619] border border-white/10 rounded-xl flex items-center justify-center font-black text-white text-lg mb-6">
                <Bot className="w-5 h-5 text-[#00f098]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">Moteur d'Analyse IA</h3>
              <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed">
                Intégration native de l'API Google Gemini. Extraction sémantique pointue, matching de compétences et scoring automatisé de 0 à 100 pour chaque CV.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-auto w-full bg-[#041619] border border-white/10 text-white font-bold py-3 px-5 rounded-xl flex justify-between items-center hover:border-[#00f098]/50 hover:text-[#00f098] transition-colors text-xs uppercase tracking-wider cursor-pointer"
              >
                Découvrir l'IA <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER B2B (HARMONISÉ ET ÉPURÉ) ── */}
      <footer className="bg-[#041619] border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo ATS" className="w-10 h-10 brightness-200" />
            <p className="text-gray-400 text-xs max-w-sm font-medium leading-relaxed">
              La plateforme de référence pour la modernisation et l'automatisation des Ressources Humaines au Sénégal.
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 font-medium text-xs">
              <span className="text-white font-bold hover:text-[#00f098] cursor-pointer transition-colors">Documentation API</span>
              <span className="text-gray-600 mx-2">·</span>
              <span className="hover:text-white cursor-pointer transition-colors">Mentions légales</span>
              <span className="text-gray-600 mx-2">·</span>
              © {new Date().getFullYear()} ATS Sénégal
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}