const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nom:          { type: String, required: true },
  prenom:       { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  motDePasse:   { type: String, required: true },
  role:         { type: String, enum: ['candidat', 'recruteur', 'admin'], required: true },
  // Uniquement pour les recruteurs
  poste:        { type: String },
  entrepriseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise' },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)