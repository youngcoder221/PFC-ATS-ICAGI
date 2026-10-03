// src/components/OffreCardRecruteur.jsx
import { MapPin, Briefcase, GraduationCap, ChevronRight, Power } from 'lucide-react'

export default function OffreCardRecruteur({ offre, onToggleStatut, onVoirCandidats }) {
  const localisation = offre.localisation || 'Dakar, Sénégal'
  const typeColors = {
    'Stage': 'text-blue-400',
    'CDI': 'text-green-400',
    'CDD': 'text-amber-400',
    'Freelance': 'text-purple-400',
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] transition-all flex flex-col h-full group">
      
      {/* Statut */}
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          offre.statut === 'ouverte' ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-gray-800 text-gray-500 border border-gray-700'
        }`}>
          {offre.statut}
        </div>
      </div>

      {/* Titre */}
      <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors line-clamp-2">
        {offre.titre}
      </h3>

      {/* Méta-données */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="flex items-center gap-1.5 text-xs bg-gray-950 border border-gray-800 text-gray-300 px-2.5 py-1.5 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-gray-400" /> 
          {localisation}
        </span>
        <span className="flex items-center gap-1.5 text-xs bg-gray-950 border border-gray-800 text-gray-300 px-2.5 py-1.5 rounded-lg">
          <Briefcase className={`w-3.5 h-3.5 ${typeColors[offre.typeContrat] || 'text-gray-400'}`} /> 
          {offre.typeContrat}
        </span>
        <span className="flex items-center gap-1.5 text-xs bg-gray-950 border border-gray-800 text-gray-300 px-2.5 py-1.5 rounded-lg">
          <GraduationCap className="w-3.5 h-3.5 text-pink-400" /> 
          {offre.niveauRequis}
        </span>
      </div>

      {/* Compétences */}
      <div className="flex gap-2 flex-wrap mb-6 mt-auto">
        {offre.competences?.slice(0, 3).map((c, i) => (
          <span key={i} className="text-[11px] font-medium bg-gray-800 text-gray-400 px-2 py-1 rounded-md">
            {c}
          </span>
        ))}
        {offre.competences?.length > 3 && (
          <span className="text-[11px] font-medium text-gray-500 py-1">
            +{offre.competences.length - 3} autres
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-800 flex justify-between items-center gap-3">
        <button
          onClick={() => onToggleStatut(offre._id)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all flex-1 justify-center ${
            offre.statut === 'ouverte'
              ? 'border-red-900/50 text-red-400 hover:bg-red-900/20'
              : 'border-green-900/50 text-green-400 hover:bg-green-900/20'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {offre.statut === 'ouverte' ? 'Fermer' : 'Rouvrir'}
        </button>
        <button
          onClick={() => onVoirCandidats(offre._id)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-xl font-medium transition-all flex-1 justify-center"
        >
          Candidats <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}