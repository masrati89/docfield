import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

// --- Types ---

interface ReportDetailsTabProps {
  reportId: string;
}

interface DetailsData {
  client_name: string;
  client_phone: string;
  client_email: string;
  client_id_number: string;
  property_type: string;
  property_area: string;
  property_floor: string;
  property_description: string;
  contractor_name: string;
  contractor_phone: string;
}

const EMPTY: DetailsData = {
  client_name: '',
  client_phone: '',
  client_email: '',
  client_id_number: '',
  property_type: '',
  property_area: '',
  property_floor: '',
  property_description: '',
  contractor_name: '',
  contractor_phone: '',
};

const COLUMNS = Object.keys(EMPTY) as (keyof DetailsData)[];

const PROPERTY_SUGGESTIONS = [
  '3 חדרים',
  '4 חדרים',
  '5 חדרים',
  'דופלקס',
  'פנטהאוז',
  'סטודיו',
  'גן',
];

// --- Component ---

export function ReportDetailsTab({ reportId }: ReportDetailsTabProps) {
  const [data, setData] = useState<DetailsData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [savedField, setSavedField] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Fetch on mount
  useEffect(() => {
    (async () => {
      const { data: row } = await supabase
        .from('delivery_reports')
        .select(COLUMNS.join(', ') + ', tenant_name, tenant_phone')
        .eq('id', reportId)
        .single();

      if (row) {
        const r = row as unknown as Record<string, string | null>;
        setData({
          client_name: r.client_name || r.tenant_name || '',
          client_phone: r.client_phone || r.tenant_phone || '',
          client_email: r.client_email || '',
          client_id_number: r.client_id_number || '',
          property_type: r.property_type || '',
          property_area: r.property_area || '',
          property_floor: r.property_floor || '',
          property_description: r.property_description || '',
          contractor_name: r.contractor_name || '',
          contractor_phone: r.contractor_phone || '',
        });
      }
      setLoading(false);
    })();
  }, [reportId]);

  const saveField = useCallback(
    async (field: keyof DetailsData, value: string) => {
      const { error } = await supabase
        .from('delivery_reports')
        .update({ [field]: value } as Record<string, string>)
        .eq('id', reportId);

      if (!error) {
        setSavedField(field);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setSavedField(null), 1500);
      }
    },
    [reportId]
  );

  const handleChange = (field: keyof DetailsData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View className="gap-[12px]">
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} width="100%" height={140} borderRadius={14} />
        ))}
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(300)} className="gap-[12px]">
      {/* Client Details */}
      <Section title="פרטי לקוח" index={0}>
        <Field
          label="שם לקוח"
          value={data.client_name}
          saved={savedField === 'client_name'}
          onChangeText={(v) => handleChange('client_name', v)}
          onBlur={() => saveField('client_name', data.client_name)}
        />
        <Field
          label="טלפון"
          value={data.client_phone}
          saved={savedField === 'client_phone'}
          keyboardType="phone-pad"
          onChangeText={(v) => handleChange('client_phone', v)}
          onBlur={() => saveField('client_phone', data.client_phone)}
        />
        <Field
          label="אימייל"
          value={data.client_email}
          saved={savedField === 'client_email'}
          keyboardType="email-address"
          onChangeText={(v) => handleChange('client_email', v)}
          onBlur={() => saveField('client_email', data.client_email)}
        />
        <Field
          label="ת.ז."
          value={data.client_id_number}
          saved={savedField === 'client_id_number'}
          onChangeText={(v) => handleChange('client_id_number', v)}
          onBlur={() => saveField('client_id_number', data.client_id_number)}
        />
      </Section>

      {/* Property Details */}
      <Section title="פרטי נכס" index={1}>
        <Field
          label="סוג נכס"
          value={data.property_type}
          saved={savedField === 'property_type'}
          onChangeText={(v) => handleChange('property_type', v)}
          onBlur={() => saveField('property_type', data.property_type)}
        />
        {data.property_type === '' && (
          <View className="flex-row-reverse flex-wrap gap-[6px] mb-[12px] -mt-[6px]">
            {PROPERTY_SUGGESTIONS.map((s) => (
              <Text
                key={s}
                className="bg-white border border-cream-200 rounded-[8px] px-[10px] py-[4px] text-[12px] font-rubik text-neutral-600"
                onPress={() => {
                  handleChange('property_type', s);
                  saveField('property_type', s);
                }}
              >
                {s}
              </Text>
            ))}
          </View>
        )}
        <Field
          label="שטח במ״ר"
          value={data.property_area}
          saved={savedField === 'property_area'}
          keyboardType="numeric"
          onChangeText={(v) => handleChange('property_area', v)}
          onBlur={() => saveField('property_area', data.property_area)}
        />
        <Field
          label="קומה"
          value={data.property_floor}
          saved={savedField === 'property_floor'}
          keyboardType="numeric"
          onChangeText={(v) => handleChange('property_floor', v)}
          onBlur={() => saveField('property_floor', data.property_floor)}
        />
        <Field
          label="תיאור הנכס"
          value={data.property_description}
          saved={savedField === 'property_description'}
          multiline
          numberOfLines={3}
          onChangeText={(v) => handleChange('property_description', v)}
          onBlur={() =>
            saveField('property_description', data.property_description)
          }
        />
      </Section>

      {/* Contractor Details */}
      <Section title="פרטי קבלן" index={2}>
        <Field
          label="שם קבלן"
          value={data.contractor_name}
          saved={savedField === 'contractor_name'}
          onChangeText={(v) => handleChange('contractor_name', v)}
          onBlur={() => saveField('contractor_name', data.contractor_name)}
        />
        <Field
          label="טלפון קבלן"
          value={data.contractor_phone}
          saved={savedField === 'contractor_phone'}
          keyboardType="phone-pad"
          onChangeText={(v) => handleChange('contractor_phone', v)}
          onBlur={() => saveField('contractor_phone', data.contractor_phone)}
        />
      </Section>
    </Animated.View>
  );
}

// --- Sub-components ---

function Section({
  title,
  index,
  children,
}: {
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(250)}
      className="bg-cream-100 border border-cream-200 rounded-[14px] p-[16px]"
    >
      <Text className="text-[16px] font-rubik-semibold text-neutral-800 text-right mb-[12px]">
        {title}
      </Text>
      {children}
    </Animated.View>
  );
}

function Field({
  label,
  value,
  saved,
  multiline,
  numberOfLines,
  keyboardType,
  onChangeText,
  onBlur,
}: {
  label: string;
  value: string;
  saved: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  onChangeText: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <View className="mb-[12px]">
      <View className="flex-row-reverse items-center justify-between mb-[4px]">
        <Text className="text-[13px] font-rubik-medium text-neutral-600 text-right">
          {label}
        </Text>
        {saved && (
          <Text className="text-[11px] font-rubik text-primary-500">
            נשמר ✓
          </Text>
        )}
      </View>
      <TextInput
        className="bg-white border border-cream-200 rounded-[10px] p-[12px] text-right font-rubik text-[14px] text-neutral-800"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={
          multiline ? { minHeight: 72, textAlignVertical: 'top' } : undefined
        }
        placeholderTextColor="#A3A3A3"
      />
    </View>
  );
}
