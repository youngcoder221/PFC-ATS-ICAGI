const express    = require('express')
const router     = express.Router()
const {
  creerOffre, getOffres, getOffre,
  modifierOffre, supprimerOffre, mesOffres
} = require('../controllers/offreController')
const { protect, autoriser } = require('../middleware/authMiddleware')
const Offre = require('../models/Offre')

// Routes publiques
router.get('/',     getOffres)
router.get('/:id',  getOffre)

// Routes protégées — recruteur uniquement
router.post('/',        protect, autoriser('recruteur', 'admin'), creerOffre)
router.put('/:id',      protect, autoriser('recruteur', 'admin'), modifierOffre)
router.delete('/:id',   protect, autoriser('recruteur', 'admin'), supprimerOffre)
router.get('/mes/offres', protect, autoriser('recruteur'), mesOffres)

// Changer le statut d'une offre (ouverte/fermée)
router.patch('/:id/statut', protect, autoriser('recruteur', 'admin'), async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id)
    if (!offre) return res.status(404).json({ message: '❌ Offre introuvable' })

    if (offre.recruteurId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '❌ Non autorisé' })
    }

    offre.statut = offre.statut === 'ouverte' ? 'fermée' : 'ouverte'
    await offre.save()

    res.json({ message: `✅ Offre ${offre.statut}`, offre })
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', erreur: err.message })
  }
})

module.exports = router