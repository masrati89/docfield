import { z } from 'zod';

export const createDefectSchema = z.object({
  deliveryReportId: z.string().uuid(),
  description: z
    .string()
    .min(2, 'תיאור ליקוי חייב להכיל לפחות 2 תווים')
    .max(500, 'תיאור ארוך מדי'),
  room: z.string().optional(),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  source: z.enum(['checklist', 'manual', 'library']).default('manual'),
  checklistResultId: z.string().uuid().optional(),
  standardRef: z.string().optional(),
  standardSection: z.string().optional(),
  recommendation: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  cost: z.number().nonnegative().optional(),
  costUnit: z.string().optional(),
  unitPrice: z.number().nonnegative().optional(),
  quantity: z.number().positive().optional(),
  unitLabel: z.string().optional(),
});

export type CreateDefectInput = z.infer<typeof createDefectSchema>;

export const updateDefectSchema = z.object({
  description: z.string().min(2).max(500).optional(),
  room: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  status: z.enum(['open', 'in_progress', 'fixed', 'not_fixed']).optional(),
});

export type UpdateDefectInput = z.infer<typeof updateDefectSchema>;
