"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReactMarkdown from "react-markdown"

export function SymptomAnalyzer() {
  const [submitted, setSubmitted] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/ai/symptom-analysis",
    body: {
      symptoms: input,
    },
    onResponse: () => {
      setSubmitted(true)
    },
  })

  const lastMessage = messages[messages.length - 1]
  const hasResponse = submitted && lastMessage?.role === "assistant"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Symptom Analyzer</CardTitle>
        <CardDescription>
          Describe your symptoms in detail and our AI will help analyze them. This is not a medical diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasResponse ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Describe your symptoms in detail. For example: I've had a headache for 3 days, along with mild fever and fatigue."
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
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
          </form>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{lastMessage.content}</ReactMarkdown>
          </div>
        )}
      </CardContent>
      {hasResponse && (
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Remember: This is not a medical diagnosis. Always consult with a healthcare professional.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Start Over
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
