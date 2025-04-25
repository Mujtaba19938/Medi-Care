"use client"

import dynamic from "next/dynamic"

// Dynamically import the client component with SSR disabled
const SymptomAnalyzer = dynamic(() => import("@/components/symptom-analyzer").then((mod) => mod.SymptomAnalyzer), {
  ssr: false,
})

export function SymptomAnalyzerWrapper() {
  return <SymptomAnalyzer />
}
