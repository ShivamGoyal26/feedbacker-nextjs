import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string({ message: "identifier must be a string" }),
  password: z.string(),
});
