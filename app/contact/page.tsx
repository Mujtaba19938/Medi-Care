import { createServerClient } from "@/utils/supabase/server"
import ContactForm from "@/components/contact-form"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Contact Us | Medical Center",
  description: "Schedule an appointment or get in touch with our medical center.",
}

export default async function ContactPage() {
  const supabase = createServerClient()
  const { data: services, error } = await supabase.from("services").select("id, name").order("name")

  if (error) {
    console.error("Error fetching services:", error)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Contact Us" description="Schedule an appointment or get in touch with our medical center." />

      <div className="max-w-2xl mx-auto mt-12">
        <ContactForm services={services || []} />
      </div>
    </div>
  )
}
