'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Admin {
  id: string
  name: string
  email: string
}

interface AdminContextType {
  admin: Admin | null
  token: string | null
  login: (token: string, admin: Admin) => void
  logout: () => void
  isAdmin: boolean
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token')
    const storedAdmin = localStorage.getItem('admin_user')
    if (storedToken && storedAdmin) {
      try {
        setToken(storedToken)
        setAdmin(JSON.parse(storedAdmin))
      } catch {}
    }
  }, [])

  const login = (tok: string, adm: Admin) => {
    localStorage.setItem('admin_token', tok)
    localStorage.setItem('admin_user', JSON.stringify(adm))
    setToken(tok)
    setAdmin(adm)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, isAdmin: !!admin }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
