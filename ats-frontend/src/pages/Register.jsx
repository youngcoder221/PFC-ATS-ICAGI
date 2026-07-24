import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    motDePasse: '', role: 'candidat', poste: ''
  })
  const [erreur,   setErreur]   = useState('')
  const [succes,   setSucces]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate                = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    setSucces('')
    try {
      await api.post('/auth/inscription', form)
      setSucces('✅ Compte créé ! Redirection...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">ATS</h1>
          <p className="text-gray-500 mt-1">Créer un compte</p>
        </div>

        {/* Messages */}
        {erreur && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {erreur}
          </div>
        )}
        {succes && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {succes}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Rôle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {['candidat', 'recruteur'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({...form, role: r})}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  form.role === r
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                {r === 'candidat' ? '👤 Candidat' : '🏢 Recruteur'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Diallo"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Ibrahima"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Poste — uniquement pour recruteur */}
          {form.role === 'recruteur' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste occupé</label>
              <input
                type="text"
                name="poste"
                value={form.poste}
                onChange={handleChange}
                placeholder="ex: Directeur RH"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        {/* Lien connexion */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}