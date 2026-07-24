const express    = require('express')
const router     = express.Router()
const {
  creerOffre, getOffres, getOffre,
  modifierOffre, supprimerOffre, mesOffres
} = require('../controllers/offreController')
const { protect, autoriser } = require('../middleware/authMiddleware')

// Routes publiques
router.get('/',     getOffres)
router.get('/:id',  getOffre)

// Routes protégées — recruteur uniquement
router.post('/',        protect, autoriser('recruteur', 'admin'), creerOffre)
router.put('/:id',      protect, autoriser('recruteur', 'admin'), modifierOffre)
router.delete('/:id',   protect, autoriser('recruteur', 'admin'), supprimerOffre)
router.get('/mes/offres', protect, autoriser('recruteur'), mesOffres)

module.exports = router