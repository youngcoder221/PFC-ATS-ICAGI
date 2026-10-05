import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, ChevronRight, Check, Bookmark, ArrowUpRight, ArrowRight,  Bot, Phone, Mail } from 'lucide-react'
import logo from '../assets/logo-icon-small.png'
import api from '../services/api'

export default function Landing() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [offres, setOffres] = useState([])

  // Chargement des offres au montage de la page
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await api.get('/offres')
        // On ne garde que les offres ouvertes
        setOffres(res.data.filter(o => o.statut === 'ouverte'))
      } catch (err) {
        console.error("Erreur chargement offres:", err)
      }
    }
    fetchOffres()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ── TOPBAR ── */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logo}
            alt="ATS Platform"
            className="w-8 h-8 object-contain"
          />
          <span className="text-gray-900 font-bold text-lg tracking-tight">ATS <span className="text-indigo-600">Sénégal</span></span>
        </button>

        {/* Liens Centraux */}
        <div className="hidden md:flex items-center gap-8">
          <span className="text-gray-600 font-medium hover:text-indigo-600 transition-colors cursor-pointer">
            Offres d'emploi
          </span>
          <span onClick={() => navigate('/candidat')} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors cursor-pointer">
            Suivre ma candidature
          </span>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 font-medium text-sm px-4 py-2 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-all"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-md"
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* ── HERO EXACTEMENT COMME OPP221 ── */}
      <section 
        className="relative flex flex-col px-6 py-20 md:py-32 min-h-[650px] justify-center"
        style={{
          // Dégradé sombre à gauche, transparent à droite sur l'image
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Ligne jaune + Titre */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-8 bg-yellow-400"></div>
            <span className="text-white font-bold text-xs tracking-widest uppercase">Carrières au Sénégal</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-white mb-6 tracking-tight leading-[1.1] max-w-4xl">
            Votre prochaine <br className="hidden md:block"/> opportunité, <span className="text-yellow-400">vérifiée à <br className="hidden md:block"/> la source.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl font-light">
            Trouvez des emplois, stages, concours et bourses au Sénégal, en Afrique et à l'international.
          </p>

          {/* Boutons Hero */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-[#0f172a] px-8 py-3.5 rounded-lg font-bold transition-all text-sm">
              Explorer les offres
            </button>
            <div className="text-sm border-l border-gray-600 pl-4">
              <p className="text-white font-bold">Vérifié le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
              <p className="text-gray-400">mise à jour quotidienne</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-[#0f172a] px-6 py-3.5 rounded-lg font-bold transition-all text-sm">
              Améliorer mon CV avec l'IA
            </button>
            <button className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 px-6 py-3.5 rounded-lg font-bold transition-all text-sm">
              Assistant emploi IA
            </button>
          </div>

          {/* Compteurs bas du Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-700/50 max-w-4xl">
            <div>
              <p className="text-4xl font-black text-white mb-1">654</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">opportunités actives</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-1">358</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">organisations</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-1">43</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">stages disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LISTE DES OFFRES ── */}
      <main className="flex-1 w-full bg-[#f8f9fa] pt-16 pb-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* En-tête de section */}
          <div className="mb-10">
            <p className="text-[#059669] font-bold text-xs tracking-widest uppercase mb-3">Sélection du jour</p>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-4xl font-extrabold text-[#0f172a] max-w-2xl leading-tight">
                Des opportunités sérieuses, prêtes à consulter
              </h2>
              <p className="text-gray-500 max-w-md text-sm">
                Utilisez la recherche et les filtres pour trouver rapidement les opportunités qui correspondent à votre profil et à vos ambitions.
              </p>
            </div>
          </div>

          {/* Pilules de filtres */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm font-bold">
            <button className="bg-[#0f172a] text-white px-6 py-3.5 rounded-2xl flex items-center gap-3">
              Emplois vérifiés <span className="bg-white text-[#0f172a] px-2 py-0.5 rounded-full text-xs">584</span>
            </button>
            <button className="bg-transparent text-gray-500 hover:text-gray-900 px-4 py-3 flex items-center gap-3 transition-colors">
              Sources LinkedIn <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">515</span>
            </button>
            <button className="bg-transparent text-gray-500 hover:text-gray-900 px-4 py-3 flex items-center gap-3 transition-colors">
              Stages <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">43</span>
            </button>
          </div>

          {/* Barre de recherche intégrée */}
          <div className="bg-white border border-gray-200 rounded-2xl p-3 mb-12 shadow-sm flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus-within:border-indigo-500 transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Poste, entreprise, compétence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-700 font-medium"
              />
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-[#0f172a] font-bold px-8 py-4 rounded-xl w-full md:w-auto transition-colors text-sm">
              Réinitialiser
            </button>
          </div>

          {offres.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-bold text-lg">Aucune offre pour le moment</h3>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offres
              .filter(o => 
                searchQuery === '' || 
                o.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.competences.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((offre) => {
              // Couleurs des badges de contrat (Thème clair)
              const typeColors = {
                'Stage': 'bg-blue-50 text-blue-700 border-blue-200',
                'CDI': 'bg-green-50 text-green-700 border-green-200',
                'CDD': 'bg-amber-50 text-amber-700 border-amber-200',
                'Freelance': 'bg-purple-50 text-purple-700 border-purple-200',
              }

              return (
                <div key={offre._id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  
                  {/* En-tête : Entreprise & Badge Vérifié */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-gray-500 font-bold text-xs tracking-widest uppercase">{offre.recruteurId?.entreprise || 'Confidentiel'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded text-xs font-bold">
                      <Check className="w-3.5 h-3.5" /> Vérifiée
                    </div>
                  </div>

                  {/* Titre du poste */}
                  <h3 className="text-xl font-black text-[#0f172a] mb-5 line-clamp-2 leading-tight">
                    {offre.titre}
                  </h3>

                  {/* Pilules Grises */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-[#f1f5f9] text-gray-700 text-xs font-bold px-3.5 py-2 rounded-lg">
                      {offre.secteur || 'Technologies'}
                    </span>
                    <span className="bg-[#f1f5f9] text-gray-700 text-xs font-bold px-3.5 py-2 rounded-lg">
                      {offre.typeContrat}
                    </span>
                  </div>

                  {/* Ligne Séparatrice & Méta-données */}
                  <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 mb-5">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Localisation</p>
                      <p className="text-xs text-gray-900 font-bold">{offre.localisation || 'Sénégal'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Publication</p>
                      <p className="text-xs text-gray-900 font-bold">
                        {new Date(offre.createdAt).toLocaleDateString('fr-FR', {day: '2-digit', month:'short', year:'numeric'})}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date limite</p>
                      <p className="text-xs text-gray-900 font-bold">Non précisée</p>
                    </div>
                  </div>

                  {/* Description courte */}
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {offre.description}
                  </p>

                  <p className="text-emerald-600 text-xs font-bold mb-8">
                    {offre.emailContact ? `E-mail publié : ${offre.emailContact}` : 'Aucun e-mail public · candidature via le lien'}
                  </p>

                  {/* Boutons d'action (Voir détails + Ecrire/Postuler + Favori) */}
                  <div className="mt-auto flex items-center gap-3">
                    <button 
                      onClick={() => navigate('/login')}
                      className="flex-1 bg-white border border-gray-200 text-[#0f172a] font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Voir les détails
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="flex-1 bg-[#0f172a] text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      {offre.emailContact ? 'Écrire' : 'Postuler'} <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-[#0f172a] hover:bg-gray-50 transition-colors flex-shrink-0">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          
             {/* Bouton Noir Massif - Afficher plus d'offres */}
            <div className="flex justify-center mt-14">
              <button className="bg-[#0f172a] text-white font-bold px-12 py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-xl text-lg flex items-center gap-3">
                Afficher plus d'offres (575)
              </button>
            </div>
          </>
        )}
        </div>
      </main>

      {/* ── SECTION IA (Votre carrière, mieux préparée) ── */}
      <section className="bg-[#020817] pt-24 pb-28 px-6 relative border-t-8 border-[#0f172a]">
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-yellow-500 font-bold text-xs tracking-widest uppercase mb-4">Votre carrière, mieux préparée</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight max-w-3xl">
            Des assistants IA pour passer à l'action
          </h2>
          <p className="text-gray-400 text-lg mb-16 max-w-2xl font-light">
            Préparez un CV plus convaincant, organisez votre recherche d'emploi ou échangez avec ATS Sénégal pour un partenariat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte CV */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-8 flex flex-col hover:border-gray-600 transition-colors">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-[#0f172a] text-xl mb-8">
                CV
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Rendre mon CV plus professionnel</h3>
              <p className="text-gray-400 mb-12 font-light">
                Améliorez la structure, les formulations et l'impact de votre CV avec l'assistance de l'IA.
              </p>
              <button className="mt-auto w-full bg-white text-[#0f172a] font-bold py-4 px-6 rounded-2xl flex justify-between items-center hover:bg-gray-100 transition-colors">
                Améliorer mon CV avec l'IA <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Carte IA */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-8 flex flex-col hover:border-gray-600 transition-colors">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-[#0f172a] text-xl mb-8">
                IA
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Assistant recherche d'emploi</h3>
              <p className="text-gray-400 mb-12 font-light">
                Clarifiez votre cible, organisez vos démarches et préparez des candidatures adaptées à votre profil.
              </p>
              <button className="mt-auto w-full bg-white text-[#0f172a] font-bold py-4 px-6 rounded-2xl flex justify-between items-center hover:bg-gray-100 transition-colors">
                Lancer mon assistant emploi <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Carte Partenariat */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-8 flex flex-col hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 bg-[#10b981] rounded-2xl flex items-center justify-center font-black text-white text-xl mb-8">
                W
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Partenariats entreprises</h3>
              <p className="text-gray-400 mb-12 font-light">
                Vous souhaitez diffuser des opportunités ou développer un partenariat avec ATS Sénégal ?
              </p>
              <button className="mt-auto w-full bg-[#10b981] text-white font-bold py-4 px-6 rounded-2xl flex justify-between items-center hover:bg-[#059669] transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Contacter le +221 78 436 36 64
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER OPPORTUNITES 221 ── */}
      <footer className="bg-white border-t-8 border-[#0f172a] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo ATS" className="w-14 h-14" />
            <p className="text-gray-500 text-sm max-w-xs font-medium leading-relaxed">
              Les opportunités qui font avancer votre carrière.
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[#0f172a] font-bold text-sm hover:text-indigo-600 cursor-pointer transition-colors">
              Suivre ATS Sénégal sur LinkedIn <span className="text-gray-300 font-normal mx-2">·</span> Confidentialité
            </p>
          </div>
        </div>
      </footer>
      
      {/* Flottant WhatsApp (Bonus Op221) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 px-5 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-transform hover:scale-105">
          <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-[10px]">W</div>
          Partenariat entreprise
        </button>
      </div>

    </div>
  )
}