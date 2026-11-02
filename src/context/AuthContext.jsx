import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { supabase, isConfigured } from "../lib/supabase"

const AuthContext = createContext(null)

export const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Turn Supabase errors into translation keys (auth.*), never raw server messages.
const errorKey = (error) => {
  const code = error?.code ?? ""
  const msg = (error?.message ?? "").toLowerCase()
  if (code === "invalid_credentials" || msg.includes("invalid login")) return "auth.invalidCredentials"
  if (code === "email_not_confirmed" || msg.includes("not confirmed")) return "auth.emailNotConfirmed"
  if (code === "user_already_exists" || msg.includes("already registered")) return "auth.emailTaken"
  if (code === "email_address_invalid") return "auth.emailInvalid"
  if (code === "weak_password") return "auth.passwordShort"
  if (code.includes("rate_limit") || error?.status === 429) return "auth.rateLimited"
  return "auth.genericError"
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isConfigured)

  // Keep the session in sync (login, logout, token refresh, other tabs).
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // Load the public profile (username) for the signed-in user.
  const userId = session?.user?.id
  useEffect(() => {
    if (!supabase || !userId) return
    let cancelled = false
    supabase
      .from("profiles")
      .select("id, username, created_at")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const signUp = useCallback(async ({ email, password, username }) => {
    if (!supabase) return { error: "auth.notConfigured" }
    if (!USERNAME_RE.test(username)) return { error: "auth.usernameInvalid" }
    if (!EMAIL_RE.test(email)) return { error: "auth.emailInvalid" }
    if (password.length < 8) return { error: "auth.passwordShort" }

    const { data: available, error: checkError } = await supabase.rpc("username_available", { name: username })
    if (checkError) return { error: "auth.genericError" }
    if (!available) return { error: "auth.usernameTaken" }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username }, emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}login` },
    })
    if (error) {
      // The profile trigger fails if someone grabbed the username a moment ago.
      if ((error.message ?? "").toLowerCase().includes("database error")) return { error: "auth.usernameTaken" }
      return { error: errorKey(error) }
    }
    // With email confirmation on, an existing email returns a user with no identities.
    if (data.user && data.user.identities?.length === 0) return { error: "auth.emailTaken" }
    return { needsConfirmation: !data.session }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabase) return { error: "auth.notConfigured" }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: errorKey(error) } : {}
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!supabase) return { error: "auth.notConfigured" }
    const { error } = await supabase.rpc("delete_my_account")
    if (error) return { error: "auth.genericError" }
    await supabase.auth.signOut()
    setProfile(null)
    return {}
  }, [])

  const user = session?.user ?? null
  const value = {
    configured: isConfigured,
    loading,
    user,
    profile: user ? profile : null,
    signUp,
    signIn,
    signOut,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
