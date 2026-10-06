import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import logoSmall from '../assets/logo-icon-small.png'
import logoFull from '../assets/logo-icon-full.png'

export default function Login() {
  const [form, setForm]       = useState({ email: '', motDePasse: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [erreur, setErreur]   = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecruteur, setIsRecruteur] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      const res  = await api.post('/auth/connexion', form)
      const user = res.data.user
      login(user, res.data.token)

      // Redirection automatique selon le rôle
      if (user.role === 'recruteur')  navigate('/recruteur')
      else if (user.role === 'candidat') navigate('/candidat')
      else navigate('/admin')

    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#041619] flex">
      {/* Colonne Gauche : Marketing & Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-b from-[#08282d] to-[#041619] border-r border-[#00f098]/10">
        <div>
          <img src={logoSmall} alt="ATS Platform" className="w-12 h-12 mb-8" />
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Recrutez les meilleurs <br/> 
            <span className="text-[#00f098]">en un temps record.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            La plateforme ATS dédiée aux PME africaines. Analyse sémantique IA, 
            scoring automatisé et gestion simplifiée de vos candidats.
          </p>
        </div>
        <div className="text-[#00f098] font-bold text-sm">ATS Sénégal v1.0</div>
      </div>

      {/* Colonne Droite : Interaction */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#041619]">
        <div className="w-full max-w-sm">
          
          {/* Sélecteur d'acteurs moderne */}
          <div className="flex bg-[#08282d] p-1 rounded-2xl mb-8 border border-white/5">
            <button 
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isRecruteur ? 'bg-[#00f098] text-[#041619] shadow-lg' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setIsRecruteur(false)}
            >
              Candidat
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isRecruteur ? 'bg-[#00f098] text-[#041619] shadow-lg' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setIsRecruteur(true)}
            >
              Recruteur
            </button>
          </div>

          <h1 className="text-3xl font-black text-white mb-8">Connexion</h1>

          {/* Formulaire à implémenter dans l'étape suivante */}
          {/* <LoginForm isRecruteur={isRecruteur} /> */}
          
        </div>
      </div>
    </div>
  )
}