/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Users, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react'
import api from '../services/api'

export default function Ranking() {
  const { offreId }           = useParams()
  const navigate              = useNavigate()
  const [ranking, setRanking] = useState([])
  const [offre, setOffre]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [raisonsOuvertes, setRaisonsOuvertes] = useState({})

  const toggleRaison = (id) => {
    setRaisonsOuvertes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerRanking()
    chargerOffre()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const chargerRanking = async () => {
    try {
      const res = await api.get(`/cv/ranking/${offreId}`)
      setRanking(res.data.ranking)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const chargerOffre = async () => {
    try {
      const res = await api.get(`/offres/${offreId}`)
      setOffre(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const scoreColor = (s) => s >= 75 ? 'text-green-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'
  const scoreBar   = (s) => s >= 75 ? 'bg-green-500' : s >= 50 ? 'bg-amber-500' : 'bg-red-500'
  const scoreBg    = (s) => s >= 75 ? 'bg-green-900/20 border-green-700' : s >= 50 ? 'bg-amber-900/20 border-amber-700' : 'bg-red-900/20 border-red-700'

  const rangBadge = (i) => {
    if (i === 0) return { bg: 'bg-yellow-500', text: '🥇' }
    if (i === 1) return { bg: 'bg-gray-400',   text: '🥈' }
    if (i === 2) return { bg: 'bg-amber-600',  text: '🥉' }
    return { bg: 'bg-gray-700', text: `#${i + 1}` }
  }

  const scoreTotal = ranking.length > 0
    ? Math.round(ranking.reduce((a, c) => a + c.score, 0) / ranking.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-950 p-8">

      {/* Bouton retour */}
      <button
        onClick={() => navigate('/recruteur')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux offres
      </button>

      {/* Header offre */}
      {offre && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{offre.titre}</h1>
          <p className="text-gray-400 text-sm">{offre.typeContrat} · {offre.niveauRequis}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {offre.competences.map((c, i) => (
              <span key={i} className="text-xs bg-indigo-900/30 border border-indigo-700 text-indigo-400 px-2.5 py-1 rounded-lg">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Candidatures',  value: ranking.length,                                    icon: Users,      color: 'text-indigo-400' },
          { label: 'Score ≥ 75%',   value: ranking.filter(c => c.score >= 75).length,         icon: TrendingUp, color: 'text-green-400'  },
          { label: 'Score moyen',   value: `${scoreTotal}%`,                                  icon: Trophy,     color: 'text-amber-400'  },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tableau ranking */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-white font-semibold">Classement des candidats</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-16">Chargement...</p>
        ) : ranking.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">Aucune candidature pour cette offre</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {ranking.map((candidature, index) => {
              const badge = rangBadge(index)
              const estOuvert = !!raisonsOuvertes[candidature._id]
              return (
                <div key={candidature._id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-800/50 transition-all">

                  {/* Rang */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${badge.bg} text-white`}>
                    {badge.text}
                  </div>

                  {/* Avatar initiales */}
                  <div className="w-9 h-9 bg-indigo-900/50 border border-indigo-700 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                    {candidature.candidatId?.prenom?.[0]}{candidature.candidatId?.nom?.[0]}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">
                      {candidature.candidatId?.prenom} {candidature.candidatId?.nom}
                    </p>
                    <p className="text-gray-500 text-xs">{candidature.candidatId?.email}</p>
                    <p className={`text-gray-400 text-xs mt-1 ${estOuvert ? '' : 'truncate'}`}>
                      {candidature.raisons}
                    </p>
                    {candidature.raisons && candidature.raisons.length > 60 && (
                      <button
                        onClick={() => toggleRaison(candidature._id)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        {estOuvert ? 'Voir moins' : 'Voir plus'}
                      </button>
                    )}
                    <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${scoreBar(candidature.score)}`}
                        style={{ width: `${candidature.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className={`px-3 py-2 rounded-xl border text-sm font-bold flex-shrink-0 ${scoreBg(candidature.score)} ${scoreColor(candidature.score)}`}>
                    {candidature.score}/100
                  </div>

                  {/* Statut */}
                  <select
                    value={candidature.statut}
                    onChange={async (e) => {
                      try {
                        await api.put(`/cv/candidatures/${candidature._id}/statut`, { statut: e.target.value })
                        chargerRanking()
                      } catch (err) {
                        console.error(err)
                      }
                    }}
                    className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="retenu">Retenu ✓</option>
                    <option value="refusé">Refusé</option>
                  </select>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
