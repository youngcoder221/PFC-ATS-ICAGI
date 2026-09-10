import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, FileText, ChevronRight, Zap, Trophy, Shield } from 'lucide-react'
import logo from '../assets/logo-icon-small.png'


export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col">

      {/* ── TOPBAR ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800/50 bg-[#0a0c12] sticky top-0 z-50 backdrop-blur-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={logo}
            alt="ATS Platform"
            className="w-8 h-8 object-contain group-hover:opacity-90 transition-opacity"
          />
          <span className="text-white font-semibold text-sm">ATS Platform</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {['Fonctionnalités', 'Comment ça marche', 'À propos'].map(item => (
            <span key={item} className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-300 text-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 hover:text-white transition-all"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-white text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 transition-all shadow-lg"
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">

        {/* Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 rounded-full px-4 py-1.5 text-indigo-300 text-xs mb-6">
          <Zap className="w-3 h-3" />
          Propulsé par l'Intelligence Artificielle
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5 max-w-2xl">
          Recrutez plus vite,{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            recrutez intelligemment
          </span>
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-xl">
          Analysez les CV automatiquement, classez vos candidats par score de pertinence et prenez les meilleures décisions de recrutement en quelques secondes.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
            <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
            >
                Postuler à une offre
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-800/50">
          {[
            { value: '100%', label: 'Analyse automatique' },
            { value: '0–100', label: 'Score de pertinence' },
            { value: '3 rôles', label: 'Candidat · Recruteur · Admin' },
            { value: 'IA', label: 'Powered by Gemini' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
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