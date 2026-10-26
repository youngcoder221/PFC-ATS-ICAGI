const mongoose = require('mongoose')

const offreSchema = new mongoose.Schema({
  titre:        { type: String, required: true },
  description:  { type: String, required: true },
  entreprise:   { type: String, default: 'Entreprise Partenaire' },
  logoUrl:      { type: String, default: '' },
  localisation: { type: String, default: 'Dakar, Sénégal' },
  modeTravail:  { type: String, enum: ['Sur site', 'Hybride', 'Télétravail'], default: 'Sur site' },
  secteur:      { type: String, default: 'Technologie & Numérique' },
  salaire:      { type: String, default: 'À négocier' },
  competences:  [{ type: String }],
  niveauRequis: { type: String, enum: ['Licence', 'Master', 'Ingénieur', 'Doctorat'] },
  typeContrat:  { type: String, enum: ['Stage', 'CDD', 'CDI', 'Freelance'] },
  dateLimite:   { type: Date }, // Nouveau champ optionnel
  statut:       { type: String, enum: ['ouverte', 'fermée'], default: 'ouverte' },
  recruteurId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Offre', offreSchema)