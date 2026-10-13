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
// Sécurisation stricte des CORS (Cf. Mémoire Sections 3.12 et 4.13)
const corsOptions = {
  // En production, on utilisera la variable d'environnement FRONTEND_URL. 
  // En local, on autorise le port 5173 (Vite.js).
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes (on les branchera une par une)
 app.use('/api/auth',         require('./routes/authRoutes'))
 app.use('/api/offres',       require('./routes/offreRoutes'))
 app.use('/api/cv',           require('./routes/cvRoutes'))
// app.use('/api/candidatures', require('./routes/candidatureRoutes'))
app.use('/api/admin',  require('./routes/adminRoutes'))

// Route de test pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: '✅ Serveur ATS opérationnel' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
})