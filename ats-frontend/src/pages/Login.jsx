import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import api from '../services/api'
import logoSmall from '../assets/logo-icon-small.png'


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

          {erreur && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f098]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="exemple@email.com"
                  required
                  className="w-full bg-[#08282d] border border-white/10 text-white rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#00f098] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f098]" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.motDePasse}
                  onChange={e => setForm({...form, motDePasse: e.target.value})}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#08282d] border border-white/10 text-white rounded-xl pl-10 pr-10 py-3.5 text-sm focus:outline-none focus:border-[#00f098] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="accent-[#00f098] bg-[#08282d] border-white/10 rounded" />
                Se souvenir de moi
              </label>
              <button type="button" className="hover:text-[#00f098] transition-colors">Mot de passe oublié ?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00f098] hover:bg-[#00d084] text-[#041619] py-4 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,240,152,0.2)]"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer de redirection conditionnelle */}
          <div className="mt-8 text-center text-xs">
            {!isRecruteur ? (
              <p className="text-gray-500">
                Nouveau sur la plateforme ?{' '}
                <Link to="/register" className="text-[#00f098] font-bold hover:underline">Créer un compte candidat</Link>
              </p>
            ) : (
              <p className="text-gray-500">
                Votre entreprise n'a pas de compte ?{' '}
                <span className="text-gray-300 font-bold">Contactez l'administrateur</span>
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}