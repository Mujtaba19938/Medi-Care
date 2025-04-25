"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReactMarkdown from "react-markdown"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HealthAdvisor() {
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("manual")
  const { user } = useAuth()

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/ai/health-recommendations",
    body: {
      userId: user?.id,
      healthProfile: input,
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
        <CardTitle>AI Health Advisor</CardTitle>
        <CardDescription>
          Get personalized health and wellness recommendations based on your health profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasResponse ? (
          <>
            {user && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Enter Manually</TabsTrigger>
                  <TabsTrigger value="profile">Use My Profile</TabsTrigger>
                </TabsList>
                {activeTab === "profile" && (
                  <Alert className="mt-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Profile Connected</AlertTitle>
                    <AlertDescription>
                      We'll use your stored health information to provide more personalized recommendations. You can
                      still add additional details below.
                    </AlertDescription>
                  </Alert>
                )}
              </Tabs>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Describe your health goals, current lifestyle, any health concerns, and preferences. For example: I'm 35, work a desk job, want to improve energy levels, have mild hypertension, and prefer low-impact exercise."
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
                  "Get Health Recommendations"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{lastMessage.content}</ReactMarkdown>
          </div>
        )}
      </CardContent>
      {hasResponse && (
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            These recommendations are general in nature. Always consult with your healthcare provider.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Start Over
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
