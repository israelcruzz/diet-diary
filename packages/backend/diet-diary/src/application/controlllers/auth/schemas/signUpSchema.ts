import { Profile } from "@application/entities/Profile";
import z from "zod";

export const accountSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export const profileSchema = z.object({
  birthDate: z.coerce.date(),
  gender: z.nativeEnum(Profile.GENDER),
  weight: z.number(),
  height: z.number(),
  goal: z.nativeEnum(Profile.GOAL),
  activityLevel: z.nativeEnum(Profile.ActivityLevel)
})

export const schema = z.object({
  account: accountSchema,
  profile: profileSchema
});
