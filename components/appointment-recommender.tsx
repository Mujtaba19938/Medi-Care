"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AppointmentRecommender() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/ai/appointment-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientNeeds: input }),
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.response)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartOver = () => {
    setInput("")
    setResponse(null)
    setSubmitted(false)
    setError(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Appointment Recommender</CardTitle>
        <CardDescription>
          Describe your health concerns and preferences, and our AI will recommend the best type of appointment for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Describe your health concerns, symptoms, and any preferences for appointment scheduling. For example: I've been experiencing lower back pain for two weeks, it's worse in the morning, and I prefer afternoon appointments."
              className="min-h-32"
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message || "Something went wrong. Please try again."}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating recommendations...
                </>
              ) : (
                "Get Appointment Recommendations"
              )}
            </Button>
          </form>
        ) : (
          <div className="prose prose-sm max-w-none">
            {response && <div className="whitespace-pre-wrap">{response}</div>}
          </div>
        )}
      </CardContent>
      {submitted && response && (
        <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-4 gap-4">
          <p className="text-sm text-muted-foreground">
            These are recommendations only. Actual appointment availability may vary.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
            <Button asChild>
              <Link href="/contact">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default AppointmentRecommender
