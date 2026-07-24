const CV                  = require('../models/CV')
const Candidature         = require('../models/Candidature')
const Offre               = require('../models/Offre')
const { extraireTextePDF } = require('../services/parseService')
const { analyserCV }      = require('../services/analyseService')

// ─── UPLOAD + ANALYSE CV ────────────────────────────────
const uploadCV = async (req, res) => {
  try {

     // ← Ajoute ces 2 lignes temporairement
    console.log('BODY reçu :', req.body)
    console.log('FILE reçu :', req.file)
    if (!req.file) {
      return res.status(400).json({ message: '❌ Aucun fichier reçu' })
    }

    const { offreId } = req.body

    // 1. Récupérer l'offre pour avoir les critères
    const offre = await Offre.findById(offreId)
    if (!offre) {
      return res.status(404).json({ message: '❌ Offre introuvable' })
    }

    // 2. Extraire le texte du PDF
    console.log('📄 Extraction du texte PDF...')
    const texteCV = await extraireTextePDF(req.file.path)

    // 3. Analyser avec l'IA
    console.log('🤖 Analyse IA en cours...')
    const analyse = await analyserCV(texteCV, offre)

    // 4. Sauvegarder le CV
    const cv = await CV.create({
      candidatId:   req.user.id,
      fichierUrl:   req.file.path,
      texteExtrait: texteCV,
      competences:  analyse.competencesDetectees,
      diplome:      req.body.diplome || '',
      experience:   req.body.experience || 0,
    })

    // 5. Créer la candidature avec le score
    const candidature = await Candidature.create({
      candidatId: req.user.id,
      offreId,
      cvId:       cv._id,
      score:      analyse.score,
      raisons:    analyse.raisons,
      statut:     'en_attente'
    })

    res.status(201).json({
      message:     '✅ CV analysé et candidature enregistrée',
      score:       analyse.score,
      analyse,
      candidature
    })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur', erreur: error.message })
  }
}

// ─── RANKING DES CANDIDATS POUR UNE OFFRE ───────────────
const getRanking = async (req, res) => {
  try {
    const { offreId } = req.params

    const candidatures = await Candidature.find({ offreId })
      .populate('candidatId', 'nom prenom email')
      .populate('cvId', 'competences diplome experience')
      .sort({ score: -1 })  // tri par score décroissant

    res.status(200).json({
      total: candidatures.length,
      ranking: candidatures
    })

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur', erreur: error.message })
  }
}

// ─── MES CANDIDATURES (candidat connecté) ───────────────
const mesCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find({ candidatId: req.user.id })
      .populate('offreId', 'titre typeContrat statut')
      .sort({ createdAt: -1 })

    res.status(200).json(candidatures)

  } catch (error) {
    res.status(500).json({ message: '❌ Erreur', erreur: error.message })
  }
}

module.exports = { uploadCV, getRanking, mesCandidatures }