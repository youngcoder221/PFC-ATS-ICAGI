const analyserCV = async (texteCV, criteresOffre) => {
  try {
    const texteLower = texteCV.toLowerCase()
    
    // Détecter les compétences présentes dans le CV
    const competencesDetectees = criteresOffre.competences.filter(comp =>
      texteLower.includes(comp.toLowerCase())
    )

    const competencesManquantes = criteresOffre.competences.filter(comp =>
      !texteLower.includes(comp.toLowerCase())
    )

    // Calculer le score
    const score = Math.round(
      (competencesDetectees.length / criteresOffre.competences.length) * 100
    )

    // Points forts basiques
    const pointsForts = []
    if (texteLower.includes('projet'))     pointsForts.push('A réalisé des projets')
    if (texteLower.includes('stage'))      pointsForts.push('Expérience en stage')
    if (texteLower.includes('github'))     pointsForts.push('Présence sur GitHub')
    if (texteLower.includes('formation'))  pointsForts.push('Formation pertinente')

    return {
      score,
      competencesDetectees,
      competencesManquantes,
      pointsForts,
      raisons: `Le candidat maîtrise ${competencesDetectees.length} sur ${criteresOffre.competences.length} compétences requises. Score calculé : ${score}/100.`
    }

  } catch (error) {
    throw new Error('❌ Erreur analyse : ' + error.message)
  }
}

module.exports = { analyserCV }