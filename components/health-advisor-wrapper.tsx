"use client"

import dynamic from "next/dynamic"

// Dynamically import the client component with SSR disabled
const HealthAdvisor = dynamic(() => import("@/components/health-advisor").then((mod) => mod.HealthAdvisor), {
  ssr: false,
})

export function HealthAdvisorWrapper() {
  return <HealthAdvisor />
}
