/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Users, TrendingUp, CheckCircle, Clock, XCircle, Calendar, Download } from 'lucide-react'
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

  // Fonction pour appeler la route protégée et forcer le téléchargement du PDF
  const handleDownloadCV = async (cvId, nomFichier) => {
    try {
      const res = await api.get(`/cv/download/${cvId}`, {
        responseType: 'blob' // Indispensable pour traiter un fichier binaire
      })
      // Création d'une URL locale temporaire pour déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `CV_${nomFichier.replace(/\s+/g, '_')}.pdf`) // Formate le nom du fichier
      document.body.appendChild(link)
      link.click()
      link.remove() // Nettoyage
    } catch (err) {
      console.error("Erreur lors du téléchargement :", err)
      alert("Le fichier source du CV est introuvable sur le serveur.")
    }
  }

  const scoreColor = (s) => s >= 70 ? 'text-[#00f098]' : s >= 50 ? 'text-amber-300' : 'text-red-400'
  const scoreBar   = (s) => s >= 70 ? 'bg-[#00f098]'   : s >= 50 ? 'bg-amber-400'   : 'bg-red-400'
  const scoreBg    = (s) => s >= 70 ? 'bg-[#00f098]/10 border-[#00f098]/20' : s >= 50 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'

  const formatDateCandidature = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return `${date} à ${heure}`
  }

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
    <div className="min-h-screen bg-[#0b1a19] p-6 md:p-8 text-white space-y-6">

      {/* Bouton retour */}
      <button
        onClick={() => navigate('/recruteur')}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour aux offres
      </button>

      {/* Header offre (Relief #041619 et badges sobres) */}
      {offre && (
        <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 md:p-7 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">{offre.titre}</h1>
          <p className="text-gray-400 text-sm font-medium">
            {offre.typeContrat} <span className="mx-1.5 text-gray-600">•</span> {offre.niveauRequis}
          </p>
          
          {/* Badges de compétences épurés FDE */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {offre.competences.map((c, i) => (
              <span 
                key={i} 
                className="text-xs bg-white/5 border border-white/5 text-gray-300 px-3 py-1.5 rounded-lg font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats KPIs (Relief #041619 et bordure fine) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Candidatures', value: ranking.length,                               icon: Users,      color: 'text-white',     valColor: 'text-white' },
          { label: 'Score ≥ 70%',  value: ranking.filter(c => c.score >= 70).length,  icon: TrendingUp, color: 'text-[#00f098]', valColor: 'text-[#00f098]' },
          { label: 'Score moyen',  value: `${scoreTotal}%`,                           icon: Trophy,     color: 'text-white',     valColor: 'text-white' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div 
              key={i} 
              className="bg-[#041619] border border-white/5 rounded-2xl p-5 md:p-6 flex items-center gap-4 hover:border-white/10 transition-all shadow-md group"
            >
              <div className="w-11 h-11 bg-[#0b1a19] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-3xl font-black tracking-tight ${s.valColor}`}>{s.value}</p>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grand conteneur "Classement des candidats" (Relief #041619) */}
      <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 md:p-7 shadow-lg">
        
        {/* En-tête avec icône allumée */}
        <div className="flex items-center gap-3 pb-5 border-b border-white/5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0b1a19] border border-white/5 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#00f098]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Classement des candidats</h2>
            <p className="text-gray-500 text-xs">Évaluation sémantique et ranking IA par ordre de pertinence</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-16 font-medium">Chargement du classement...</p>
        ) : ranking.length === 0 ? (
          <div className="text-center py-16 bg-[#0b1a19] rounded-2xl border border-white/5">
            <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune candidature pour cette offre pour le moment.</p>
          </div>
        ) : (
          /* Liste des cartes individuelles de candidats (#0b1a19) */
          <div className="space-y-4">
            {ranking.map((candidature, index) => {
              const badge = rangBadge(index)
              const estOuvert = !!raisonsOuvertes[candidature._id]
              return (
                <div 
                  key={candidature._id} 
                  className="p-5 bg-[#0b1a19] border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center gap-5 hover:border-white/10 transition-all group"
                >
                  {/* Rang & Avatar initiales */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${badge.bg} text-white shadow-md`}>
                      {badge.text}
                    </div>
                    <div className="w-10 h-10 bg-[#041619] border border-white/5 text-white rounded-xl flex items-center justify-center text-xs font-black">
                      {candidature.candidatId?.prenom?.[0]}{candidature.candidatId?.nom?.[0]}
                    </div>
                  </div>

                  {/* Informations du candidat & Analyse IA */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="text-white font-bold text-base">
                        {candidature.candidatId?.prenom} {candidature.candidatId?.nom}
                      </p>
                      <span className="text-gray-500 text-xs font-medium">{candidature.candidatId?.email}</span>
                    </div>

                    <p className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />
                      Postulé le {formatDateCandidature(candidature.createdAt)}
                    </p>

                    {/* Explication sémantique IA aérée */}
                    <p className={`text-gray-400 text-xs mt-2 leading-relaxed ${estOuvert ? '' : 'line-clamp-2'}`}>
                      {candidature.raisons}
                    </p>

                    {candidature.raisons && candidature.raisons.length > 90 && (
                      <button
                        onClick={() => toggleRaison(candidature._id)}
                        className="text-[11px] text-[#00f098] hover:underline font-bold mt-1 cursor-pointer"
                      >
                        {estOuvert ? 'Voir moins' : 'Voir plus'}
                      </button>
                    )}

                    {/* Jauge conditionnelle (Menthe fluo ≥ 70, Ambre 50-69, Corail < 50) */}
                    <div className="mt-3 h-2 bg-[#041619] rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${scoreBar(candidature.score)}`}
                        style={{ width: `${candidature.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Badge de Score conditionnel */}
                  <div className={`px-4 py-2.5 rounded-xl border text-sm font-black flex-shrink-0 text-center ${scoreBg(candidature.score)} ${scoreColor(candidature.score)}`}>
                    {candidature.score}/100
                  </div>

                  {/* Actions : Téléchargement + Statut */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button
                      onClick={() => handleDownloadCV(candidature.cvId?._id || candidature.cvId, `${candidature.candidatId?.prenom}_${candidature.candidatId?.nom}`)}
                      className="w-10 h-10 flex items-center justify-center bg-[#041619] border border-white/10 rounded-xl text-gray-400 hover:text-[#00f098] hover:border-[#00f098]/30 transition-all cursor-pointer shadow-sm"
                      title="Télécharger le CV PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

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
                      className="text-xs bg-[#041619] border border-white/10 text-gray-300 rounded-xl px-3 py-2.5 h-10 focus:outline-none focus:border-[#00f098] transition-colors cursor-pointer font-medium"
                    >
                      <option value="en_attente" className="bg-[#0b1a19]">En attente</option>
                      <option value="retenu" className="bg-[#0b1a19]">Retenu ✓</option>
                      <option value="refusé" className="bg-[#0b1a19]">Refusé</option>
                    </select>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}