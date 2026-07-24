const mongoose = require('mongoose')

const candidatureSchema = new mongoose.Schema({
  candidatId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  offreId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Offre', required: true },
  cvId:       { type: mongoose.Schema.Types.ObjectId, ref: 'CV',    required: true },
  score:      { type: Number, min: 0, max: 100, default: 0 },
  raisons:    { type: String },
  statut:     { type: String, enum: ['en_attente', 'retenu', 'refusé'], default: 'en_attente' },
}, { timestamps: true })

module.exports = mongoose.model('Candidature', candidatureSchema)