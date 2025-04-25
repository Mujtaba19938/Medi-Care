import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, HeartPulse, Phone, Stethoscope, Users } from "lucide-react"

export const metadata = {
  title: "Services - MediCare",
  description: "Comprehensive healthcare services for you and your family.",
}

export default function ServicesPage() {
  const services = [
    {
      title: "Primary Care",
      description:
        "Comprehensive healthcare for patients of all ages, from routine check-ups to managing chronic conditions.",
      icon: <Stethoscope className="h-10 w-10 text-blue-600" />,
      content:
        "Our primary care physicians provide comprehensive healthcare services for patients of all ages. From routine check-ups and preventive care to managing chronic conditions, our team is dedicated to keeping you and your family healthy. We focus on building long-term relationships with our patients to provide personalized care that meets your unique needs.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Pediatrics",
      description:
        "Specialized care for infants, children, and adolescents, focusing on growth, development, and preventive care.",
      icon: <Users className="h-10 w-10 text-blue-600" />,
      content:
        "Our pediatric team provides specialized care for infants, children, and adolescents. We focus on monitoring growth and development, providing preventive care, and treating childhood illnesses and conditions. Our child-friendly environment and compassionate approach help make medical visits a positive experience for young patients and their families.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Cardiology",
      description:
        "Diagnosis and treatment of heart conditions, including heart disease, arrhythmias, and heart failure.",
      icon: <HeartPulse className="h-10 w-10 text-blue-600" />,
      content:
        "Our cardiology department offers comprehensive care for heart conditions, including heart disease, arrhythmias, and heart failure. Using advanced diagnostic tools and treatment approaches, our cardiologists work to improve heart health and quality of life for patients with cardiovascular conditions. We also provide preventive cardiology services to help patients reduce their risk of heart disease.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Women's Health",
      description: "Comprehensive care addressing the unique health needs of women at every stage of life.",
      icon: <Users className="h-10 w-10 text-blue-600" />,
      content:
        "Our women's health services address the unique health needs of women at every stage of life. From routine gynecological exams and family planning to menopause management and preventive screenings, our team provides compassionate, comprehensive care. We empower women to take an active role in their health through education and personalized treatment plans.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Preventive Care",
      description:
        "Services focused on maintaining health and preventing disease, including vaccinations and screenings.",
      icon: <Calendar className="h-10 w-10 text-blue-600" />,
      content:
        "Our preventive care services focus on maintaining health and preventing disease before it starts. We offer a range of preventive services, including vaccinations, health screenings, and lifestyle counseling. Our team works with you to develop personalized prevention plans based on your age, health status, and risk factors, helping you stay healthy and catch potential issues early.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Telemedicine",
      description:
        "Virtual consultations allowing you to connect with our healthcare providers from the comfort of your home.",
      icon: <Phone className="h-10 w-10 text-blue-600" />,
      content:
        "Our telemedicine services allow you to connect with our healthcare providers from the comfort of your home. Virtual consultations are available for many types of appointments, including follow-ups, medication management, and minor illness treatment. Telemedicine offers a convenient option for receiving quality care while saving time and reducing exposure to illness.",
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive healthcare services for you and your family at every stage of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`grid gap-6 items-center py-8 ${index !== 0 ? "border-t" : ""} ${index % 2 === 0 ? "lg:grid-cols-2" : "lg:grid-cols-2 lg:grid-flow-dense"}`}
            >
              <div className={`space-y-4 ${index % 2 !== 0 ? "lg:order-last" : ""}`}>
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                  {service.icon}
                </div>
                <h2 className="text-3xl font-bold">{service.title}</h2>
                <p className="text-gray-500">{service.content}</p>
                <Button asChild>
                  <Link href="/contact">Book Appointment</Link>
                </Button>
              </div>
              <div className="mx-auto">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          ))}
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
