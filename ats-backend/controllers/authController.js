const User    = require('../models/User')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')

// ─── Générer un token JWT ───────────────────────────────
const genererToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ─── INSCRIPTION ────────────────────────────────────────
const inscription = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role, poste } = req.body

    // Vérifier si l'email existe déjà
    const existe = await User.findOne({ email })
    if (existe) {
      return res.status(400).json({ message: '❌ Email déjà utilisé' })
    }

    // Chiffrer le mot de passe
    const salt = await bcrypt.genSalt(10)
    const mdpChiffre = await bcrypt.hash(motDePasse, salt)

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      prenom,
      email,
      motDePasse: mdpChiffre,
      role: role || 'candidat',
      poste: poste || null,
    })

    res.status(201).json({
      message: '✅ Inscription réussie',
      token: genererToken(user),
      user: {
        id:     user._id,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
      }
    })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── CONNEXION ──────────────────────────────────────────
const connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body

    // Chercher l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: '❌ Utilisateur introuvable' })
    }

    // Vérifier le mot de passe
    const mdpValide = await bcrypt.compare(motDePasse, user.motDePasse)
    if (!mdpValide) {
      return res.status(401).json({ message: '❌ Mot de passe incorrect' })
    }

    res.status(200).json({
      message: '✅ Connexion réussie',
      token: genererToken(user),
      user: {
        id:     user._id,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
      }
    })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── PROFIL (route protégée) ────────────────────────────
const monProfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

module.exports = { inscription, connexion, monProfil }