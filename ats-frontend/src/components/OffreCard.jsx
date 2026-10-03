// src/components/OffreCard.jsx
import { MapPin, Briefcase, GraduationCap, Sparkles, Building2, ChevronRight } from 'lucide-react'

export default function OffreCard({ offre, onPostuler }) {
  // Valeurs de repli au cas où le backend ne fournit pas encore ces données
  const localisation = offre.localisation || 'Dakar, Sénégal'
  const secteur = offre.secteur || 'Technologie / Numérique'
  const nomEntreprise = offre.recruteurId?.entreprise || 'Entreprise Confidentielle'

  // Couleurs conditionnelles pour le type de contrat
  const typeColors = {
    'Stage': 'text-blue-400',
    'CDI': 'text-green-400',
    'CDD': 'text-amber-400',
    'Freelance': 'text-purple-400',
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] transition-all flex flex-col h-full group">
      
      {/* En-tête : Logo entreprise & Badge IA */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 line-clamp-1">{nomEntreprise}</h4>
            <p className="text-xs text-gray-500">{secteur}</p>
          </div>
        </div>
        {/* Badge IA */}
        <div 
          className="flex items-center gap-1 bg-indigo-900/30 border border-indigo-700/50 text-indigo-400 px-2 py-1 rounded-lg text-[10px] font-medium"
          title="Vos compétences seront analysées par notre IA pour cette offre"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">Scoring IA</span>
        </div>
      </div>

      {/* Titre du poste */}
      <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors line-clamp-2">
        {offre.titre}
      </h3>

      {/* Méta-données (Localisation, Contrat, Niveau) */}
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

      {/* Compétences clés */}
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

      {/* Pied de carte & Call-to-action */}
      <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {new Date(offre.datePublication || offre.createdAt).toLocaleDateString('fr-FR')}
        </span>
        <button
          onClick={() => onPostuler(offre._id)}
          className="flex items-center gap-1 bg-white text-gray-950 hover:bg-indigo-500 hover:text-white text-sm px-4 py-2 rounded-xl font-medium transition-all"
        >
          Postuler <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}