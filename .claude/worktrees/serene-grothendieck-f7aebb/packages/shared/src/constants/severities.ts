import { COLORS } from '@docfield/ui';

export const DEFECT_SEVERITIES = [
  {
    value: 'critical' as const,
    label: 'חמור',
    color: COLORS.danger[500],
    backgroundColor: COLORS.danger[50],
    textColor: COLORS.danger[700],
  },
  {
    value: 'medium' as const,
    label: 'בינוני',
    color: COLORS.warning[500],
    backgroundColor: COLORS.warning[50],
    textColor: COLORS.warning[700],
  },
  {
    value: 'low' as const,
    label: 'קל',
    color: COLORS.info[500],
    backgroundColor: COLORS.info[50],
    textColor: COLORS.info[700],
  },
] as const;

export type SeverityValue = (typeof DEFECT_SEVERITIES)[number]['value'];

export const SEVERITY_LABELS: Record<SeverityValue, string> = Object.fromEntries(
  DEFECT_SEVERITIES.map((severity) => [severity.value, severity.label]),
) as Record<SeverityValue, string>;
