import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(200, 'שם ארוך מדי'),
  logoUrl: z.string().url('כתובת לוגו לא תקינה').optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
