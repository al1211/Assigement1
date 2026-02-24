import z from "zod"

const userRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).*$/,
      "Password must include at least one uppercase letter and one number"
    ),

  role: z
    .enum(["user", "admin"])
    .optional()
});

export default userRegisterSchema;