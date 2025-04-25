import { PageHeader } from "@/components/page-header"
import { SymptomAnalyzerWrapper } from "@/components/symptom-analyzer-wrapper"

export const metadata = {
  title: "AI Symptom Analyzer | Medical Center",
  description: "Get AI-powered analysis of your symptoms and health concerns.",
}

// Prevent static optimization for this page
export const dynamic = "force-dynamic"

export default function SymptomAnalyzerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="AI Symptom Analyzer"
        description="Describe your symptoms and our AI will provide an analysis to help you understand your health concerns."
      />

      <div className="mt-8 max-w-3xl mx-auto">
        <SymptomAnalyzerWrapper />

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Important Medical Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The AI Symptom Analyzer is provided for informational purposes only and is not a substitute for professional
            medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health
            provider with any questions you may have regarding a medical condition.
          </p>
          <p className="text-gray-700">
            If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
