import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import logoSmall from '../assets/logo-icon-small.png'
import logoFull from '../assets/logo-icon-full.png'

export default function Login() {
  const [form, setForm]       = useState({ email: '', motDePasse: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [erreur, setErreur]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      const res  = await api.post('/auth/connexion', form)
      const user = res.data.user
      login(user, res.data.token)

      // Redirection automatique selon le rôle
      if (user.role === 'recruteur')  navigate('/recruteur')
      else if (user.role === 'candidat') navigate('/candidat')
      else navigate('/admin')

    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col">

      {/* Topbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800/50 bg-[#0a0c12]">
        <div className="flex items-center gap-3">
          <img
            src={logoSmall}
            alt="ATS Platform"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-semibold text-sm">ATS Platform</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>
      </nav>

      {/* Contenu */}
      <div className="flex flex-1">

        {/* Panneau gauche */}
        <div className="hidden lg:flex w-[42%] flex-col justify-center p-12 relative overflow-hidden border-r border-gray-800/50">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-900/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-900/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10">
            <img
              src={logoFull}
              alt="ATS Platform"
              className="w-20 h-20 object-contain mb-6"
            />
            <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/50 rounded-full px-3 py-1 text-indigo-300 text-xs mb-6">
              ✨ IA intégrée
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight mb-3">
              Bienvenue sur<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                ATS Platform
              </span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Système intelligent de gestion des candidatures pour les PME africaines.
            </p>

            <div className="space-y-4">
              {[
                { icon: '🤖', text: 'Analyse IA des CV automatique'       },
                { icon: '📊', text: 'Score de pertinence 0–100'           },
                { icon: '🏆', text: 'Ranking en temps réel des candidats' },
                { icon: '🔒', text: 'Accès sécurisé par rôle'            },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800/60 border border-gray-700/50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-gray-400 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0c12]">
          <div className="w-full max-w-sm">

            <h1 className="text-xl font-semibold text-white mb-1">Connexion</h1>
            <p className="text-gray-500 text-sm mb-6">
              Entrez vos identifiants pour accéder à votre espace
            </p>

            {erreur && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="exemple@email.com"
                    required
                    className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-gray-400">Mot de passe</label>
                  <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">
                    Mot de passe oublié ?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.motDePasse}
                    onChange={e => setForm({...form, motDePasse: e.target.value})}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-10 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : 'Se connecter'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-600 text-xs">ou</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Créer un compte candidat
              </Link>
            </p>

            <div className="mt-5 bg-gray-900/50 border border-gray-800 rounded-xl p-3">
              <p className="text-gray-500 text-xs text-center leading-relaxed">
                Le système détecte automatiquement votre rôle et vous redirige vers votre espace — aucune sélection nécessaire.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}