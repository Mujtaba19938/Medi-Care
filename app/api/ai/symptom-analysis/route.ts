import { streamText } from "ai"
import { groqLlama70b, SYMPTOM_ANALYSIS_PROMPT } from "@/lib/groq"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()

    if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length === 0) {
      return Response.json({ error: "Valid symptoms description is required" }, { status: 400 })
    }

    const result = streamText({
      model: groqLlama70b,
      system: SYMPTOM_ANALYSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please analyze these symptoms: ${symptoms}`,
        },
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in symptom analysis:", error)
    return Response.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}
