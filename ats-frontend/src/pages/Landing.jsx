import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, ChevronRight, Users, FileText, Shield } from 'lucide-react'
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

      {/* ── FEATURES ── */}
      <section className="px-8 py-16 bg-[#0a0c12] border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Une plateforme complète pour gérer vos recrutements de A à Z
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '🤖',
                color: 'bg-indigo-900/20 border-indigo-800/50',
                iconBg: 'bg-indigo-900/40',
                title: 'Analyse IA des CV',
                desc: 'Extraction automatique des compétences et calcul du score de correspondance avec le poste.',
              },
              {
                icon: '🏆',
                color: 'bg-teal-900/20 border-teal-800/50',
                iconBg: 'bg-teal-900/40',
                title: 'Ranking automatique',
                desc: 'Les candidats sont classés du plus pertinent au moins pertinent en temps réel.',
              },
              {
                icon: '📊',
                color: 'bg-purple-900/20 border-purple-800/50',
                iconBg: 'bg-purple-900/40',
                title: 'Score expliqué',
                desc: 'Chaque candidat reçoit un score détaillé avec les raisons de son positionnement.',
              },
              {
                icon: '🔒',
                color: 'bg-amber-900/20 border-amber-800/50',
                iconBg: 'bg-amber-900/40',
                title: 'Accès sécurisé',
                desc: 'Trois niveaux d\'accès distincts : candidat, recruteur et administrateur.',
              },
              {
                icon: '📄',
                color: 'bg-green-900/20 border-green-800/50',
                iconBg: 'bg-green-900/40',
                title: 'Upload de CV',
                desc: 'Déposez votre CV en PDF et recevez immédiatement votre score de correspondance.',
              },
              {
                icon: '🏢',
                color: 'bg-rose-900/20 border-rose-800/50',
                iconBg: 'bg-rose-900/40',
                title: 'Pour les PME',
                desc: 'Interface simple et accessible, conçue pour les entreprises sans équipe RH dédiée.',
              },
            ].map((f, i) => (
              <div key={i} className={`border rounded-xl p-5 ${f.color}`}>
                <div className={`w-9 h-9 ${f.iconBg} rounded-lg flex items-center justify-center text-lg mb-3`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-medium text-sm mb-2">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="px-8 py-16 bg-[#080a0f]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            Simple, rapide et efficace
          </p>

          <div className="grid grid-cols-2 gap-8">
            {/* Candidat */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-indigo-900/40 border border-indigo-700 rounded-lg flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <h3 className="text-white font-medium text-sm">Pour les candidats</h3>
              </div>
              {[
                { num: '01', text: 'Créez votre compte gratuitement'      },
                { num: '02', text: 'Parcourez les offres disponibles'      },
                { num: '03', text: 'Déposez votre CV en PDF'              },
                { num: '04', text: 'Recevez votre score et suivez votre candidature' },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <span className="text-indigo-600 font-bold text-xs mt-0.5 flex-shrink-0">{s.num}</span>
                  <p className="text-gray-400 text-sm">{s.text}</p>
                </div>
              ))}
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all mt-2"
              >
                Créer mon compte <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Recruteur */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-teal-900/40 border border-teal-700 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <h3 className="text-white font-medium text-sm">Pour les recruteurs</h3>
              </div>
              {[
                { num: '01', text: 'Créez votre compte recruteur'         },
                { num: '02', text: 'Publiez vos offres d\'emploi'         },
                { num: '03', text: 'Définissez les critères du poste'     },
                { num: '04', text: 'Consultez le ranking IA des candidats' },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <span className="text-teal-600 font-bold text-xs mt-0.5 flex-shrink-0">{s.num}</span>
                  <p className="text-gray-400 text-sm">{s.text}</p>
                </div>
              ))}
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all mt-2"
              >
                Accéder à l'espace recruteur <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-8 py-14 bg-[#0a0c12] border-t border-gray-800/50">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Prêt à optimiser votre recrutement ?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Rejoignez les entreprises qui recrutent intelligemment avec ATS Platform.
          </p>
          <div className="flex justify-center">
            <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
            >
                Commencer gratuitement
            </button>
        </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-8 py-5 border-t border-gray-800/50 bg-[#080a0f]">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-md flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-500 text-xs">ATS Platform © 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="w-3.5 h-3.5 text-gray-600" />
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-600 text-xs">Système de gestion des candidatures</span>
          </div>
        </div>
      </footer>

    </div>
  )
}