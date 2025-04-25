import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    // Create a new Supabase client
    const supabaseUrl = process.env.SUPABASE_URL as string
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role || "user",
        },
        emailRedirectTo: `${request.headers.get("origin")}/auth/callback`,
      },
    })

    if (error) {
      console.error("API registration error:", error)
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
