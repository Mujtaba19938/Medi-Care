import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, HeartPulse, Phone, Stethoscope, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Compassionate Healthcare for Your Family
              </h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We provide comprehensive medical care with a focus on patient comfort and well-being. Our team of
                experienced doctors is dedicated to your health.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">Book Appointment</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                src="/placeholder.svg?height=550&width=550"
                alt="Medical team"
                width={550}
                height={550}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Us</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We combine cutting-edge medical technology with compassionate care to provide the best healthcare
                experience.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <HeartPulse className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Expert Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Our board-certified physicians provide expert medical care using the latest techniques and
                  technologies.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Convenient Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We offer extended hours and weekend appointments to accommodate your busy schedule.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Patient-Centered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We believe in a patient-centered approach, ensuring you're involved in every decision about your
                  health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive healthcare services for you and your family.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Primary Care",
                description:
                  "Comprehensive healthcare for patients of all ages, from routine check-ups to managing chronic conditions.",
                icon: <Stethoscope className="h-10 w-10 text-blue-600" />,
              },
              {
                title: "Pediatrics",
                description:
                  "Specialized care for infants, children, and adolescents, focusing on growth, development, and preventive care.",
                icon: <Users className="h-10 w-10 text-blue-600" />,
              },
              {
                title: "Cardiology",
                description:
                  "Diagnosis and treatment of heart conditions, including heart disease, arrhythmias, and heart failure.",
                icon: <HeartPulse className="h-10 w-10 text-blue-600" />,
              },
              {
                title: "Women's Health",
                description: "Comprehensive care addressing the unique health needs of women at every stage of life.",
                icon: <Users className="h-10 w-10 text-blue-600" />,
              },
              {
                title: "Preventive Care",
                description:
                  "Services focused on maintaining health and preventing disease, including vaccinations and screenings.",
                icon: <Calendar className="h-10 w-10 text-blue-600" />,
              },
              {
                title: "Telemedicine",
                description:
                  "Virtual consultations allowing you to connect with our healthcare providers from the comfort of your home.",
                icon: <Phone className="h-10 w-10 text-blue-600" />,
              },
            ].map((service, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Patient Testimonials</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear what our patients have to say about their experience with us.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                testimonial:
                  "The doctors and staff are incredibly caring and professional. They took the time to listen to my concerns and provided excellent care.",
              },
              {
                name: "Michael Chen",
                testimonial:
                  "I've been a patient for over 5 years and have always received top-notch care. The online appointment system makes scheduling so convenient.",
              },
              {
                name: "Emily Rodriguez",
                testimonial:
                  "As a new patient, I was impressed by how welcoming everyone was. The doctor was thorough and explained everything clearly.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="space-y-2 text-center">
                      <p className="text-sm text-gray-500 italic">"{testimonial.testimonial}"</p>
                      <h3 className="font-medium">{testimonial.name}</h3>
                    </div>
                  </div>
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Schedule Your Visit?
              </h2>
              <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Book an appointment today and take the first step towards better health.
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
