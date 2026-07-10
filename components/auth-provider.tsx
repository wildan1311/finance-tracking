"use client"

import * as React from "react"

export type User = {
  id: string
  name: string
  email: string
}

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const STORAGE_KEY = "finance.auth.user"

const AuthContext = React.createContext<AuthContextValue | null>(null)

/**
 * Mock authentication provider.
 *
 * This is a client-side-only stand-in so the boilerplate works without a
 * backend. Any email/password is accepted. Replace `signIn` with a real
 * request (e.g. Better Auth, Supabase, or your API) when going to production.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw) as User)
    } catch {
      // ignore malformed storage
    }
    setIsLoading(false)
  }, [])

  const signIn = React.useCallback(async (email: string, _password: string) => {
    // Simulate a network round-trip.
    await new Promise((resolve) => setTimeout(resolve, 600))
    const nextUser: User = {
      id: "usr_demo",
      name: email.split("@")[0].replace(/[._-]/g, " ") || "Demo User",
      email,
    }
    setUser(nextUser)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }, [])

  const signOut = React.useCallback(() => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = React.useMemo(
    () => ({ user, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.")
  }
  return context
}
