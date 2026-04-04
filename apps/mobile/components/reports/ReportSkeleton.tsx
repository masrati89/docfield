import { View } from 'react-native';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

export function ReportSkeleton() {
  return (
    <View style={{ padding: 12, gap: 8 }}>
      {/* Card skeleton */}
      <View
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          gap: 8,
        }}
      >
        <SkeletonBlock width="70%" height={18} borderRadius={4} />
        <SkeletonBlock width="50%" height={12} borderRadius={3} />
        <SkeletonBlock width="40%" height={12} borderRadius={3} />
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: COLORS.cream[200],
            paddingTop: 8,
            marginTop: 4,
          }}
        >
          <SkeletonBlock width="60%" height={14} borderRadius={4} />
        </View>
      </View>
      {/* Category skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonBlock
          key={i}
          width="100%"
          height={52}
          borderRadius={BORDER_RADIUS.md}
        />
      ))}
    </View>
  );
}
