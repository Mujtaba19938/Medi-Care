import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, HeartPulse, Users } from "lucide-react"
import { getServerClient } from "@/lib/supabase"

type Doctor = {
  id: string
  name: string
  role: string
  bio: string
  image_url: string
}

export const metadata = {
  title: "About Us - MediCare",
  description: "Learn about our medical practice and our commitment to quality healthcare.",
}

export const revalidate = 3600 // Revalidate every hour

async function getDoctors() {
  const supabase = getServerClient()

  const { data, error } = await supabase.from("doctors").select("*").order("name")

  if (error) {
    console.error("Error fetching doctors:", error)
    return []
  }

  return data as Doctor[]
}

export default async function AboutPage() {
  const doctors = await getDoctors()

  // Fallback doctors if none are in the database
  const fallbackDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "Primary Care Physician",
      bio: "Dr. Johnson has over 15 years of experience in family medicine. She is board-certified and specializes in preventive care and chronic disease management.",
      image_url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      bio: "Dr. Chen is a board-certified cardiologist with expertise in heart disease prevention, diagnosis, and treatment. He has been practicing for over 20 years.",
      image_url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      bio: "Dr. Rodriguez specializes in pediatric care from newborns to adolescents. She is passionate about child development and preventive healthcare.",
      image_url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      role: "Women's Health Specialist",
      bio: "Dr. Wilson has dedicated his career to women's health, providing comprehensive care for women at all stages of life.",
      image_url: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Use doctors from database or fallback if empty
  const displayDoctors = doctors.length > 0 ? doctors : fallbackDoctors

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About MediCare</h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our medical practice is dedicated to providing high-quality, compassionate healthcare for the entire
                family. With a team of experienced physicians and state-of-the-art facilities, we strive to meet all
                your healthcare needs.
              </p>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                src="/placeholder.svg?height=550&width=550"
                alt="Medical team"
                width={550}
                height={550}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mx-auto">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Our history"
                width={500}
                height={500}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-gray-500">
                Founded in 1995, MediCare began as a small family practice with a mission to provide personalized
                healthcare to our community. Over the years, we've grown into a comprehensive medical center offering a
                wide range of services, but our commitment to compassionate, patient-centered care remains unchanged.
              </p>
              <p className="text-gray-500">
                Our team of dedicated healthcare professionals works together to ensure that each patient receives the
                highest quality care in a comfortable and welcoming environment. We believe in treating the whole
                person, not just the symptoms, and in building lasting relationships with our patients based on trust
                and respect.
              </p>
              <p className="text-gray-500">
                Today, MediCare is proud to serve thousands of patients in our community, providing everything from
                routine check-ups to specialized care. As we continue to grow, we remain committed to our founding
                principles and to advancing healthcare through innovation, education, and compassion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Values</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The principles that guide our practice and care.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <HeartPulse className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Compassion</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We approach every patient with empathy and understanding, recognizing that each person's healthcare
                  journey is unique.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Excellence</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We are committed to providing the highest quality care through continuous learning, innovation, and
                  adherence to best practices.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Respect</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We honor the dignity and diversity of our patients, staff, and community, treating everyone with
                  courtesy and respect.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Accessibility</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We strive to make healthcare accessible to all, offering convenient hours, telemedicine options, and a
                  range of services.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Collaboration</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We work together as a team and partner with our patients to achieve the best possible health outcomes.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <HeartPulse className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Integrity</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We conduct ourselves with honesty, transparency, and ethical behavior in all aspects of our practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet Our Team</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our experienced healthcare professionals are dedicated to providing you with the best care possible.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            {displayDoctors.map((doctor) => (
              <Card key={doctor.id} className="border-0 shadow-md overflow-hidden">
                <div className="aspect-square w-full">
                  <Image
                    src={doctor.image_url || "/placeholder.svg?height=300&width=300"}
                    alt={doctor.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold">{doctor.name}</h3>
                  <p className="text-sm text-blue-600">{doctor.role}</p>
                  <p className="text-xs text-gray-500 mt-2">{doctor.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Medical Family</h2>
              <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience the difference of patient-centered care at MediCare.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Book Appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
