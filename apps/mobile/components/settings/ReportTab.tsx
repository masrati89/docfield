import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

import { useReportDefaults } from '@/hooks/useReportDefaults';
import { TextFieldPreview } from './TextFieldPreview';
import { BOQRatesSection } from './BOQRatesSection';

// --- Field definitions ---

interface TextFieldConfig {
  key: string;
  settingsKey: string;
  label: string;
  visibilityKey: string;
}

const REPORT_TEXT_FIELDS: { section: string; fields: TextFieldConfig[] }[] = [
  {
    section: 'ברירות מחדל לדוח',
    fields: [
      {
        key: 'declaration',
        settingsKey: 'default_declaration',
        label: 'הצהרת בודק',
        visibilityKey: 'show_declaration',
      },
      {
        key: 'work_method',
        settingsKey: 'work_method',
        label: 'שיטת עבודה',
        visibilityKey: 'show_work_method',
      },
      {
        key: 'default_tools',
        settingsKey: 'default_tools',
        label: 'כלי בדיקה',
        visibilityKey: 'show_tools',
      },
      {
        key: 'default_limitations',
        settingsKey: 'default_limitations',
        label: 'מגבלות ברירת מחדל',
        visibilityKey: 'show_limitations',
      },
    ],
  },
  {
    section: 'חתימות והצהרות',
    fields: [
      {
        key: 'inspector_declaration',
        settingsKey: 'inspector_declaration',
        label: 'הצהרת המפקח',
        visibilityKey: 'show_inspector_declaration',
      },
      {
        key: 'tenant_acknowledgment',
        settingsKey: 'tenant_acknowledgment',
        label: 'אישור המזמין',
        visibilityKey: 'show_tenant_acknowledgment',
      },
      {
        key: 'disclaimer',
        settingsKey: 'disclaimer',
        label: 'כתב ויתור',
        visibilityKey: 'show_disclaimer',
      },
    ],
  },
  {
    section: 'ידע כללי לדייר',
    fields: [
      {
        key: 'tenant_rights_text',
        settingsKey: 'tenant_rights_text',
        label: 'אחריות קבלן',
        visibilityKey: 'show_tenant_rights',
      },
    ],
  },
  {
    section: 'תנאים (פרוטוקול מסירה)',
    fields: [
      {
        key: 'protocol_terms',
        settingsKey: 'protocol_terms',
        label: 'תנאים ואחריות',
        visibilityKey: 'show_protocol_terms',
      },
    ],
  },
];

// --- Types ---

interface ReportTabProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

// --- Component ---

export function ReportTab({ onSuccess, onError }: ReportTabProps) {
  const router = useRouter();
  const { reportDefaults, saveReportDefaults } = useReportDefaults();

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
      {REPORT_TEXT_FIELDS.map((section, sIdx) => (
        <Animated.View
          key={section.section}
          entering={FadeInUp.delay(sIdx * 60).duration(300)}
          style={{ marginBottom: 20 }}
        >
          {/* Section title */}
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[700],
              textAlign: 'right',
              marginBottom: 10,
            }}
          >
            {section.section}
          </Text>

          {/* Text field previews */}
          {section.fields.map((field) => {
            const value =
              (reportDefaults[
                field.key as keyof typeof reportDefaults
              ] as string) ?? '';
            const checked =
              (reportDefaults[
                field.visibilityKey as keyof typeof reportDefaults
              ] as boolean) ?? true;

            return (
              <TextFieldPreview
                key={field.key}
                label={field.label}
                value={typeof value === 'string' ? value : ''}
                checked={checked}
                onToggle={(newChecked) => {
                  saveReportDefaults({
                    [field.visibilityKey]: newChecked,
                  } as Record<string, boolean>);
                }}
                onPress={() => {
                  router.push(
                    `/settings/edit-text?field=${field.settingsKey}&label=${encodeURIComponent(field.label)}`
                  );
                }}
              />
            );
          })}
        </Animated.View>
      ))}

      {/* BOQ Rates */}
      <Animated.View entering={FadeInUp.delay(240).duration(300)}>
        <BOQRatesSection onSuccess={onSuccess} onError={onError} />
      </Animated.View>

      {/* Templates — navigate to standalone screen */}
      <Animated.View entering={FadeInUp.delay(300).duration(300)}>
        <PressableScale
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/settings/templates');
          }}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 12,
            padding: 16,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: COLORS.gold[100],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="clipboard" size={20} color={COLORS.gold[600]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[700],
                textAlign: 'right',
              }}
            >
              ניהול תבניות
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[500],
                textAlign: 'right',
                marginTop: 2,
              }}
            >
              צ׳קליסטים למסירה ובדק בית
            </Text>
          </View>
          <Feather name="chevron-left" size={20} color={COLORS.neutral[400]} />
        </PressableScale>
      </Animated.View>
    </View>
  );
}
