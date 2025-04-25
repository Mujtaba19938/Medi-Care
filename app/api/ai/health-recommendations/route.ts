import { streamText } from "ai"
import { groqLlama70b, HEALTH_RECOMMENDATIONS_PROMPT } from "@/lib/groq"
import { getServerClient } from "@/lib/supabase"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { userId, healthProfile } = await req.json()

    if (!healthProfile || typeof healthProfile !== "string" || healthProfile.trim().length === 0) {
      return Response.json({ error: "Valid health profile information is required" }, { status: 400 })
    }

    // If userId is provided, we can fetch additional profile data from Supabase
    let additionalInfo = ""
    if (userId) {
      const supabase = getServerClient()
      const { data: profile } = await supabase
        .from("profiles")
        .select("allergies, medical_conditions")
        .eq("id", userId)
        .single()

      if (profile) {
        additionalInfo = `\nAdditional information from patient profile:
        - Allergies: ${profile.allergies || "None recorded"}
        - Medical conditions: ${profile.medical_conditions || "None recorded"}`
      }
    }

    const result = streamText({
      model: groqLlama70b,
      system: HEALTH_RECOMMENDATIONS_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please provide health recommendations based on this profile: ${healthProfile}${additionalInfo}`,
        },
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in health recommendations:", error)
    return Response.json({ error: "Failed to generate health recommendations" }, { status: 500 })
  }
}
