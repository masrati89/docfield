import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  fullName: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(100, 'שם ארוך מדי'),
  phone: z
    .string()
    .regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון ישראלי לא תקין')
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
