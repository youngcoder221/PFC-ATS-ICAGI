const express = require('express')
const router  = express.Router()
const { protect, autoriser } = require('../middleware/authMiddleware')
const User    = require('../models/User')
const Offre   = require('../models/Offre')
const Candidature = require('../models/Candidature')

// Stats globales
router.get('/stats', protect, autoriser('admin'), async (req, res) => {
  try {
    const [totalUsers, totalOffres, totalCandidatures] = await Promise.all([
      User.countDocuments(),
      Offre.countDocuments(),
      Candidature.countDocuments(),
    ])
    res.json({ totalUsers, totalOffres, totalCandidatures })
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', erreur: err.message })
  }
})

// Tous les utilisateurs avec leurs vraies candidatures rattachées
router.get('/users', protect, autoriser('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse').sort({ createdAt: -1 }).lean()

    // Récupérer les vraies candidatures MongoDB pour chaque candidat
    const usersAvecCandidatures = await Promise.all(
      users.map(async (u) => {
        if (u.role === 'candidat') {
          const candidatures = await Candidature.find({ candidatId: u._id })
            .populate('offreId', 'titre typeContrat')
            .sort({ createdAt: -1 })
          return { ...u, candidatures }
        }
        return { ...u, candidatures: [] }
      })
    )

    res.json(usersAvecCandidatures)
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', erreur: err.message })
  }
})

// Supprimer un utilisateur
router.delete('/users/:id', protect, autoriser('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: '✅ Utilisateur supprimé' })
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', erreur: err.message })
  }
})

// Toutes les offres
router.get('/offres', protect, autoriser('admin'), async (req, res) => {
  try {
    const offres = await Offre.find()
      .populate('recruteurId', 'nom prenom email')
      .sort({ createdAt: -1 })
    res.json(offres)
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', erreur: err.message })
  }
})

module.exports = router