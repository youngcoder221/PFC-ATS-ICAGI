const multer  = require('multer')
const path    = require('path')

// Définir où et comment stocker les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')   // dossier de stockage
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + nom original
    const nomUnique = `${Date.now()}-${file.originalname}`
    cb(null, nomUnique)
  }
})

// Filtrer — accepter uniquement les PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('❌ Format invalide — PDF uniquement'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // max 5MB
})

module.exports = upload