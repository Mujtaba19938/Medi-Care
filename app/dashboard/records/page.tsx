"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { FileText, Download, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// This would typically come from your database
// For demo purposes, we'll create mock data
const mockMedicalRecords = [
  {
    id: 1,
    title: "Annual Physical Examination",
    date: "2023-06-15",
    doctor: "Dr. Sarah Johnson",
    type: "examination",
    description: "Routine annual physical examination results",
    isAvailable: true,
  },
  {
    id: 2,
    title: "Blood Test Results",
    date: "2023-06-15",
    doctor: "Dr. Michael Chen",
    type: "lab",
    description: "Complete blood count and metabolic panel",
    isAvailable: true,
  },
  {
    id: 3,
    title: "Vaccination Record",
    date: "2023-01-10",
    doctor: "Dr. Emily Rodriguez",
    type: "vaccination",
    description: "COVID-19 vaccination record",
    isAvailable: true,
  },
  {
    id: 4,
    title: "Cardiology Consultation",
    date: "2022-11-22",
    doctor: "Dr. Michael Chen",
    type: "consultation",
    description: "Cardiology consultation notes and recommendations",
    isAvailable: true,
  },
  {
    id: 5,
    title: "X-Ray Results",
    date: "2022-09-05",
    doctor: "Dr. James Wilson",
    type: "imaging",
    description: "Chest X-ray results and radiologist notes",
    isAvailable: true,
  },
]

type MedicalRecord = {
  id: number
  title: string
  date: string
  doctor: string
  type: string
  description: string
  isAvailable: boolean
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // In a real application, you would fetch records from your database
    // For this demo, we'll use the mock data after a short delay
    const fetchRecords = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRecords(mockMedicalRecords)
      } catch (error) {
        console.error("Error fetching medical records:", error)
        toast({
          title: "Error",
          description: "Failed to load your medical records. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [user, router, toast])

  const filterRecords = (type: string) => {
    if (type === "all") return records
    return records.filter((record) => record.type === type)
  }

  const viewRecord = (id: number) => {
    toast({
      title: "Viewing Record",
      description: "This feature would open the medical record in a secure viewer.",
    })
  }

  const downloadRecord = (id: number) => {
    toast({
      title: "Downloading Record",
      description: "This feature would download the medical record securely.",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Medical Records</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Medical Records</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="examination">Examinations</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="consultation">Consultations</TabsTrigger>
        </TabsList>

        {["all", "examination", "lab", "imaging", "consultation"].map((type) => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {type === "all" ? "All Records" : `${type.charAt(0).toUpperCase() + type.slice(1)} Records`}
                </CardTitle>
                <CardDescription>
                  {type === "all" ? "View all your medical records" : `View your ${type} records`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filterRecords(type).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No {type === "all" ? "" : type} records found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filterRecords(type).map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-600" />
                              {record.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Date: {format(new Date(record.date), "MMM d, yyyy")}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Doctor: {record.doctor}</p>
                            <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                          </div>
                          <div className="flex flex-row md:flex-col gap-2">
                            {record.isAvailable ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => viewRecord(record.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => downloadRecord(record.id)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </>
                            ) : (
                              <Button variant="outline" size="sm" className="flex items-center" disabled>
                                <Lock className="h-4 w-4 mr-2" />
                                Restricted
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Request Records</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">About Your Medical Records</h2>
        <p className="text-gray-700 mb-4">
          Your medical records are securely stored and accessible only to you and your healthcare providers. If you need
          additional records or have questions about your medical history, please contact our medical records
          department.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Request Additional Records</h3>
            <p className="text-sm text-gray-500">
              If you need records that aren't available here, you can submit a request.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Privacy & Security</h3>
            <p className="text-sm text-gray-500">
              Your records are protected by HIPAA regulations and our secure systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
