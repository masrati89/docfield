import { View, Text } from 'react-native';

import { COLORS } from '@docfield/ui';
import type { ApartmentStatus, ProjectStatus } from '@docfield/shared';

interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
}

const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  active: {
    label: 'פעיל',
    color: COLORS.success[700],
    backgroundColor: COLORS.success[50],
  },
  completed: {
    label: 'הושלם',
    color: COLORS.primary[700],
    backgroundColor: COLORS.primary[100],
  },
  archived: {
    label: 'בארכיון',
    color: COLORS.neutral[500],
    backgroundColor: COLORS.neutral[100],
  },
};

const APARTMENT_STATUS_CONFIG: Record<ApartmentStatus, StatusConfig> = {
  pending: {
    label: 'ממתין',
    color: COLORS.warning[700],
    backgroundColor: COLORS.warning[50],
  },
  in_progress: {
    label: 'בתהליך',
    color: COLORS.info[700],
    backgroundColor: COLORS.info[50],
  },
  delivered: {
    label: 'נמסר',
    color: COLORS.success[700],
    backgroundColor: COLORS.success[50],
  },
  completed: {
    label: 'הושלם',
    color: COLORS.primary[700],
    backgroundColor: COLORS.primary[100],
  },
};

interface StatusBadgeProps {
  status: ProjectStatus | ApartmentStatus;
  type: 'project' | 'apartment';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const config =
    type === 'project'
      ? PROJECT_STATUS_CONFIG[status as ProjectStatus]
      : APARTMENT_STATUS_CONFIG[status as ApartmentStatus];

  if (!config) return null;

  return (
    <View
      className="flex-row items-center px-[10px] py-[4px] rounded-full"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <View
        className="w-[6px] h-[6px] rounded-full me-[6px]"
        style={{ backgroundColor: config.color }}
      />
      <Text
        className="text-[11px] font-rubik-medium"
        style={{ color: config.color }}
      >
        {config.label}
      </Text>
    </View>
  );
}
