"use client"

import dynamic from "next/dynamic"

// Dynamically import the client component with SSR disabled
const AppointmentRecommender = dynamic(
  () => import("@/components/appointment-recommender").then((mod) => mod.AppointmentRecommender),
  { ssr: false },
)

export function AppointmentRecommenderWrapper() {
  return <AppointmentRecommender />
}
