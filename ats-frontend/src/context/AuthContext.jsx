import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Initialisation synchrone : on lit le LocalStorage AVANT le premier rendu
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('token', tokenData)
    localStorage.setItem('user',  JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)