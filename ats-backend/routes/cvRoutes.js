const express     = require('express')
const router      = express.Router()
const { uploadCV, getRanking, mesCandidatures } = require('../controllers/cvController')
const { protect, autoriser } = require('../middleware/authMiddleware')
const upload      = require('../middleware/uploadMiddleware')
const Candidature = require('../models/Candidature')

// Candidat uploade son CV et postule
router.post('/upload', protect, autoriser('candidat'), upload.single('cv'), uploadCV)

// Ranking pour une offre (recruteur uniquement)
router.get('/ranking/:offreId', protect, autoriser('recruteur', 'admin'), getRanking)

// Mes candidatures (candidat)
router.get('/mes-candidatures', protect, autoriser('candidat'), mesCandidatures)

// Changer le statut d'une candidature (recruteur/admin)
router.put('/candidatures/:id/statut', protect, autoriser('recruteur', 'admin'), async (req, res) => {
  try {
    const candidature = await Candidature.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    )
    if (!candidature) {
      return res.status(404).json({ message: '❌ Candidature introuvable' })
    }
    res.json({ message: '✅ Statut mis à jour', candidature })
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur', erreur: err.message })
  }
})

module.exports = router