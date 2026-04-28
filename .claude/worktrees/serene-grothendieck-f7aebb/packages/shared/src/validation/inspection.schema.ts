import { z } from 'zod';

export const createReportSchema = z.object({
  apartmentId: z.string().uuid(),
  reportType: z.enum([
    'delivery',
    'bedek_bait',
    'supervision',
    'leak_detection',
    'public_areas',
  ]),
  checklistTemplateId: z.string().uuid().optional(),
  tenantName: z.string().max(200).optional(),
  tenantPhone: z
    .string()
    .regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין')
    .optional(),
  tenantEmail: z.string().email('אימייל לא תקין').optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

export const updateReportSchema = z.object({
  status: z.enum(['draft', 'in_progress', 'completed', 'sent']).optional(),
  tenantName: z.string().max(200).optional(),
  tenantPhone: z
    .string()
    .regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין')
    .optional(),
  tenantEmail: z.string().email('אימייל לא תקין').optional(),
  notes: z.string().max(2000).optional(),
});

export type UpdateReportInput = z.infer<typeof updateReportSchema>;

export const checklistResultSchema = z.object({
  checklistItemId: z.string().uuid(),
  result: z.enum(['pass', 'fail', 'na']),
  note: z.string().max(1000).optional(),
});

export type ChecklistResultInput = z.infer<typeof checklistResultSchema>;
