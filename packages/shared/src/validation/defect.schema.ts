import { z } from 'zod';

export const createDefectSchema = z.object({
  deliveryReportId: z.string().uuid(),
  description: z
    .string()
    .min(2, 'תיאור ליקוי חייב להכיל לפחות 2 תווים')
    .max(500, 'תיאור ארוך מדי'),
  room: z.string().min(1, 'יש לבחור חדר'),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  severity: z.enum(['critical', 'medium', 'low']),
  source: z.enum(['checklist', 'manual', 'library']).default('manual'),
  checklistResultId: z.string().uuid().optional(),
});

export type CreateDefectInput = z.infer<typeof createDefectSchema>;

export const updateDefectSchema = z.object({
  description: z.string().min(2).max(500).optional(),
  room: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  severity: z.enum(['critical', 'medium', 'low']).optional(),
  status: z.enum(['open', 'in_progress', 'fixed', 'not_fixed']).optional(),
});

export type UpdateDefectInput = z.infer<typeof updateDefectSchema>;
