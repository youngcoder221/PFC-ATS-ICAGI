const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// ─── Construction du prompt envoyé à Gemini ─────────────
const construirePrompt = (texteCV, criteresOffre) => {
  return `Tu es un assistant de recrutement expert et objectif. Analyse le CV ci-dessous par rapport à l'offre d'emploi, puis réponds UNIQUEMENT avec un objet JSON valide (sans balises markdown, sans texte avant ou après), au format EXACT suivant :

{
  "score": <entier entre 0 et 100>,
  "competencesDetectees": [<compétences requises retrouvées dans le CV, y compris par équivalence sémantique>],
  "competencesManquantes": [<compétences requises absentes du CV>],
  "pointsForts": [<3 à 5 points forts du profil pour ce poste précis>],
  "raisons": "<explication concise en 2 à 3 phrases du score attribué>"
}

=== OFFRE D'EMPLOI ===
Titre : ${criteresOffre.titre}
Description : ${criteresOffre.description}
Compétences requises : ${criteresOffre.competences.join(', ')}
Niveau requis : ${criteresOffre.niveauRequis || 'non précisé'}
Type de contrat : ${criteresOffre.typeContrat || 'non précisé'}

=== CV DU CANDIDAT (texte extrait) ===
${texteCV}

Consignes d'évaluation :
- Tiens compte des équivalences sémantiques (ex. "ReactJS" = "React", "BDD" = "base de données", "JS" = "JavaScript").
- Le score doit refléter l'adéquation globale du profil, pas uniquement le nombre de mots-clés trouvés.
- Sois concis et factuel dans le champ "raisons".
- Réponds STRICTEMENT en JSON valide, rien d'autre.`
}

// ─── Algorithme de secours (mots-clés) — utilisé si Gemini est indisponible ───
const analyserAvecMotsCles = (texteCV, criteresOffre) => {
  const texteLower = texteCV.toLowerCase()

  const competencesDetectees = criteresOffre.competences.filter(comp =>
    texteLower.includes(comp.toLowerCase())
  )
  const competencesManquantes = criteresOffre.competences.filter(comp =>
    !texteLower.includes(comp.toLowerCase())
  )

  const score = Math.round(
    (competencesDetectees.length / criteresOffre.competences.length) * 100
  )

  const pointsForts = []
  if (texteLower.includes('projet'))    pointsForts.push('A réalisé des projets')
  if (texteLower.includes('stage'))     pointsForts.push('Expérience en stage')
  if (texteLower.includes('github'))    pointsForts.push('Présence sur GitHub')
  if (texteLower.includes('formation')) pointsForts.push('Formation pertinente')

  return {
    score,
    competencesDetectees,
    competencesManquantes,
    pointsForts,
    raisons: `[Mode secours — mots-clés] Le candidat maîtrise ${competencesDetectees.length} sur ${criteresOffre.competences.length} compétences requises. Score calculé : ${score}/100.`
  }
}

// ─── Analyse principale : Gemini, avec repli automatique ───
const analyserCV = async (texteCV, criteresOffre) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY manquante dans .env')
    }

    const prompt = construirePrompt(texteCV, criteresOffre)

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    })

    const analyse = JSON.parse(response.text)

    // Validation minimale de la structure renvoyée par l'IA
    if (
      typeof analyse.score !== 'number' ||
      analyse.score < 0 ||
      analyse.score > 100 ||
      !Array.isArray(analyse.competencesDetectees)
    ) {
      throw new Error('Réponse Gemini mal formée')
    }

    return {
      score: Math.round(analyse.score),
      competencesDetectees: analyse.competencesDetectees || [],
      competencesManquantes: analyse.competencesManquantes || [],
      pointsForts: analyse.pointsForts || [],
      raisons: analyse.raisons || '',
    }

  } catch (error) {
    console.warn('⚠️  Analyse Gemini indisponible, bascule sur l\'algorithme de secours :', error.message)
    return analyserAvecMotsCles(texteCV, criteresOffre)
  }
}

module.exports = { analyserCV }