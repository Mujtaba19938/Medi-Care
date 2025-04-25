import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type Doctor = {
  id: number
  name: string
  role: string
  bio: string
  image_url: string
}

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-64">
        <Image
          src={doctor.image_url || "/placeholder.svg?height=300&width=300"}
          alt={doctor.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.role}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-4">{doctor.bio}</p>
        <div className="mt-4">
          <a href={`/doctors/${doctor.id}`} className="text-primary hover:underline text-sm font-medium">
            Read more
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
