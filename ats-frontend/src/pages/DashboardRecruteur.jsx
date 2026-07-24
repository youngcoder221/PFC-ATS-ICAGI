import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function DashboardRecruteur() {
  const { user, logout }      = useAuth()
  const navigate              = useNavigate()
  const [offres, setOffres]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    titre: '', description: '',
    competences: '', niveauRequis: 'Licence', typeContrat: 'Stage'
  })

  // Charger les offres du recruteur
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerOffres()
  }, [])

  const chargerOffres = async () => {
    try {
      const res = await api.get('/offres/mes/offres')
      setOffres(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/offres', {
        ...form,
        competences: form.competences.split(',').map(c => c.trim())
      })
      setShowForm(false)
      setForm({ titre: '', description: '', competences: '', niveauRequis: 'Licence', typeContrat: 'Stage' })
      chargerOffres()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">ATS — Recruteur</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            👋 {user?.prenom} {user?.nom}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mes offres</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            {showForm ? 'Annuler' : '+ Nouvelle offre'}
          </button>
        </div>

        {/* Formulaire nouvelle offre */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Créer une offre</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={e => setForm({...form, titre: e.target.value})}
                  placeholder="ex: Développeur Full Stack JS"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Décrivez le poste..."
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compétences requises <span className="text-gray-400">(séparées par des virgules)</span>
                </label>
                <input
                  type="text"
                  value={form.competences}
                  onChange={e => setForm({...form, competences: e.target.value})}
                  placeholder="React, Node.js, MongoDB, Express"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau requis</label>
                  <select
                    value={form.niveauRequis}
                    onChange={e => setForm({...form, niveauRequis: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Licence</option>
                    <option>Master</option>
                    <option>Ingénieur</option>
                    <option>Doctorat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                  <select
                    value={form.typeContrat}
                    onChange={e => setForm({...form, typeContrat: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Stage</option>
                    <option>CDD</option>
                    <option>CDI</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Créer l'offre
              </button>
            </form>
          </div>
        )}

        {/* Liste des offres */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Chargement...</p>
        ) : offres.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>Aucune offre pour l'instant</p>
            <p className="text-sm mt-1">Cliquez sur "Nouvelle offre" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offres.map(offre => (
              <div key={offre._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{offre.titre}</h3>
                    <p className="text-sm text-gray-500 mt-1">{offre.description}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {offre.competences.map((comp, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      offre.statut === 'ouverte'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {offre.statut}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">{offre.typeContrat} · {offre.niveauRequis}</p>
                  </div>
                </div>
                {/* Bouton voir ranking */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/ranking/${offre._id}`)}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    Voir le ranking des candidats →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}