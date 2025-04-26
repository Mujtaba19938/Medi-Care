"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { HeartPulse } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const { toast } = useToast()
  const { signIn, resendVerificationEmail, redirectToRoleDashboard } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setEmailError(null)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Login error details:", error)

        // Check if this is an email not confirmed error
        if (error.message?.includes("Email not confirmed")) {
          setEmailError(
            "Your email has not been verified. Please check your inbox or click below to resend the verification email.",
          )
          throw new Error("Email not confirmed")
        }

        throw error
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      // Check if the email contains "admin" or "doctor" and redirect accordingly
      if (email.includes("admin")) {
        router.push("/admin")
      } else if (email.includes("doctor")) {
        router.push("/doctor")
      } else {
        // Regular user
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // Don't show toast for email not confirmed error as we're showing inline error
      if (error.message !== "Email not confirmed") {
        toast({
          title: "Login failed",
          description: error.message || "There was a problem logging in. Please check your credentials.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend the verification email.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await resendVerificationEmail(email)

      if (error) {
        throw error
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification email.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend verification email",
        description: error.message || "There was a problem sending the verification email. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="mx-auto flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">MediCare</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Patient Login</CardTitle>
          <CardDescription>Enter your credentials to access your patient portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {emailError && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">{emailError}</h3>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="text-sm font-medium text-yellow-800 underline hover:text-yellow-600"
                      >
                        Resend verification email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account?</span>{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm">
            <span className="text-gray-500">Are you an administrator?</span>{" "}
            <Link href="/admin/login" className="text-blue-600 hover:underline">
              Admin Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
