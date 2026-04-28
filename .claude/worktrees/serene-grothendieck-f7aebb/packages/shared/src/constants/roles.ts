export const USER_ROLES = [
  { value: 'admin' as const, label: 'מנהל מערכת' },
  { value: 'project_manager' as const, label: 'מנהל פרויקט' },
  { value: 'inspector' as const, label: 'בודק / מפקח' },
] as const;

export type UserRoleValue = (typeof USER_ROLES)[number]['value'];

export const ROLE_LABELS: Record<UserRoleValue, string> = Object.fromEntries(
  USER_ROLES.map((role) => [role.value, role.label]),
) as Record<UserRoleValue, string>;
