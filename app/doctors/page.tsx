import { createServerClient } from "@/utils/supabase/server"
import { DoctorCard } from "@/components/doctor-card"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Our Doctors | Medical Center",
  description: "Meet our team of experienced healthcare professionals dedicated to providing exceptional care.",
}

export default async function DoctorsPage() {
  const supabase = createServerClient()
  const { data: doctors, error } = await supabase.from("doctors").select("*").order("name")

  if (error) {
    console.error("Error fetching doctors:", error)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Our Doctors"
        description="Meet our team of experienced healthcare professionals dedicated to providing exceptional care."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {doctors && doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}

        {(!doctors || doctors.length === 0) && (
          <p className="text-center col-span-full text-gray-500">No doctors found. Please check back later.</p>
        )}
      </div>
    </div>
  )
}
