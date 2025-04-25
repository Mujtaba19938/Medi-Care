import Link from "next/link"
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 py-12">
      <div className="container grid gap-8 px-4 md:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">MediCare</span>
          </Link>
          <p className="text-sm text-gray-500">Providing compassionate healthcare for your family since 1995.</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Quick Links</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <Link href="/services" className="text-sm text-gray-500 hover:text-blue-600">
              Services
            </Link>
            <Link href="/about" className="text-sm text-gray-500 hover:text-blue-600">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600">
              Contact
            </Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Services</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/services" className="text-sm text-gray-500 hover:text-blue-600">
              Primary Care
            </Link>
            <Link href="/services" className="text-sm text-gray-500 hover:text-blue-600">
              Pediatrics
            </Link>
            <Link href="/services" className="text-sm text-gray-500 hover:text-blue-600">
              Cardiology
            </Link>
            <Link href="/services" className="text-sm text-gray-500 hover:text-blue-600">
              Women's Health
            </Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Us</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <span>
                123 Medical Center Drive
                <br />
                Anytown, ST 12345
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>info@medicarehealth.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8 px-4 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} MediCare. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-blue-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
