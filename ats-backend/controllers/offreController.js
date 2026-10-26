const Offre = require('../models/Offre')

// ─── CRÉER UNE OFFRE (recruteur) ────────────────────────
const creerOffre = async (req, res) => {
  try {
    const { 
      titre, description, entreprise, logoUrl, localisation,
      modeTravail, secteur, salaire, competences, 
      niveauRequis, typeContrat, dateLimite // <-- Récupération ajoutée
    } = req.body

    const offre = await Offre.create({
      titre,
      description,
      entreprise: entreprise || 'Entreprise Partenaire',
      logoUrl: logoUrl || '',
      localisation: localisation || 'Dakar, Sénégal',
      modeTravail: modeTravail || 'Sur site',
      secteur: secteur || 'Technologie & Numérique',
      salaire: salaire || 'À négocier',
      competences,
      niveauRequis,
      typeContrat,
      dateLimite: dateLimite || null, // <-- Ajouté en base (null si vide)
      recruteurId: req.user.id
    })

    res.status(201).json({ message: '✅ Offre créée avec succès', offre })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur serveur', erreur: error.message })
  }
}

// ─── LISTER TOUTES LES OFFRES (public avec filtre entreprise optionnel) ───
const getOffres = async (req, res) => {
  try {
    const filtre = { statut: 'ouverte' }

    // Si un nom d'entreprise est passé en paramètre d'URL (?entreprise=...)
    if (req.query.entreprise) {
      filtre.entreprise = new RegExp(`^${req.query.entreprise.trim()}$`, 'i')
    }

    const offres = await Offre.find(filtre)
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

// ─── MODIFIER UNE OFFRE (Propriétaire ou Administrateur) ──
const modifierOffre = async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id)

    if (!offre) {
      return res.status(404).json({ message: '❌ Offre introuvable' })
    }

    // 🛡️ Autorise le recruteur propriétaire OU l'administrateur
    if (offre.recruteurId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '❌ Non autorisé' })
    }

    const offreMaj = await Offre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }   // Standard Mongoose 9+ pour retourner le document mis à jour
    )

    res.status(200).json({ message: '✅ Offre mise à jour avec succès', offre: offreMaj })

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