import { PageHeader } from "@/components/page-header"
import { HealthAdvisorWrapper } from "@/components/health-advisor-wrapper"

export const metadata = {
  title: "AI Health Advisor | Medical Center",
  description: "Get personalized health recommendations from our AI health advisor.",
}

// Prevent static optimization for this page
export const dynamic = "force-dynamic"

export default function HealthAdvisorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="AI Health Advisor"
        description="Get personalized health and wellness recommendations based on your profile and health goals."
      />

      <div className="mt-8 max-w-3xl mx-auto">
        <HealthAdvisorWrapper />

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Our AI Health Advisor provides personalized recommendations based on your health profile, goals, and
            concerns. The more information you provide, the more tailored the recommendations will be.
          </p>
          <p className="text-gray-700">
            These recommendations are for general wellness purposes and should be discussed with your healthcare
            provider before making significant changes to your health routine.
          </p>
        </div>
      </div>
    </div>
  )
}
