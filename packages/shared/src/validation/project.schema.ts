import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, 'שם פרויקט חייב להכיל לפחות 2 תווים')
    .max(200, 'שם פרויקט ארוך מדי'),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const createBuildingSchema = z.object({
  projectId: z.string().uuid(),
  name: z
    .string()
    .min(1, 'שם בניין חובה')
    .max(100),
  floorsCount: z.number().int().min(1).max(200).optional(),
});

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;

export const createApartmentSchema = z.object({
  buildingId: z.string().uuid(),
  number: z
    .string()
    .min(1, 'מספר דירה חובה')
    .max(20),
  floor: z.number().int().min(-5).max(200).optional(),
  roomsCount: z.number().min(1).max(20).optional(),
  apartmentType: z
    .enum(['regular', 'garden', 'penthouse', 'duplex', 'studio'])
    .optional(),
});

export type CreateApartmentInput = z.infer<typeof createApartmentSchema>;
