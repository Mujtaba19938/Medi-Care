"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { HeartPulse, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const { toast } = useToast()
  const { signIn, resendVerificationEmail } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const userType = searchParams.get("type") || "user"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setEmailNotConfirmed(false)

    try {
      console.log("Login attempt with email:", email)
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Login error details:", error)

        // Check if the error is about email confirmation
        if (error.message && error.message.includes("Email not confirmed")) {
          setEmailNotConfirmed(true)
          throw new Error(
            "Please verify your email address before logging in. Check your inbox for a verification link.",
          )
        }

        throw error
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      // Redirect based on email domain
      if (email.includes("admin")) {
        router.push("/admin")
      } else if (email.includes("doctor")) {
        router.push("/doctor")
      } else {
        router.push(callbackUrl)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "There was a problem logging in. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend the verification email.",
        variant: "destructive",
      })
      return
    }

    setIsResendingEmail(true)
    try {
      const { error } = await resendVerificationEmail(email)

      if (error) {
        throw error
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      })
    } catch (error: any) {
      console.error("Error resending verification email:", error)
      toast({
        title: "Failed to resend verification email",
        description: error.message || "There was a problem sending the verification email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
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
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        {emailNotConfirmed && (
          <div className="px-6">
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email not verified</AlertTitle>
              <AlertDescription>
                Please verify your email address before logging in.
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold ml-1"
                  onClick={handleResendVerificationEmail}
                  disabled={isResendingEmail}
                >
                  {isResendingEmail ? "Sending..." : "Resend verification email"}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs defaultValue={userType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
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
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          <TabsContent value="doctor">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="doctor-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Doctor"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          <TabsContent value="admin">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-800">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
