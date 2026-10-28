import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#041619] text-white relative">
      {/* Sidebar intelligente : tiroir sur mobile, fixe sur grand écran */}
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleMenu={() => setMobileMenuOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}