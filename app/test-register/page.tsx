import { DirectRegisterForm } from "@/components/direct-register-form"

export default function TestRegisterPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold text-center mb-6">Test Registration</h1>
      <p className="text-center mb-8 max-w-md mx-auto">
        This page provides a direct registration method that bypasses the context provider for testing purposes.
      </p>
      <DirectRegisterForm />
    </div>
  )
}
