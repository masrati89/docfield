import { z } from 'zod';

export const createClientSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(200, 'שם ארוך מדי'),
  phone: z
    .string()
    .regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין')
    .optional(),
  email: z.string().email('אימייל לא תקין').optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial();

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
