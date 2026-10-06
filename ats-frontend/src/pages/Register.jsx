import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Briefcase, Users, Shield } from 'lucide-react'
import api from '../services/api'

const roles = [
  {
    key: 'candidat',
    label: 'Candidat',
    icon: Users,
    color: 'from-indigo-600 to-indigo-800',
    description: 'Je cherche un emploi ou un stage',
  },
  {
    key: 'recruteur',
    label: 'Recruteur',
    icon: Briefcase,
    color: 'from-teal-600 to-teal-800',
    description: 'Je recrute des candidats',
  },
]

export default function Register() {
  const [roleActif, setRoleActif] = useState('candidat')
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    motDePasse: '', confirmer: '', poste: ''
  })
  const [showPwd, setShowPwd]   = useState(false)
  const [erreur, setErreur]     = useState('')
  const [succes, setSucces]     = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const role = roles.find(r => r.key === roleActif)
  const Icon = role.icon

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')

    if (form.motDePasse !== form.confirmer) {
      return setErreur('❌ Les mots de passe ne correspondent pas')
    }
    if (form.motDePasse.length < 6) {
      return setErreur('❌ Mot de passe trop court (minimum 6 caractères)')
    }

    setLoading(true)
    try {
      await api.post('/auth/inscription', {
        nom:        form.nom,
        prenom:     form.prenom,
        email:      form.email,
        motDePasse: form.motDePasse,
        role:       roleActif,
        poste:      form.poste || null,
      })
      setSucces('✅ Compte créé avec succès ! Redirection...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} mb-4 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
          <p className="text-gray-400 mt-1 text-sm">Rejoignez la plateforme ATS</p>
        </div>

        {/* Sélecteur rôle */}
        <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {roles.map(r => {
            const RIcon = r.icon
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => { setRoleActif(r.key); setErreur('') }}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-xs font-medium transition-all ${
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

        {/* Description rôle */}
        <p className="text-center text-gray-500 text-xs mb-4">{role.description}</p>

        {/* Carte formulaire */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">

          {/* Messages */}
          {erreur && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {erreur}
            </div>
          )}
          {succes && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {succes}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nom + Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Diallo"
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Ibrahima"
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Poste — recruteur uniquement */}
            {roleActif === 'recruteur' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Poste occupé</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="poste"
                    value={form.poste}
                    onChange={handleChange}
                    placeholder="ex: Directeur RH"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="motDePasse"
                  value={form.motDePasse}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-10 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="confirmer"
                  value={form.confirmer}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={`w-full bg-gray-800 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    form.confirmer && form.motDePasse !== form.confirmer
                      ? 'border-red-700'
                      : 'border-gray-700'
                  }`}
                />
              </div>
              {form.confirmer && form.motDePasse !== form.confirmer && (
                <p className="text-red-400 text-xs mt-1">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${role.color} text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg disabled:opacity-50 mt-2`}
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Lien login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-indigo-400 font-medium hover:underline">
              Se connecter
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