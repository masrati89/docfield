import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import type { StepProps } from './NewInspectionWizard.types';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function StepRoundSummary({ state }: StepProps) {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Round badge */}
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: COLORS.info[50],
          borderWidth: 1,
          borderColor: COLORS.info[500] + '33',
        }}
      >
        <Feather name="refresh-cw" size={18} color={COLORS.info[500]} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Rubik-Bold',
            color: COLORS.info[700],
          }}
        >
          {`סבב ${state.roundNumber}`}
        </Text>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'Rubik-Bold',
          color: COLORS.neutral[800],
          textAlign: 'center',
        }}
      >
        {`מסירה חוזרת — דירה ${state.apartmentLabel || ''}`}
      </Text>

      {/* Info about previous round */}
      {state.previousRoundDate && (
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[500],
            textAlign: 'center',
          }}
        >
          {`סבב קודם בוצע ב-${formatDate(state.previousRoundDate)}`}
        </Text>
      )}

      {/* Defect summary card */}
      <View
        style={{
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: 12,
          padding: 16,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[700],
            textAlign: 'right',
          }}
        >
          סיכום סבב קודם
        </Text>

        {/* Stats row */}
        <View
          style={{
            flexDirection: 'row-reverse',
            gap: 10,
          }}
        >
          {/* Total defects */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
              backgroundColor: COLORS.cream[100],
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Inter-Bold',
                color: COLORS.neutral[700],
              }}
            >
              {state.previousDefectCount}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[500],
                marginTop: 2,
              }}
            >
              ליקויים נמצאו
            </Text>
          </View>

          {/* Open defects */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
              backgroundColor: COLORS.warning[50],
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Inter-Bold',
                color: COLORS.warning[700],
              }}
            >
              {state.previousOpenDefectCount}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Rubik-Regular',
                color: COLORS.warning[700],
                marginTop: 2,
              }}
            >
              נותרו פתוחים
            </Text>
          </View>
        </View>
      </View>

      {/* Explanation */}
      <View
        style={{
          flexDirection: 'row-reverse',
          gap: 10,
          padding: 14,
          backgroundColor: COLORS.info[50],
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.info[50],
        }}
      >
        <Feather
          name="info"
          size={16}
          color={COLORS.info[500]}
          style={{ marginTop: 2 }}
        />
        <Text
          style={{
            flex: 1,
            fontSize: 13,
            fontFamily: 'Rubik-Regular',
            color: COLORS.info[700],
            textAlign: 'right',
            lineHeight: 20,
          }}
        >
          {state.previousOpenDefectCount > 0
            ? `${state.previousOpenDefectCount} ליקויים פתוחים יועברו אוטומטית לסבב הנוכחי. תוכל לסמן כל ליקוי כתוקן, לא תוקן, או תוקן חלקית.`
            : 'כל הליקויים מהסבב הקודם טופלו. ניתן להוסיף ליקויים חדשים.'}
        </Text>
      </View>
    </ScrollView>
  );
}
