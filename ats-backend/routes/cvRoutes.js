const express  = require('express')
const router   = express.Router()
const { uploadCV, getRanking, mesCandidatures } = require('../controllers/cvController')
const { protect, autoriser } = require('../middleware/authMiddleware')
const upload   = require('../middleware/uploadMiddleware')

// Candidat uploade son CV et postule
router.post('/upload', protect, autoriser('candidat'), upload.single('cv'), uploadCV)

// Ranking pour une offre (recruteur uniquement)
router.get('/ranking/:offreId', protect, autoriser('recruteur', 'admin'), getRanking)

// Mes candidatures (candidat)
router.get('/mes-candidatures', protect, autoriser('candidat'), mesCandidatures)

module.exports = router