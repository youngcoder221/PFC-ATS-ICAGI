import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, ChevronRight } from 'lucide-react'
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

      {/* ── HERO ── */}
      <section 
        className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32"
        style={{
          // Image de fond libre de droits (bureau/professionnel) avec un overlay noir
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.8)), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 w-full max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Trouvez l'emploi idéal au <span className="text-indigo-400">Sénégal</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Découvrez les meilleures offres d'emploi, de stages et de CDD/CDI. Postulez en un clic et laissez notre IA valoriser votre CV auprès des recruteurs.
          </p>

          {/* Barre de Recherche intégrée au Hero */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 md:py-0 border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-colors">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Quel poste recherchez-vous ? (ex: Développeur, Comptable...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2">
              Rechercher
            </button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-300">
            <span>Recherches populaires :</span>
            <span className="cursor-pointer hover:text-white underline decoration-gray-500 underline-offset-4">Développeur Web</span>
            <span className="cursor-pointer hover:text-white underline decoration-gray-500 underline-offset-4">Marketing</span>
            <span className="cursor-pointer hover:text-white underline decoration-gray-500 underline-offset-4">Ressources Humaines</span>
          </div>
        </div>
      </section>

      {/* ── LISTE DES OFFRES (Style Jobboard) ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dernières offres d'emploi</h2>
            <p className="text-gray-500 text-sm mt-1">
              {offres.length} opportunité(s) disponible(s) en ce moment
            </p>
          </div>
        </div>

        {offres.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium text-lg">Aucune offre pour le moment</h3>
            <p className="text-gray-500 text-sm mt-1">Revenez un peu plus tard pour découvrir de nouvelles opportunités.</p>
          </div>
        ) : (
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
                <div key={offre._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col">
                  {/* Entreprise & Badge contrat */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {offre.recruteurId?.entreprise || 'Entreprise Partenaire'}
                        </h4>
                        <p className="text-xs text-gray-500">{new Date(offre.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Titre du poste */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {offre.titre}
                  </h3>

                  {/* Infos (Localisation & Contrat) */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> 
                      {offre.localisation || 'Dakar, Sénégal'}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-md ${typeColors[offre.typeContrat] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {offre.typeContrat}
                    </span>
                  </div>

                  {/* Compétences limitées à 3 */}
                  <div className="flex gap-2 flex-wrap mb-6 mt-auto">
                    {offre.competences?.slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        {c}
                      </span>
                    ))}
                    {offre.competences?.length > 3 && (
                      <span className="text-[11px] font-medium text-gray-500 py-1">
                        +{offre.competences.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-indigo-600 text-gray-700 hover:text-white border border-gray-200 hover:border-indigo-600 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    Voir l'offre <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── FOOTER CLAIR ── */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-6 h-6 grayscale opacity-60" />
            <span className="text-gray-500 text-sm font-medium">ATS Sénégal © 2026. Tous droits réservés.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm hover:text-indigo-600 cursor-pointer transition-colors">Mentions légales</span>
            <span className="text-gray-500 text-sm hover:text-indigo-600 cursor-pointer transition-colors">Politique de confidentialité</span>
            <span className="text-gray-500 text-sm hover:text-indigo-600 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>

    </div>
  )
}