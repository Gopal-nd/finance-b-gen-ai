import { z } from "zod";

export const userProfileSchema = z.object({
  age: z.number().min(18, "Must be 18 or older"),
  incomeLevel: z.string().nonempty("Income level is required"),
  riskProfile: z.string().nonempty(),
  goals: z.string().nonempty("Please enter your goals"),
  investmentExperience: z.string().nonempty(),
  preferredLanguages: z.string().optional(),
  monthlySavings: z.number().optional(),
  investmentDuration: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  dependentsCount: z.number().optional(),
  isTaxSavingPriority: z.boolean().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;  