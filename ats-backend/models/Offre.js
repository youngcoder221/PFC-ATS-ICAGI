const mongoose = require('mongoose')

const offreSchema = new mongoose.Schema({
  titre:        { type: String, required: true },
  description:  { type: String, required: true },
  competences:  [{ type: String }],
  niveauRequis: { type: String, enum: ['Licence', 'Master', 'Ingénieur', 'Doctorat'] },
  typeContrat:  { type: String, enum: ['Stage', 'CDD', 'CDI', 'Freelance'] },
  statut:       { type: String, enum: ['ouverte', 'fermée'], default: 'ouverte' },
  recruteurId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Offre', offreSchema)