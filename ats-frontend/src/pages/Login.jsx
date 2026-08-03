import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, Users, Briefcase, Shield } from 'lucide-react'
import api from '../services/api'

const roles = [
  {
    key:         'candidat',
    label:       'Candidat',
    icon:        Users,
    gradient:    'from-indigo-600 to-violet-600',
    active:      'bg-indigo-900/40 text-indigo-300 border-indigo-700',
    btn:         'from-indigo-600 to-violet-600',
    placeholder: 'candidat@email.com',
  },
  {
    key:         'recruteur',
    label:       'Recruteur',
    icon:        Briefcase,
    gradient:    'from-teal-600 to-emerald-600',
    active:      'bg-teal-900/40 text-teal-300 border-teal-700',
    btn:         'from-teal-600 to-emerald-600',
    placeholder: 'recruteur@entreprise.com',
  },
  {
    key:         'admin',
    label:       'Admin',
    icon:        Shield,
    gradient:    'from-purple-600 to-violet-800',
    active:      'bg-purple-900/40 text-purple-300 border-purple-700',
    btn:         'from-purple-600 to-violet-800',
    placeholder: 'admin@ats.com',
  },
]

export default function Login() {
  const [roleActif, setRoleActif] = useState('candidat')
  const [form, setForm]           = useState({ email: '', motDePasse: '' })
  const [showPwd, setShowPwd]     = useState(false)
  const [erreur, setErreur]       = useState('')
  const [loading, setLoading]     = useState(false)
  const { login }                 = useAuth()
  const navigate                  = useNavigate()

  const role = roles.find(r => r.key === roleActif)
  const Icon = role.icon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      const res  = await api.post('/auth/connexion', form)
      const user = res.data.user

      if (user.role !== roleActif) {
        setErreur(`Ce compte est un "${user.role}", pas un "${roleActif}"`)
        setLoading(false)
        return
      }

      login(user, res.data.token)
      if (user.role === 'recruteur') navigate('/recruteur')
      else if (user.role === 'candidat') navigate('/candidat')
      else navigate('/admin')

    } catch (err) {
      setErreur(err.response?.data?.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080a0f] flex">

      {/* ── PANNEAU GAUCHE ── */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-10 relative overflow-hidden">

        {/* Fond animé */}
        <div className="absolute inset-0 bg-[#080a0f]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-900/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Contenu */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">ATS Platform</span>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-semibold text-white leading-tight mb-4">
            Gérez vos recrutements<br />
            <span className="text-indigo-400">intelligemment</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Analysez les CV automatiquement, classez les candidats par score et prenez les meilleures décisions de recrutement.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '🤖', text: 'Analyse IA des CV en quelques secondes'         },
              { icon: '📊', text: 'Score de pertinence automatique 0–100'           },
              { icon: '🏆', text: 'Classement en temps réel des candidats'          },
              { icon: '🏢', text: 'Conçu pour les PME et startups africaines'       },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800/60 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-gray-400 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer gauche */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            {[
              { label: 'Candidats', color: 'bg-indigo-500' },
              { label: 'Recruteurs', color: 'bg-teal-500'  },
              { label: 'Admins',    color: 'bg-purple-500' },
            ].map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
                {b.label}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs">ATS Platform © 2026 — Système de gestion des candidatures</p>
        </div>
      </div>

      {/* ── PANNEAU DROIT ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0c12]">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">ATS Platform</span>
          </div>

          {/* Titre formulaire */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Bon retour</h2>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace</p>
          </div>

          {/* Sélecteur de rôle */}
          <div className="flex gap-1.5 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
            {roles.map(r => {
              const RIcon = r.icon
              const isActive = roleActif === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => { setRoleActif(r.key); setErreur('') }}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                    isActive ? r.active : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  <RIcon className="w-4 h-4" />
                  {r.label}
                </button>
              )
            })}
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {erreur}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
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
                  placeholder={role.placeholder}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
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

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${role.btn} text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg mt-2`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                `Se connecter en tant que ${role.label}`
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-600 text-xs">ou</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Lien inscription */}
          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Créer un compte
            </Link>
          </p>

          {/* Info candidat */}
          {roleActif === 'candidat' && (
            <div className="mt-4 bg-indigo-900/20 border border-indigo-800/50 rounded-xl p-3">
              <p className="text-indigo-300 text-xs text-center">
                Candidat ? Inscrivez-vous gratuitement pour postuler aux offres disponibles.
              </p>
            </div>
          )}

          {/* Info recruteur */}
          {roleActif === 'recruteur' && (
            <div className="mt-4 bg-teal-900/20 border border-teal-800/50 rounded-xl p-3">
              <p className="text-teal-300 text-xs text-center">
                Espace recruteur — accès sur inscription validée par l'administrateur.
              </p>
            </div>
          )}

          {/* Info admin */}
          {roleActif === 'admin' && (
            <div className="mt-4 bg-purple-900/20 border border-purple-800/50 rounded-xl p-3">
              <p className="text-purple-300 text-xs text-center">
                Accès administrateur restreint — compte créé en base de données uniquement.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}