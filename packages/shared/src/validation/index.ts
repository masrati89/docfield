export {
  loginSchema,
  registerSchema,
  fullRegisterSchema,
  changePasswordSchema,
  resetPasswordSchema,
  PROFESSIONS,
  PROFESSION_LABELS,
} from './auth.schema';
export type {
  LoginInput,
  RegisterInput,
  FullRegisterInput,
  ChangePasswordInput,
  ResetPasswordInput,
  ProfessionValue,
} from './auth.schema';

export {
  createOrganizationSchema,
  updateOrganizationSchema,
} from './organization.schema';
export type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from './organization.schema';

export {
  createProjectSchema,
  createBuildingSchema,
  createApartmentSchema,
} from './project.schema';
export type {
  CreateProjectInput,
  CreateBuildingInput,
  CreateApartmentInput,
} from './project.schema';

export {
  createReportSchema,
  updateReportSchema,
  checklistResultSchema,
} from './inspection.schema';
export type {
  CreateReportInput,
  UpdateReportInput,
  ChecklistResultInput,
} from './inspection.schema';

export { createDefectSchema, updateDefectSchema } from './defect.schema';
export type { CreateDefectInput, UpdateDefectInput } from './defect.schema';

export { createClientSchema, updateClientSchema } from './client.schema';
export type { CreateClientInput, UpdateClientInput } from './client.schema';
