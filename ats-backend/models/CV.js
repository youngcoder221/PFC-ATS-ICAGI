const mongoose = require('mongoose')

const cvSchema = new mongoose.Schema({
  candidatId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fichierUrl:    { type: String, required: true },
  texteExtrait:  { type: String },
  competences:   [{ type: String }],
  diplome:       { type: String },
  experience:    { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('CV', cvSchema)