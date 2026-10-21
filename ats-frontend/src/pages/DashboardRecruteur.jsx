import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, X, Briefcase, Users, ChevronRight, Clock, TrendingUp, XCircle, Sparkles, Building2, MapPin, Image, Coins } from 'lucide-react'
import Layout from '../components/layout/Layout'
import api from '../services/api'
import OffreCardRecruteur from '../components/OffreCardRecruteur'

// ── Formulaire d'offre SaaS B2B Premium FDE avec gestion d'état ──
function FormulaireOffre({ form, setForm, handleSubmit, erreurForm, submitting }) {
  return (
    <div className="bg-[#041619] border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 mb-8 shadow-2xl transition-all">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#00f098] shadow-[0_0_8px_#00f098]" />
        <h3 className="text-white font-black text-xl tracking-tight">Publier une nouvelle offre d'emploi</h3>
      </div>

      {/* Message d'erreur visible si le backend renvoie un problème */}
      {erreurForm && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-bold mb-5 flex items-center gap-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{erreurForm}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 🏢 SECTION 1 : IDENTITÉ DE L'ENTREPRISE (PME) */}
        <div>
          <p className="text-[#00f098] font-bold text-xs uppercase tracking-wider mb-3">1. Identité de l'entreprise & Localisation</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nom de l'entreprise */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nom de l'entreprise / PME</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.entreprise}
                  onChange={e => setForm({...form, entreprise: e.target.value})}
                  placeholder="ex: Wave Sénégal, Free, Sonatel..."
                  required
                  className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all"
                />
              </div>
            </div>

            {/* Upload du Logo de l'entreprise (Fichier PNG / JPG avec aperçu) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Logo de la PME (PNG, JPG)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-between bg-[#0b1a19] border border-white/10 hover:border-[#00f098]/50 px-4 py-3 rounded-xl cursor-pointer transition-all group">
                  <span className={`text-xs font-medium truncate ${form.logoUrl ? 'text-[#00f098] font-bold' : 'text-gray-400 group-hover:text-white'}`}>
                    {form.logoUrl ? 'Logo sélectionné ✓' : 'Sélectionner le logo (PNG, JPG)...'}
                  </span>
                  <Image className={`w-4 h-4 ${form.logoUrl ? 'text-[#00f098]' : 'text-gray-500 group-hover:text-[#00f098]'}`} />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("⚠️ L'image du logo ne doit pas dépasser 2 Mo.")
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setForm(prev => ({ ...prev, logoUrl: reader.result }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>

                {/* Vignette d'aperçu en direct du logo sélectionné */}
                {form.logoUrl && (
                  <div className="w-11 h-11 rounded-xl bg-[#041619] border border-[#00f098]/40 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                    <img src={form.logoUrl} alt="Aperçu logo" className="w-full h-full object-contain rounded-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Localisation / Région</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.localisation}
                  onChange={e => setForm({...form, localisation: e.target.value})}
                  placeholder="ex: Dakar - Almadies, Saint-Louis..."
                  required
                  className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all"
                />
              </div>
            </div>

            {/* Secteur d'activité */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Secteur d'activité</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.secteur}
                  onChange={e => setForm({...form, secteur: e.target.value})}
                  placeholder="ex: Fintech, Télécoms, Numérique..."
                  required
                  className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 💼 SECTION 2 : LE POSTE & CONDITIONS */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-[#00f098] font-bold text-xs uppercase tracking-wider mb-3">2. Détails du poste & Conditions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Titre du poste */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Titre du poste</label>
              <input
                type="text"
                value={form.titre}
                onChange={e => setForm({...form, titre: e.target.value})}
                placeholder="ex: Développeur Full Stack React / Node"
                required
                className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all"
              />
            </div>

            {/* Salaire / Rémunération avec format conseillé */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Rémunération <span className="text-[#00f098] text-[10px] font-semibold lowercase tracking-normal">(ex: 450k – 700k FCFA)</span>
              </label>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.salaire}
                  onChange={e => setForm({...form, salaire: e.target.value})}
                  placeholder="ex: 450k – 700k FCFA (ou À négocier)"
                  className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all"
                />
              </div>
            </div>

            {/* Type de contrat */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Type de contrat</label>
              <select
                value={form.typeContrat}
                onChange={e => setForm({...form, typeContrat: e.target.value})}
                className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f098] transition-all cursor-pointer"
              >
                {['Stage', 'CDD', 'CDI', 'Freelance'].map(t => (
                  <option key={t} value={t} className="bg-[#0b1a19] text-white">{t}</option>
                ))}
              </select>
            </div>

            {/* 🌐 Mode de travail (Liste déroulante : Sur site, Hybride, Télétravail) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Mode de travail</label>
              <select
                value={form.modeTravail}
                onChange={e => setForm({...form, modeTravail: e.target.value})}
                className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f098] transition-all cursor-pointer"
              >
                {['Sur site', 'Hybride', 'Télétravail'].map(m => (
                  <option key={m} value={m} className="bg-[#0b1a19] text-white">{m}</option>
                ))}
              </select>
            </div>

            {/* Niveau d'études requis */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Niveau d'études requis</label>
              <select
                value={form.niveauRequis}
                onChange={e => setForm({...form, niveauRequis: e.target.value})}
                className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f098] transition-all cursor-pointer"
              >
                {['Licence', 'Master', 'Ingénieur', 'Doctorat'].map(n => (
                  <option key={n} value={n} className="bg-[#0b1a19] text-white">{n}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* 🤖 SECTION 3 : COMPÉTENCES IA & DESCRIPTION */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-[#00f098] font-bold text-xs uppercase tracking-wider mb-3">3. Analyse IA & Descriptif</p>
          <div className="space-y-4">
            
            {/* Compétences clés */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Compétences clés <span className="text-[#00f098] text-[10px] font-semibold lowercase tracking-normal">(critiques pour le scoring IA — séparées par des virgules)</span>
              </label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f098] pointer-events-none" />
                <input
                  type="text"
                  value={form.competences}
                  onChange={e => setForm({...form, competences: e.target.value})}
                  placeholder="React, Node.js, MongoDB, Express, Docker"
                  required
                  className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all"
                />
              </div>
            </div>

            {/* Description du poste */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description & Missions</label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                rows={3}
                placeholder="Décrivez les responsabilités principales et le profil idéal..."
                required
                className="w-full bg-[#0b1a19] border border-white/10 text-white rounded-xl p-4 text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f098] transition-all resize-none leading-relaxed"
              />
            </div>

          </div>
        </div>

        {/* Bouton de publication avec indicateur de chargement */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#00f098] hover:bg-[#00d084] text-[#0b1a19] py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,152,0.2)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0b1a19]/30 border-t-[#0b1a19] rounded-full animate-spin" />
              <span>Publication en cours...</span>
            </>
          ) : (
            "Publier l'offre"
          )}
        </button>

      </form>
    </div>
  )
}

export default function DashboardRecruteur() {
  const navigate                = useNavigate()
  const [searchParams]          = useSearchParams()
  const tabActif                = searchParams.get('tab') || ''
  const [offres, setOffres]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const formInitial = {
    titre: '',
    description: '',
    entreprise: '',
    logoUrl: '',
    localisation: 'Dakar, Sénégal',
    modeTravail: 'Sur site',
    secteur: 'Technologie & Numérique',
    salaire: '',
    competences: '',
    niveauRequis: 'Licence',
    typeContrat: 'Stage'
  }

  const [form, setForm]             = useState(formInitial)
  const [erreurForm, setErreurForm] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    chargerOffres()
  }, [])

  const chargerOffres = async () => {
    try {
      const res = await api.get('/offres/mes/offres')
      setOffres(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErreurForm(null)

    try {
      await api.post('/offres', {
        ...form,
        competences: form.competences.split(',').map(c => c.trim())
      })
      setShowForm(false)
      setForm(formInitial)
      chargerOffres()
    } catch (err) {
      console.error("Erreur lors de la création de l'offre :", err)
      setErreurForm(
        err.response?.data?.message || 
        (err.response?.status === 413 ? "❌ L'image du logo est trop volumineuse pour le serveur." : "❌ Erreur lors de la publication de l'offre.")
      )
    } finally {
      setSubmitting(false)
    }
  }

  const offresOuvertes  = offres.filter(o => o.statut === 'ouverte').length
  const offresFermees   = offres.filter(o => o.statut === 'fermée').length
  const dernieresOffres = offres.slice(0, 3)

  return (
    <Layout>

      {/* ══ VUE : MES OFFRES (CANVAS BLANC HAUT CONTRASTE HARMONISÉ) ══ */}
      {tabActif === 'offres' && (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          
          {/* En-tête typographique calibré */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Mes offres</h1>
              <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium">
                {offres.length} offre(s) activement publiée(s) et analysée(s) par l'IA.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                showForm 
                  ? 'bg-[#041619] text-white hover:bg-gray-800' 
                  : 'bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.25)]'
              }`}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Publier une offre'}
            </button>
          </div>

          {showForm && (
            <FormulaireOffre
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              erreurForm={erreurForm}
              submitting={submitting}
            />
          )}

          {loading ? (
            <p className="text-center text-gray-400 py-16 font-medium text-xs">Chargement des offres...</p>
          ) : offres.length === 0 ? (
            <div className="text-center py-16 bg-[#f8fafc] rounded-2xl border border-gray-100">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
              <p className="text-gray-500 font-medium text-xs">Aucune offre publiée pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {offres.map(offre => (
                <OffreCardRecruteur 
                  key={offre._id} 
                  offre={offre} 
                  onToggleStatut={async (id) => {
                    await api.patch(`/offres/${id}/statut`)
                    chargerOffres()
                  }}
                  onVoirCandidats={(id) => navigate(`/ranking/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ VUE : DASHBOARD RECRUTEUR (ACCUEIL HARMONISÉ FDE) ══ */}
      {tabActif === '' && (
        <div className="space-y-6 md:space-y-8 bg-[#0b1a19] p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5">
          
          {/* Header parfaitement aligné */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Tableau de bord Recruteur</h1>
              <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium">Gérez vos offres et découvrez vos futurs talents grâce à l'IA.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center self-start md:self-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                showForm 
                  ? 'bg-[#041619] text-white border border-white/10 hover:bg-white/5' 
                  : 'bg-[#00f098] text-[#0b1a19] hover:bg-[#00d084] shadow-[0_0_15px_rgba(0,240,152,0.2)]'
              }`}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler la création' : 'Publier une offre'}
            </button>
          </div>

          {showForm && (
            <FormulaireOffre
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              erreurForm={erreurForm}
              submitting={submitting}
            />
          )}

          {/* Stats KPIs (Typographie dense FDE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              { label: 'Total offres',      value: offres.length,                                        icon: Briefcase,  color: 'text-white'     },
              { label: 'Offres actives',    value: offresOuvertes,                                       icon: TrendingUp, color: 'text-[#00f098]' },
              { label: 'Offres fermées',    value: offresFermees,                                        icon: XCircle,    color: 'text-white'     },
              { label: 'Types contrats',    value: [...new Set(offres.map(o => o.typeContrat))].length,  icon: Clock,      color: 'text-[#00f098]' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div 
                  key={i} 
                  className="relative overflow-hidden bg-[#041619] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-[#00f098]/30 hover:-translate-y-1 transition-all duration-300 group shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0b1a19] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{s.value}</p>
                </div>
              )
            })}
          </div>

          {/* ── DOUBLE COLONNE CALIBRÉE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne gauche (70%) : Dernières offres */}
            <div className="lg:col-span-2 bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#00f098]" />
                  <h2 className="text-white font-black text-lg tracking-tight">
                    Dernières offres publiées
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/recruteur?tab=offres')}
                  className="text-xs text-gray-300 hover:text-[#00f098] font-bold bg-[#0b1a19] hover:bg-white/5 border border-white/5 hover:border-[#00f098]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                >
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-12 font-medium text-xs">Chargement...</p>
              ) : dernieresOffres.length === 0 ? (
                <div className="text-center py-12 bg-[#0b1a19] rounded-xl border border-white/5">
                  <Briefcase className="w-8 h-8 text-gray-700 mx-auto mb-2.5" />
                  <p className="text-gray-400 text-xs font-medium">Aucune offre publiée pour le moment.</p>
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="mt-4 text-xs bg-[#00f098] text-[#0b1a19] font-black px-4 py-2 rounded-xl hover:bg-[#00d084] transition-all cursor-pointer"
                  >
                    Créer ma première offre
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dernieresOffres.map(offre => (
                    <div key={offre._id} className="rounded-2xl transition-all hover:border-[#00f098]/30">
                      <OffreCardRecruteur 
                        offre={offre} 
                        onToggleStatut={async (id) => {
                          await api.patch(`/offres/${id}/statut`)
                          chargerOffres()
                        }}
                        onVoirCandidats={(id) => navigate(`/ranking/${id}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite (30%) : Actions rapides & Activité */}
            <div className="space-y-6">
              
              {/* Actions rapides */}
              <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
                <h3 className="text-white font-black text-lg tracking-tight mb-4">Actions rapides</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Publier une offre',  icon: Plus,      action: () => setShowForm(true) },
                    { label: 'Voir mes offres',    icon: Briefcase, action: () => navigate('/recruteur?tab=offres') },
                    { label: 'Voir les candidats', icon: Users,     action: () => navigate('/recruteur?tab=offres') },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <button 
                        key={i} 
                        onClick={a.action} 
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-gray-300 bg-[#0b1a19] border border-white/5 hover:border-[#00f098]/30 hover:text-[#00f098] transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#041619] border border-white/5 group-hover:border-[#00f098]/30 text-gray-400 group-hover:text-[#00f098] transition-all flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-[#041619] border border-white/5 rounded-2xl p-6 shadow-md">
                <h3 className="text-white font-black text-lg tracking-tight mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {offres.slice(0, 4).map((o, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-1 rounded-xl transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00f098] shadow-[0_0_6px_#00f098] flex-shrink-0" />
                      <p className="text-gray-300 text-xs truncate">
                        Offre <span className="text-white font-bold">"{o.titre}"</span> publiée
                      </p>
                    </div>
                  ))}
                  {offres.length === 0 && <p className="text-gray-500 text-xs">Aucune activité récente</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}