import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

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