const express    = require('express')
const dotenv     = require('dotenv')
const cors       = require('cors')
const connectDB  = require('./config/db')

// Charger les variables .env
dotenv.config()

// Connecter MongoDB
connectDB()

const app = express()

// Middlewares globaux
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes (on les branchera une par une)
 app.use('/api/auth',         require('./routes/authRoutes'))
 app.use('/api/offres',       require('./routes/offreRoutes'))
 app.use('/api/cv',           require('./routes/cvRoutes'))
// app.use('/api/candidatures', require('./routes/candidatureRoutes'))

// Route de test pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: '✅ Serveur ATS opérationnel' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
})