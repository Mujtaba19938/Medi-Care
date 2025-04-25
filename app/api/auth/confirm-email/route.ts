import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create a new Supabase client with service role key (only available on the server)
    const supabaseUrl = process.env.SUPABASE_URL as string
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update the user's email_confirmed_at field
    const { error } = await supabase.rpc("confirm_user_email", { email_to_confirm: email })

    if (error) {
      console.error("Error confirming email:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Email confirmed successfully",
    })
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
