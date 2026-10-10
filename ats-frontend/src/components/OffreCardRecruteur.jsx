import { MapPin, Briefcase, GraduationCap, ChevronRight, Power } from 'lucide-react'

export default function OffreCardRecruteur({ offre, onToggleStatut, onVoirCandidats }) {
  const localisation = offre.localisation || 'Dakar, Sénégal'

  return (
    <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 hover:border-[#00f098]/30 hover:shadow-[0_0_15px_rgba(0,240,152,0.05)] transition-all flex flex-col justify-between h-full group shadow-lg">
      
      <div>
        {/* Badge de statut */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
            offre.statut === 'ouverte'
              ? 'bg-[#00f098]/10 text-[#00f098] border-[#00f098]/20'
              : 'bg-white/5 text-gray-500 border-white/5'
          }`}>
            {offre.statut}
          </span>
        </div>

        {/* Titre du poste */}
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-[#00f098] transition-colors line-clamp-2 leading-snug">
          {offre.titre}
        </h3>

        {/* Métadonnées (Lieu, Type de contrat, Diplôme) */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="flex items-center gap-1.5 text-xs bg-[#0b1a19] border border-white/5 text-gray-300 px-2.5 py-1.5 rounded-lg font-medium">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {localisation}
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-[#0b1a19] border border-white/5 text-gray-300 px-2.5 py-1.5 rounded-lg font-medium">
            <Briefcase className="w-3.5 h-3.5 text-[#00f098]" />
            {offre.typeContrat}
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-[#0b1a19] border border-white/5 text-gray-300 px-2.5 py-1.5 rounded-lg font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
            {offre.niveauRequis}
          </span>
        </div>

        {/* Badges de compétences */}
        <div className="flex gap-2 flex-wrap mb-6 mt-auto">
          {offre.competences?.slice(0, 3).map((c, i) => (
            <span key={i} className="text-[11px] font-medium bg-[#0b1a19] border border-white/5 text-gray-300 px-2 py-1 rounded-md">
              {c}
            </span>
          ))}
          {offre.competences?.length > 3 && (
            <span className="text-[11px] font-medium text-gray-500 py-1">
              +{offre.competences.length - 3} autres
            </span>
          )}
        </div>
      </div>

      {/* Boutons d'action (Fermer / Rouvrir + Candidats) */}
      <div className="pt-4 border-t border-white/5 flex justify-between items-center gap-3">
        <button
          onClick={() => onToggleStatut(offre._id)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-xl border transition-all flex-1 justify-center font-medium ${
            offre.statut === 'ouverte'
              ? 'border-red-900/40 text-red-400 hover:bg-red-900/20'
              : 'border-[#00f098]/30 text-[#00f098] hover:bg-[#00f098]/10'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {offre.statut === 'ouverte' ? 'Fermer' : 'Rouvrir'}
        </button>
        
        <button
          onClick={() => onVoirCandidats(offre._id)}
          className="flex items-center gap-1.5 bg-[#00f098] hover:bg-[#00d084] text-[#0b1a19] text-xs px-3 py-2.5 rounded-xl font-black transition-all flex-1 justify-center shadow-[0_0_15px_rgba(0,240,152,0.15)]"
        >
          Candidats <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  )
}