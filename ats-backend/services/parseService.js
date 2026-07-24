const { PdfReader } = require('pdfreader')

const extraireTextePDF = (cheminFichier) => {
  return new Promise((resolve, reject) => {
    let texte = ''

    new PdfReader().parseFileItems(cheminFichier, (err, item) => {
      if (err) {
        reject(new Error('❌ Impossible de lire le PDF : ' + err.message))
      } else if (!item) {
        // Fin du fichier → retourner le texte complet
        resolve(texte)
      } else if (item.text) {
        texte += item.text + ' '
      }
    })
  })
}

module.exports = { extraireTextePDF }