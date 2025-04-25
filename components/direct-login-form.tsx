"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export function DirectLoginForm() {
  const [email, setEmail] = useState("admin@medicarehealth.com")
  const [password, setPassword] = useState("admin123")
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Try the direct login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      // Redirect based on email domain
      if (email.includes("admin")) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // Check if it's an email confirmation error
      if (error.message && error.message.includes("Email not confirmed")) {
        toast({
          title: "Email not confirmed",
          description: "Please confirm your email before logging in or use the 'Confirm Email' button below.",
          variant: "destructive",
        })
      } else {
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

  const handleConfirmEmail = async () => {
    setIsConfirmingEmail(true)
    try {
      const response = await fetch("/api/auth/confirm-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm email")
      }

      setEmailConfirmed(true)
      toast({
        title: "Email confirmed",
        description: "Your email has been confirmed. You can now log in.",
      })
    } catch (error: any) {
      console.error("Error confirming email:", error)
      toast({
        title: "Failed to confirm email",
        description: error.message || "There was a problem confirming your email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConfirmingEmail(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Direct Admin Login</CardTitle>
        <CardDescription>This form bypasses normal login restrictions for testing purposes.</CardDescription>
      </CardHeader>
      <CardContent>
        {emailConfirmed && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Email Confirmed</AlertTitle>
            <AlertDescription>Your email has been confirmed. You can now log in.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="direct-email">Email</Label>
            <Input id="direct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direct-password">Password</Label>
            <Input
              id="direct-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleConfirmEmail}
              disabled={isConfirmingEmail}
            >
              {isConfirmingEmail ? "Confirming..." : "Confirm Email (For Testing)"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
