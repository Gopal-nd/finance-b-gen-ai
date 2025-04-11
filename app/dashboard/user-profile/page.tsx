"use client"

import { useState, useEffect } from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { userProfileSchema } from "@/lib/validation/ProfileSchema"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

type FormData = z.infer<typeof userProfileSchema>

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<FormData>({
    resolver: zodResolver(userProfileSchema),
    // We'll set default values after fetching data
    defaultValues: {
      age: undefined,
      incomeLevel: "",
      riskProfile: "",
      goals: "",
      investmentExperience: "",
      preferredLanguages: "",
      monthlySavings: undefined,
      investmentDuration: "",
      location: "",
      employmentType: "",
      dependentsCount: undefined,
      isTaxSavingPriority: undefined,
    },
  })

  // Fetch user profile data
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/profile")
      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }
      return response.json()
    },
  })

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      // Reset form with fetched values
      form.reset({
        age: profileData.age || undefined,
        incomeLevel: profileData.incomeLevel || "",
        riskProfile: profileData.riskProfile || "Moderate",
        goals: profileData.goals || "",
        investmentExperience: profileData.investmentExperience || "Beginner",
        preferredLanguages: profileData.preferredLanguages || "",
        monthlySavings: profileData.monthlySavings || undefined,
        investmentDuration: profileData.investmentDuration || "",
        location: profileData.location || "",
        employmentType: profileData.employmentType || "",
        dependentsCount: profileData.dependentsCount || undefined,
        isTaxSavingPriority: profileData.isTaxSavingPriority,
      })
    }
  }, [profileData, form])

  // Handle error in data fetching
  useEffect(() => {
    if (error) {
      toast.error("Failed to load profile data. Using default values.")
    }
  }, [error])

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save profile")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Profile saved successfully!")
      router.push("/dashboard/recommend")
    },
    onError: (err) => {
      toast.error("Error: " + err.message)
    },
  })

  function onSubmit(values: FormData) {
    mutation.mutate(values)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      form.handleSubmit(onSubmit)()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Loading skeleton for form fields
  const FormFieldSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  )

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              {isLoading ? "Loading Profile..." : " Your Financial Profile"}
            </CardTitle>
            <CardDescription>Update your financial information to receive better recommendations</CardDescription>
            <div className="flex justify-between mt-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                      ${
                        currentStep > index + 1
                          ? "bg-primary text-primary-foreground border-primary"
                          : currentStep === index + 1
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-transparent border-muted-foreground/40 text-muted-foreground"
                      }`}
                  >
                    {currentStep > index + 1 ? <CheckCircle2 className="h-6 w-6" /> : index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`h-1 w-10 sm:w-16 md:w-24 
                        ${currentStep > index + 1 ? "bg-primary" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-medium">Basic Information</h3>

                    {isLoading ? (
                      <>
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                      </>
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="transition-all"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    field.onChange({
                                      target: {
                                        name: field.name,
                                        value: e.target.value === "" ? undefined : Number(e.target.value),
                                      },
                                    })
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="incomeLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Income</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="transition-all">
                                    <SelectValue placeholder="Select income range" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="<3L">Below ₹3L</SelectItem>
                                    <SelectItem value="3L-10L">₹3L - ₹10L</SelectItem>
                                    <SelectItem value="10L+">₹10L+</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input className="transition-all" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="employmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Type</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Salaried, Freelance, Business"
                                  className="transition-all"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-medium">Investment Profile</h3>

                    {isLoading ? (
                      <>
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                      </>
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="riskProfile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Risk Appetite</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="transition-all">
                                    <SelectValue placeholder="Select risk profile" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="investmentExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Investment Experience</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="transition-all">
                                    <SelectValue placeholder="Experience level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="monthlySavings"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Savings (₹)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="transition-all"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    field.onChange({
                                      target: {
                                        name: field.name,
                                        value: e.target.value === "" ? undefined : Number(e.target.value),
                                      },
                                    })
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="investmentDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Investment Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g. Short term, 5 years" className="transition-all" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-medium">Additional Details</h3>

                    {isLoading ? (
                      <>
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                        <FormFieldSkeleton />
                      </>
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="goals"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Financial Goals</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="E.g. Retirement, Wealth, Travel"
                                  className="transition-all"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferredLanguages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Languages</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g. English, Hindi" className="transition-all" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dependentsCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dependents Count</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="transition-all"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    field.onChange({
                                      target: {
                                        name: field.name,
                                        value: e.target.value === "" ? undefined : Number(e.target.value),
                                      },
                                    })
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isTaxSavingPriority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Is Tax Saving a Priority?</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(val) => field.onChange(val === "true")}
                                  value={field.value === undefined ? "" : String(field.value)}
                                >
                                  <SelectTrigger className="transition-all">
                                    <SelectValue placeholder="Yes or No" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </motion.div>
                )}

                <div className="flex justify-between pt-4 mt-8 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isLoading}
                    className="transition-all hover:shadow-md"
                  >
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={mutation.isPending || isLoading}
                    className="transition-all hover:shadow-md"
                  >
                    {currentStep === totalSteps ? (
                      mutation.isPending ? (
                        "Saving..."
                      ) : (
                        "Save & Continue"
                      )
                    ) : (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
