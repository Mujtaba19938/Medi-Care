import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Create a new Supabase client with service role key (only available on the server)
    const supabaseUrl = process.env.SUPABASE_URL as string
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First, try to find the user
    const { data: users, error: userError } = await supabase
      .from("auth.users")
      .select("id, email")
      .eq("email", email)
      .limit(1)

    if (userError) {
      console.error("Error finding user:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // For development purposes, manually update the email_confirmed_at field
    const { error: updateError } = await supabase
      .from("auth.users")
      .update({ email_confirmed_at: new Date().toISOString() })
      .eq("email", email)
      .is("email_confirmed_at", null)

    if (updateError) {
      console.error("Error confirming email:", updateError)
      // Continue anyway, as the user might already be confirmed
    }

    // Now try to sign in normally
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Authentication error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error("Unexpected API error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
