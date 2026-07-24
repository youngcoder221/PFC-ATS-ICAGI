const Offre = require('../models/Offre')

// ─── CRÉER UNE OFFRE (recruteur) ────────────────────────
const creerOffre = async (req, res) => {
  try {
    const { titre, description, competences, niveauRequis, typeContrat } = req.body

    const offre = await Offre.create({
      titre,
      description,
      competences,
      niveauRequis,
      typeContrat,
      recruteurId: req.user.id   // vient du token JWT
    })

    res.status(201).json({ message: '✅ Offre créée', offre })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── LISTER TOUTES LES OFFRES (public) ──────────────────
const getOffres = async (req, res) => {
  try {
    const offres = await Offre.find({ statut: 'ouverte' })
      .populate('recruteurId', 'nom prenom email')
      .sort({ createdAt: -1 })

    res.status(200).json(offres)

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── UNE SEULE OFFRE ────────────────────────────────────
const getOffre = async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id)
      .populate('recruteurId', 'nom prenom email')

    if (!offre) {
      return res.status(404).json({ message: '❌ Offre introuvable' })
    }

    res.status(200).json(offre)

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── MODIFIER UNE OFFRE ──────────────────────────────────
const modifierOffre = async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id)

    if (!offre) {
      return res.status(404).json({ message: '❌ Offre introuvable' })
    }

    // Vérifier que c'est bien le recruteur propriétaire
    if (offre.recruteurId.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ Non autorisé' })
    }

    const offreMaj = await Offre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }   // retourner le document mis à jour
    )

    res.status(200).json({ message: '✅ Offre mise à jour', offre: offreMaj })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── SUPPRIMER UNE OFFRE ────────────────────────────────
const supprimerOffre = async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id)

    if (!offre) {
      return res.status(404).json({ message: '❌ Offre introuvable' })
    }

    if (offre.recruteurId.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ Non autorisé' })
    }

    await offre.deleteOne()
    res.status(200).json({ message: '✅ Offre supprimée' })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── MES OFFRES (recruteur connecté) ────────────────────
const mesOffres = async (req, res) => {
  try {
    const offres = await Offre.find({ recruteurId: req.user.id })
      .sort({ createdAt: -1 })

    res.status(200).json(offres)

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

module.exports = { creerOffre, getOffres, getOffre, modifierOffre, supprimerOffre, mesOffres }