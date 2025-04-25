"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type UserRole = "user" | "doctor" | "admin"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  userRole: UserRole | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, role?: UserRole) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resendVerificationEmail: (email: string) => Promise<{ error: any }>
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const supabase = getBrowserClient()
  const router = useRouter()

  // Function to refresh the session
  const refreshSession = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error("Error refreshing session:", error)

        // If we get a refresh_token_not_found error, clear the session
        if (
          error.message?.includes("refresh_token_not_found") ||
          error.name === "AuthApiError" ||
          error.status === 400
        ) {
          await signOut()
          return false
        }
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
        return true
      }

      return false
    } catch (error) {
      console.error("Unexpected error refreshing session:", error)
      return false
    }
  }

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)

        // Determine user role based on email or user metadata
        if (session?.user) {
          const email = session.user.email || ""
          const userMetadata = session.user.user_metadata

          if (userMetadata && userMetadata.role) {
            setUserRole(userMetadata.role as UserRole)
          } else if (email.includes("admin")) {
            setUserRole("admin")
          } else if (email.includes("doctor")) {
            setUserRole("doctor")
          } else {
            setUserRole("user")
          }
        } else {
          setUserRole(null)
        }
      } catch (error) {
        console.error("Unexpected error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      // Determine user role based on email or user metadata
      if (session?.user) {
        const email = session.user.email || ""
        const userMetadata = session.user.user_metadata

        if (userMetadata && userMetadata.role) {
          setUserRole(userMetadata.role as UserRole)
        } else if (email.includes("admin")) {
          setUserRole("admin")
        } else if (email.includes("doctor")) {
          setUserRole("doctor")
        } else {
          setUserRole("user")
        }
      } else {
        setUserRole(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Authentication error:", error)
        return { error }
      }

      console.log("Sign in successful:", data)
      return { data, error: null }
    } catch (error) {
      console.error("Unexpected error during sign in:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, role: UserRole = "user") => {
    try {
      console.log("Attempting to sign up with:", email, "role:", role)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Registration error:", error)
        return { error }
      }

      console.log("Sign up successful:", data)
      return { data, error: null }
    } catch (error) {
      console.error("Unexpected error during sign up:", error)
      return { error }
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      console.log("Resending verification email to:", email)
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error resending verification email:", error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error("Unexpected error resending verification email:", error)
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const value = {
    user,
    session,
    isLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    resendVerificationEmail,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
