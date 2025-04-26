"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { HeartPulse } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function AdminSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate that the email contains "admin"
      if (!email.includes("admin")) {
        throw new Error("Admin email must contain 'admin' (e.g., admin@example.com)")
      }

      // Validate password match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      console.log("Admin signup attempt with email:", email)
      const { error } = await signUp(email, password, "admin")

      if (error) {
        console.error("Admin signup error details:", error)
        throw error
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      })

      router.push("/admin/login")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>Create a new administrator account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Email must contain "admin" (e.g., admin@example.com)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Admin Account"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/admin/login" className="text-blue-600 hover:underline">
                Already have an admin account? Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
