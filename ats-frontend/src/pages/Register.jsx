import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, CheckCircle, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import logoSmall from '../assets/logo-icon-small.png'

export default function Register() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    motDePasse: '', confirmer: ''
  })
  const [showPwd, setShowPwd]   = useState(false)
  const [erreur, setErreur]     = useState('')
  const [succes, setSucces]     = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')

    if (form.motDePasse !== form.confirmer) {
      return setErreur('❌ Les mots de passe ne correspondent pas')
    }
    if (form.motDePasse.length < 6) {
      return setErreur('❌ Mot de passe trop court (minimum 6 caractères)')
    }

    setLoading(true)
    try {
      await api.post('/auth/inscription', {
        nom:        form.nom,
        prenom:     form.prenom,
        email:      form.email,
        motDePasse: form.motDePasse,
        role:       'candidat', // On force le rôle candidat pour toute inscription publique
      })
      setSucces('✅ Compte créé avec succès ! Redirection...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setErreur(err.response?.data?.message || '❌ Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#041619] flex">
      
      {/* ── COLONNE GAUCHE : Visuel & Marketing (Candidat) ── */}
      <div className="hidden lg:flex w-1/2 bg-[#08282d] border-r border-white/5 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00f098]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Logo */}
        <button onClick={() => navigate('/')} className="relative z-10 flex items-center gap-2 cursor-pointer w-fit">
          <img src={logoSmall} alt="ATS Platform" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-xl tracking-tight">ATS <span className="text-[#00f098]">Sénégal</span></span>
        </button>

        {/* Arguments Candidats */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 bg-[#00f098]/10 border border-[#00f098]/20 rounded-lg px-3 py-1.5 text-[#00f098] text-[10px] font-black uppercase tracking-widest mb-6">
            Espace Candidat
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-8">
            Propulsez votre <br />
            <span className="text-gray-500 font-light">carrière avec l'IA.</span>
          </h2>
          
          <div className="space-y-6">
            {[
              { title: 'Analyse intelligente de votre CV', desc: 'Notre algorithme IA extrait instantanément vos compétences et valorise votre profil auprès des recruteurs.' },
              { title: 'Matching précis', desc: 'Soyez recommandé en priorité pour les offres qui correspondent réellement à votre parcours.' },
              { title: 'Suivi transparent', desc: 'Visualisez l\'état d\'avancement de toutes vos candidatures depuis un tableau de bord unique.' },
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

      {/* ── COLONNE DROITE : Formulaire d'inscription ── */}
      <div className="w-full lg:w-1/2 flex flex-col relative justify-center p-8 sm:p-12 xl:p-24 bg-[#041619]">
        
        {/* Bouton retour absolu */}
        <div className="absolute top-8 right-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-[#00f098] transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Retour au site
          </button>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">Créer un compte</h1>
          <p className="text-gray-400 text-sm mb-8">
            Rejoignez la plateforme et trouvez votre prochaine opportunité.
          </p>

          {/* Messages */}
          {erreur && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
              {erreur}
            </div>
          )}
          {succes && (
            <div className="bg-[#00f098]/10 border border-[#00f098]/50 text-[#00f098] px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {succes}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nom + Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Diallo" required
                    className="w-full bg-[#08282d] border border-white/5 text-white rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:border-[#00f098] focus:ring-1 focus:ring-[#00f098] transition-all placeholder-gray-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Ibrahima" required
                    className="w-full bg-[#08282d] border border-white/5 text-white rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:border-[#00f098] focus:ring-1 focus:ring-[#00f098] transition-all placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} placeholder="exemple@email.com" required
                  className="w-full bg-[#08282d] border border-white/5 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#00f098] focus:ring-1 focus:ring-[#00f098] transition-all placeholder-gray-600"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'} name="motDePasse" value={form.motDePasse} onChange={handleChange} placeholder="••••••••" required
                  className="w-full bg-[#08282d] border border-white/5 text-white rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-[#00f098] focus:ring-1 focus:ring-[#00f098] transition-all placeholder-gray-600"
                />
                <button
                  type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'} name="confirmer" value={form.confirmer} onChange={handleChange} placeholder="••••••••" required
                  className={`w-full bg-[#08282d] border text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all placeholder-gray-600 ${
                    form.confirmer && form.motDePasse !== form.confirmer
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-white/5 focus:border-[#00f098] focus:ring-[#00f098]'
                  }`}
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit" disabled={loading}
              className="w-full mt-4 bg-[#00f098] text-[#041619] py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#00d084] transition-all shadow-[0_0_20px_rgba(0,240,152,0.2)] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#041619]/30 border-t-[#041619] rounded-full animate-spin" />
                  Création...
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          {/* Lien login */}
          <div className="mt-8 text-center text-sm font-medium">
            <p className="text-gray-500">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-[#00f098] font-bold hover:text-[#00d084] transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}