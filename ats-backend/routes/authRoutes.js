const express = require('express')
const router  = express.Router()
const { inscription, connexion, monProfil } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Routes publiques
router.post('/inscription', inscription)
router.post('/connexion',   connexion)

// Route protégée (nécessite un token)
router.get('/profil', protect, monProfil)

module.exports = router