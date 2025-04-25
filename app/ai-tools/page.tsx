import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Calendar, HeartPulse } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "AI Health Tools | Medical Center",
  description:
    "Explore our AI-powered health tools for symptom analysis, appointment recommendations, and personalized health advice.",
}

export default function AIToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="AI-Powered Health Tools"
        description="Cutting-edge AI tools to help you make informed decisions about your health"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="flex flex-col">
          <CardHeader>
            <Brain className="h-8 w-8 mb-2 text-blue-600" />
            <CardTitle>Symptom Analyzer</CardTitle>
            <CardDescription>
              Describe your symptoms and get an AI-powered analysis to help understand potential causes and next steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500">
              Our symptom analyzer uses advanced AI to help you better understand your health concerns and determine if
              you should seek medical attention.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/ai-tools/symptom-analyzer">Try Symptom Analyzer</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <Calendar className="h-8 w-8 mb-2 text-blue-600" />
            <CardTitle>Appointment Recommender</CardTitle>
            <CardDescription>
              Get AI recommendations for the type of appointment that best suits your health needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500">
              Describe your health concerns and preferences, and our AI will suggest the most appropriate type of
              appointment, potential specialists, and timing.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/ai-tools/appointment-recommender">Get Appointment Recommendations</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <HeartPulse className="h-8 w-8 mb-2 text-blue-600" />
            <CardTitle>Health Advisor</CardTitle>
            <CardDescription>
              Receive personalized health recommendations based on your profile and goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500">
              Our AI Health Advisor provides tailored lifestyle, nutrition, and wellness recommendations to help you
              achieve your health goals.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/ai-tools/health-advisor">Get Health Recommendations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">About Our AI Tools</h2>
        <p className="text-gray-700 mb-4">
          Our AI-powered health tools are designed to provide information and guidance to help you make better health
          decisions. These tools use advanced artificial intelligence to analyze your input and provide personalized
          recommendations.
        </p>
        <p className="text-gray-700">
          <strong>Important:</strong> While our AI tools can provide helpful insights, they are not a substitute for
          professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for
          medical concerns.
        </p>
      </div>
    </div>
  )
}
