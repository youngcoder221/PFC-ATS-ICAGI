const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    // Récupérer le token dans le header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '❌ Token manquant, accès refusé' })
    }

    // Extraire et vérifier le token
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Ajouter l'utilisateur à la requête
    req.user = decoded
    next()

  } catch (error) {
    res.status(401).json({ message: '❌ Token invalide' })
  }
}

// Middleware pour restreindre selon le rôle
const autoriser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `❌ Accès refusé — rôle requis : ${roles.join(', ')}` 
      })
    }
    next()
  }
}

module.exports = { protect, autoriser }