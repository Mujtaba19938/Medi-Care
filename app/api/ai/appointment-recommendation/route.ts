import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { patientNeeds } = await request.json()

    if (!patientNeeds || typeof patientNeeds !== "string") {
      return NextResponse.json({ error: "Invalid request. Please provide patient needs." }, { status: 400 })
    }

    // Fetch doctors and services data to provide context
    const { data: doctors } = await supabase.from("doctors").select("name, specialty").limit(10)
    const { data: services } = await supabase.from("services").select("name, description").limit(10)

    // Generate the prompt with available doctors and services
    const doctorsInfo =
      doctors?.map((d) => `${d.name} (${d.specialty})`).join(", ") || "No doctor information available"
    const servicesInfo = services?.map((s) => s.name).join(", ") || "No service information available"

    // Use Groq API directly since we're having issues with the AI SDK
    const GROQ_API_KEY = process.env.GROQ_API_KEY

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const prompt = `
      You are an AI medical assistant for a medical center. A patient has described their health concerns and preferences.
      Based on their description, recommend:
      1. The type of appointment they should schedule (e.g., regular check-up, specialist consultation, urgent care)
      2. Which specialist or doctor might be most appropriate
      3. How soon they should seek medical attention
      4. Any preparation they should do before the appointment
      
      Available doctors at our center: ${doctorsInfo}
      Available services: ${servicesInfo}
      
      Patient's description: "${patientNeeds}"
      
      Provide a helpful, informative response in a friendly tone. Include a disclaimer that this is not medical advice and serious concerns should be addressed immediately through emergency services.
    `

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Groq API error:", errorData)
      return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in appointment recommendation:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
