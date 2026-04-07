import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const PROFESSIONS = [
  'engineer',
  'constructor',
  'inspector',
  'project_manager',
  'architect',
  'building_technician',
  'site_manager',
] as const;

export type ProfessionValue = (typeof PROFESSIONS)[number];

export const PROFESSION_LABELS: Record<ProfessionValue, string> = {
  engineer: 'מהנדס',
  constructor: 'קונסטרוקטור',
  inspector: 'מפקח',
  project_manager: 'מנהל פרויקטים',
  architect: 'אדריכל',
  building_technician: 'הנדסאי בניין',
  site_manager: 'מנהל עבודה',
};

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

export const fullRegisterSchema = registerSchema
  .extend({
    firstName: z
      .string()
      .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
      .max(50, 'שם פרטי ארוך מדי'),
    profession: z.enum(PROFESSIONS, {
      errorMap: () => ({ message: 'נא לבחור תפקיד' }),
    }),
    orgName: z
      .string()
      .min(2, 'שם ארגון חייב להכיל לפחות 2 תווים')
      .max(200, 'שם ארגון ארוך מדי'),
    confirmPassword: z.string().min(1, 'נא לאשר את הסיסמה'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'הסיסמאות אינן תואמות',
    path: ['confirmPassword'],
  });

export type FullRegisterInput = z.infer<typeof fullRegisterSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'נא להזין סיסמה נוכחית'),
    newPassword: z.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים'),
    confirmNewPassword: z.string().min(1, 'נא לאשר את הסיסמה החדשה'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'הסיסמאות אינן תואמות',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
