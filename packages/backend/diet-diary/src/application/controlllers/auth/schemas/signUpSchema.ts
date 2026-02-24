import z from "zod";

export const schema = z.object({
  email: z.email(),
  password: z.string().min(8)
});
