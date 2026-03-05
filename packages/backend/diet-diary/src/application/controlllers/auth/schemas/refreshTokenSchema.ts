import z from "zod";

export const schema = z.object({
  refreshToken: z.string()
})
