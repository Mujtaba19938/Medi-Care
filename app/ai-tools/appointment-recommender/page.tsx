import { PageHeader } from "@/components/page-header"
import { AppointmentRecommenderWrapper } from "@/components/appointment-recommender-wrapper"

export const metadata = {
  title: "AI Appointment Recommender | Medical Center",
  description: "Get AI-powered recommendations for the best type of appointment based on your health concerns.",
}

// Prevent static optimization for this page
export const dynamic = "force-dynamic"

export default function AppointmentRecommenderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="AI Appointment Recommender"
        description="Describe your health concerns and our AI will recommend the best type of appointment for you."
      />

      <div className="mt-8 max-w-3xl mx-auto">
        <AppointmentRecommenderWrapper />

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Our AI Appointment Recommender analyzes your health concerns and preferences to suggest the most appropriate
            type of appointment, potential specialists, and optimal timing. This helps you make informed decisions about
            your healthcare needs.
          </p>
          <p className="text-gray-700">
            After receiving recommendations, you can proceed to book an appointment through our contact form or by
            calling our office directly.
          </p>
        </div>
      </div>
    </div>
  )
}
