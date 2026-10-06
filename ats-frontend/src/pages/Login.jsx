import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import logoSmall from '../assets/logo-icon-small.png'


export default function Login() {
  const [form, setForm]       = useState({ email: '', motDePasse: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [erreur, setErreur]   = useState('')
  const [loading, setLoading] = useState(false)
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
      {/* ── COLONNE GAUCHE : Visuel & Marketing ── */}
      <div className="hidden lg:flex w-1/2 bg-[#08282d] border-r border-white/5 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00f098]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Logo (cliquable pour retour accueil) */}
        <button onClick={() => navigate('/')} className="relative z-10 flex items-center gap-3 cursor-pointer w-fit">
          <img src={logoSmall} alt="ATS Platform" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-xl tracking-tight">ATS <span className="text-[#00f098]">Sénégal</span></span>
        </button>

        {/* Arguments B2B */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 bg-[#00f098]/10 border border-[#00f098]/20 rounded-lg px-3 py-1.5 text-[#00f098] text-[10px] font-black uppercase tracking-widest mb-6">
            Ressources Humaines 2.0
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-8">
            Recrutez les meilleurs, <br />
            <span className="text-gray-500 font-light">sans effort.</span>
          </h2>
          
          <div className="space-y-6">
            {[
              { title: 'Scoring sémantique des CV', desc: 'Une analyse contextuelle avancée qui va bien au-delà de la simple recherche de mots-clés.' },
              { title: 'Classement automatisé par l\'API Gemini', desc: 'Chaque candidat est évalué et classé instantanément selon les critères exacts de votre offre.' },
              { title: 'Gagnez 80% de temps sur vos recrutements', desc: 'Concentrez-vous uniquement sur les entretiens avec les profils les plus pertinents.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-lg bg-[#041619] border border-[#00f098]/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(0,240,152,0.1)]">
                  <CheckCircle className="w-4 h-4 text-[#00f098]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Colonne Gauche */}
        <div className="relative z-10 text-gray-500 text-xs font-medium">
          © {new Date().getFullYear()} ATS Sénégal. Plateforme logicielle B2B.
        </div>
      </div>

      {/* Colonne Droite : Interaction */}
      <div className="flex-1 flex flex-col relative justify-center items-center p-8 bg-[#041619]">
        
        {/* Bouton retour absolu */}
        <div className="absolute top-8 right-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-[#00f098] transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </button>
        </div>

        <div className="w-full max-w-sm">


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

          {/* Footer de redirection */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500 font-medium">
              Nouveau sur la plateforme ?{' '}
              <Link to="/register" className="text-[#00f098] font-bold hover:text-[#00d084] transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}