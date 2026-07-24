import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, Users, Briefcase, Shield } from 'lucide-react'
import api from '../services/api'

const roles = [
  {
    key: 'candidat',
    label: 'Candidat',
    icon: Users,
    color: 'from-indigo-550 to-indigo-800',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-600',
    placeholder: 'candidat@email.com',
    description: 'Postulez aux offres disponibles',
  },
  {
    key: 'recruteur',
    label: 'Recruteur',
    icon: Briefcase,
    color: 'from-teal-600 to-teal-800',
    borderColor: 'border-teal-500',
    textColor: 'text-teal-600',
    placeholder: 'recruteur@entreprise.com',
    description: 'Gérez vos offres et candidats',
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: Shield,
    color: 'from-purple-600 to-purple-900',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
    placeholder: 'admin@ats.com',
    description: 'Accès complet à la plateforme',
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
      const res = await api.post('/auth/connexion', form)
      const user = res.data.user

      if (user.role !== roleActif) {
        setErreur(`❌ Ce compte est un ${user.role}, pas un ${roleActif}`)
        setLoading(false)
        return
      }

      login(user, res.data.token)

      if (user.role === 'recruteur') navigate('/recruteur')
      else if (user.role === 'candidat') navigate('/candidat')
      else if (user.role === 'admin') navigate('/admin')

    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} mb-4 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ATS</h1>
          <p className="text-gray-400 mt-1 text-sm">Système de gestion des candidatures</p>
        </div>

        {/* Sélecteur de rôle */}
        <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {roles.map(r => {
            const RIcon = r.icon
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => { setRoleActif(r.key); setErreur('') }}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  roleActif === r.key
                    ? `bg-gradient-to-br ${r.color} text-white shadow-md`
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <RIcon className="w-4 h-4" />
                {r.label}
              </button>
            )
          })}
        </div>

        {/* Carte formulaire */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <p className="text-gray-400 text-sm text-center mb-6">{role.description}</p>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder={role.placeholder}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.motDePasse}
                  onChange={e => setForm({...form, motDePasse: e.target.value})}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-10 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${role.color} text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg disabled:opacity-50 mt-2`}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className={`${role.textColor} font-medium hover:underline`}>
              S'inscrire
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          ATS — Système de gestion des candidatures © 2026
        </p>
      </div>
    </div>
  )
}