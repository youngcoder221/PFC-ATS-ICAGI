import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Briefcase, ArrowUpRight, ArrowRight, FileText, Bot, Sparkles, MapPin, Laptop, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo-icon-small.png'
import heroBg from '../assets/hero-bg.png'
import api from '../services/api'

export default function Landing() {
  const navigate                      = useNavigate()
  const location                      = useLocation()
  const { user }                      = useAuth()
  
  // --- ÉTATS DE RECHERCHE ET FILTRAGE ---
  const [searchQuery, setSearchQuery]       = useState('')
  const [regionSelected, setRegionSelected] = useState('Toutes régions')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [offres, setOffres]                 = useState([])

  const regionsSenegal = [
    'Toutes régions', 'Dakar', 'Thiès', 'Diourbel', 'Saint-Louis', 
    'Ziguinchor', 'Kaolack', 'Louga', 'Fatick', 'Kolda', 
    'Matam', 'Tambacounda', 'Kaffrine', 'Kédougou', 'Sédhiou'
  ]

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#region-dropdown-container')) setIsDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  // 💰 Formate automatiquement les montants en format compact (ex: 500 000 -> 500k)
  const formaterSalaire = (salaire) => {
    if (!salaire || salaire.toLowerCase().includes('négocier')) return 'À négocier'
    return salaire
      .replace(/(\d+)\s*000/g, '$1k')
      .replace(/-/g, '–')
      .trim()
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

        {/* 3. SECTION DROITE (Authentification style Handshake) */}
        <div className="flex-1 flex items-center justify-end gap-3.5">
          <button
            onClick={() => navigate('/login')}
            className="bg-transparent border border-white text-white font-bold px-5 py-2.5 rounded-xl hover:bg-white/10 hover:border-white transition-all text-sm cursor-pointer"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#00f098] text-[#0b1a19] font-black px-5 py-2.5 rounded-xl transition-all hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)] text-sm tracking-wide cursor-pointer"
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
              onClick={() => {
                if (user?.role === 'candidat') {
                  navigate('/candidat')
                } else {
                  document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth' })
                }
              }} 
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

      {/* ── LISTE DES OFFRES (STYLE WELLFOUND x FDE) ── */}
      {/* L'ID "offres" permet au bouton "Déposer mon CV" de scroller jusqu'ici */}
      <main id="offres" className="flex-1 w-full bg-white py-16 md:py-24 relative scroll-mt-6">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* En-tête centré et épuré */}
          <div className="text-center mb-10">
            <p className="text-[#00f098] font-black text-xs tracking-widest uppercase mb-4">
              Opportunités de carrière
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#041619] tracking-tight mb-4">
              Découvrez votre prochaine étape.
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Consultez les offres publiées par nos entreprises partenaires et laissez notre IA analyser votre profil pour un matching parfait.
            </p>
          </div>

          {/* Barre de recherche "Pill" Wellfound x FDE avec Dropdown interactif */}
          <div className="max-w-4xl mx-auto mb-5 relative" id="region-dropdown-container">
            {/* Suppression du focus global pour bien séparer visuellement les deux actions */}
            <div className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-2 transition-all duration-300">
              
              {/* Champ de recherche texte */}
              <div className="flex-1 flex items-center gap-3 px-5 py-2.5 w-full">
                <Search className="w-4 h-4 text-[#041619]" />
                <input
                  type="text"
                  placeholder="Poste, entreprise, compétence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium text-sm"
                />
              </div>

              {/* Ligne de séparation verticale (Desktop) */}
              <div className="hidden md:block w-px h-6 bg-gray-200"></div>

              {/* Champ Localisation Interactif (Style Wellfound) */}
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                // Le cursor-text donne l'illusion d'un vrai champ de saisie au survol
                className="flex-1 flex items-center gap-3 px-5 py-2.5 w-full cursor-text hover:bg-gray-50 rounded-full transition-colors group"
              >
                <MapPin className={`w-4 h-4 transition-colors ${regionSelected !== 'Toutes régions' ? 'text-[#041619]' : 'text-gray-400'}`} />
                
                <span className={`flex-1 font-medium text-sm truncate ${regionSelected !== 'Toutes régions' ? 'text-gray-900' : 'text-gray-400'}`}>
                  {regionSelected}
                </span>

                {/* Bouton "X" pour annuler la sélection (Visible uniquement si une région est choisie) */}
                {regionSelected !== 'Toutes régions' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ⛔ Empêche le clic d'ouvrir le menu déroulant
                      setRegionSelected('Toutes régions');
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-200 transition-colors flex-shrink-0 cursor-pointer"
                    title="Effacer la sélection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bouton d'action */}
              <button 
                onClick={() => { setSearchQuery(''); setRegionSelected('Toutes régions') }}
                className="w-full md:w-auto bg-[#041619] hover:bg-[#0b1a19] text-white font-black px-7 py-3 rounded-full transition-all text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                {(searchQuery || regionSelected !== 'Toutes régions') ? 'Réinitialiser' : 'Rechercher'}
              </button>
            </div>

            {/* Menu Déroulant des Régions (Thème FDE) */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 md:right-[150px] mt-3 w-full md:w-64 bg-[#0b1a19] border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(4,22,25,0.2)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                  {regionsSenegal.map((region) => (
                    <div
                      key={region}
                      onClick={() => { setRegionSelected(region); setIsDropdownOpen(false) }}
                      className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                        regionSelected === region
                          ? 'bg-[#00f098]/10 text-[#00f098] font-bold border-l-2 border-[#00f098]'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium border-l-2 border-transparent'
                      }`}
                    >
                      {region}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtres de contrats équilibrés (Marge resserrée) */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8 text-xs font-bold">
            <div className="bg-gray-100 border border-gray-200 text-[#041619] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              Postes ouverts <span className="bg-white text-[#041619] px-2 py-0.5 rounded-full text-[11px] font-black">{offres.length}</span>
            </div>
            <div className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-full flex items-center gap-2">
              CDI & CDD <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] font-bold">{offres.filter(o => ['CDI', 'CDD'].includes(o.typeContrat)).length}</span>
            </div>
            <div className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-full flex items-center gap-2">
              Stages <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] font-bold">{offres.filter(o => o.typeContrat === 'Stage').length}</span>
            </div>
          </div>

          {/* Titre direct sans séparateur superflu */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black text-[#041619] tracking-tight">
              Opportunités en vogue actuellement
            </h2>
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              Mises à jour en temps réel
            </span>
          </div>

        {offres.length === 0 ? (
            <div className="text-center py-20 bg-[#f8fafc] rounded-[2rem] border border-gray-100 shadow-sm">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-bold text-lg">Aucune offre pour le moment</h3>
            </div>
          ) : (
            <>
              {/* Grille des cartes avec effet Flottant (Soft Shadow) pour casser la découpe */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offres
                  .filter(o => {
                    const matchText = searchQuery === '' || 
                      o.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.competences?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    const matchRegion = regionSelected === 'Toutes régions' ||
                      (o.localisation && o.localisation.toLowerCase().includes(regionSelected.toLowerCase()));

                    return matchText && matchRegion;
                  })
                  .map((offre) => {
                    const nomEntreprise = offre.entreprise || offre.recruteurId?.entreprise || 'Entreprise Partenaire'

                    return (
                      <div 
                        key={offre._id} 
                        className="bg-[#08282d] border border-transparent rounded-[2rem] p-7 shadow-[0_15px_40px_rgba(4,22,25,0.08)] hover:shadow-[0_20px_50px_rgba(4,22,25,0.15)] hover:border-[#00f098]/30 hover:-translate-y-2 transition-all duration-500 flex flex-col group relative overflow-hidden"
                      >
                        {/* Subtil reflet de lumière au survol */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* 🏢 1. EN-TÊTE SANS LE BADGE "VÉRIFIÉE" (Plein espace pour la PME) */}
                        <div className="flex items-center gap-3.5 mb-4 min-w-0">
                          {/* Logo ou Avatar d'initiales de la PME */}
                          <div className="w-12 h-12 rounded-xl bg-[#041619] border border-white/10 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                            {offre.logoUrl ? (
                              <img 
                                src={offre.logoUrl} 
                                alt={nomEntreprise} 
                                className="w-full h-full object-contain rounded-lg"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-[#00f098] font-black text-xs tracking-wider">
                                {nomEntreprise.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-white font-bold text-sm tracking-tight truncate group-hover:text-[#00f098] transition-colors">
                              {nomEntreprise}
                            </h4>
                            <p className="text-gray-400 text-xs mt-0.5 font-medium truncate">
                              {offre.secteur || 'Technologie & Numérique'}
                            </p>
                          </div>
                        </div>

                        {/* 🎯 2. TITRE DU POSTE */}
                        <h3 className="text-lg md:text-xl font-black text-white mb-3 line-clamp-2 leading-snug group-hover:text-[#00f098] transition-colors">
                          {offre.titre}
                        </h3>

                        {/* 🏷️ 3. BADGES DE CATÉGORIE, CONTRAT & MODE DE TRAVAIL */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
                            {offre.secteur || 'Technologies'}
                          </span>
                          <span className="bg-[#041619] border border-white/5 text-[#00f098] text-xs font-bold px-3 py-1.5 rounded-xl">
                            {offre.typeContrat}
                          </span>

                          {/* 🌐 Badge Mode de travail (Sur site, Hybride, Télétravail) */}
                          <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
                            <Laptop className="w-3.5 h-3.5 text-[#00f098]" />
                            {offre.modeTravail || 'Sur site'}
                          </span>

                          {offre.niveauRequis && (
                            <span className="bg-[#041619] border border-white/5 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-xl">
                              {offre.niveauRequis}
                            </span>
                          )}
                        </div>

                        {/* 📊 4. TABLEAU 3 COLONNES OPPORTUNITÉS221 (Localisation, Publication, Rémunération) */}
                        <div className="grid grid-cols-3 gap-3 border-t border-b border-white/5 py-3.5 my-3">
                          
                          {/* Colonne 1 : Localisation (avec retours à la ligne naturels) */}
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                              Localisation
                            </p>
                            <p className="text-xs text-white font-bold leading-tight line-clamp-2">
                              {offre.localisation || 'Sénégal'}
                            </p>
                          </div>

                          {/* Colonne 2 : Date Publication */}
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                              Publication
                            </p>
                            <p className="text-xs text-white font-bold leading-tight">
                              {new Date(offre.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>

                          {/* Colonne 3 : Rémunération (Formatée automatiquement en 450k – 700k FCFA) */}
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                              Rémunération
                            </p>
                            <p className="text-xs text-[#00f098] font-black leading-tight line-clamp-2">
                              {formaterSalaire(offre.salaire)}
                            </p>
                          </div>

                        </div>

                        {/* 🧩 5. COMPÉTENCES CLÉS */}
                        {offre.competences && offre.competences.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {offre.competences.slice(0, 3).map((comp, idx) => (
                              <span key={idx} className="bg-white/5 text-gray-400 text-[11px] px-2.5 py-1 rounded-lg font-medium border border-white/5">
                                {comp}
                              </span>
                            ))}
                            {offre.competences.length > 3 && (
                              <span className="text-gray-500 text-[10px] self-center font-bold">
                                +{offre.competences.length - 3} autres
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-[#00f098] text-xs font-bold mb-6 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Scoring IA disponible
                        </p>

                        {/* 🚀 6. ACTIONS CTA */}
                        <div className="mt-auto flex items-center gap-3 pt-2">
                          <button 
                            onClick={() => navigate(`/offres/${offre._id}`)}
                            className="flex-1 bg-[#041619] border border-white/10 text-white font-bold py-3.5 rounded-xl hover:border-[#00f098]/50 hover:text-[#00f098] transition-colors text-xs cursor-pointer shadow-inner text-center"
                          >
                            Détails
                          </button>
                          <button 
                            onClick={() => handlePostulerCarte(offre._id)}
                            className="flex-1 bg-[#00f098] text-[#041619] font-black py-3.5 rounded-xl hover:bg-[#00d084] transition-colors flex items-center justify-center gap-1.5 text-xs shadow-[0_0_15px_rgba(0,240,152,0.2)] cursor-pointer"
                          >
                            Postuler <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Bouton Noir Massif - Afficher plus d'offres */}
              <div className="flex justify-center mt-16">
                <button className="bg-[#041619] border border-transparent text-white font-bold px-10 py-4 rounded-full hover:bg-[#08282d] hover:border-[#00f098]/30 transition-all shadow-[0_10px_30px_rgba(4,22,25,0.15)] text-sm flex items-center gap-3">
                  Afficher toutes les opportunités
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