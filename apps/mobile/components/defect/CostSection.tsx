import { View, Text, TextInput, Pressable } from 'react-native';

import { COLORS } from '@infield/ui';

// --- Types ---

const COST_UNITS = [
  { id: 'fixed', label: 'סכום', icon: '₪' },
  { id: 'sqm', label: 'מ"ר', icon: 'מ"ר' },
  { id: 'lm', label: 'מ"א', icon: 'מ"א' },
  { id: 'unit', label: "יח'", icon: "יח'" },
  { id: 'day', label: 'ימים', icon: 'ימים' },
] as const;

interface CostSectionProps {
  costUnit: string;
  onCostUnitChange: (unit: string) => void;
  costAmount: string;
  onCostAmountChange: (amount: string) => void;
  costQty: string;
  onCostQtyChange: (qty: string) => void;
  costPerUnit: string;
  onCostPerUnitChange: (perUnit: string) => void;
}

// --- Component ---

export function CostSection({
  costUnit,
  onCostUnitChange,
  costAmount,
  onCostAmountChange,
  costQty,
  onCostQtyChange,
  costPerUnit,
  onCostPerUnitChange,
}: CostSectionProps) {
  const totalCost =
    costUnit === 'fixed'
      ? parseFloat(costAmount.replace(/,/g, '')) || 0
      : (parseFloat(costQty.replace(/,/g, '')) || 0) *
        (parseFloat(costPerUnit.replace(/,/g, '')) || 0);

  const unitIcon = COST_UNITS.find((u) => u.id === costUnit)?.icon ?? '₪';

  return (
    <View>
      {/* Unit selector chips */}
      <Text
        style={{
          fontSize: 10,
          color: COLORS.neutral[400],
          fontFamily: 'Rubik-Regular',
          marginBottom: 4,
          textAlign: 'right',
        }}
      >
        אופן חישוב:
      </Text>
      <View
        style={{
          flexDirection: 'row-reverse',
          gap: 4,
          flexWrap: 'wrap',
          marginBottom: 6,
        }}
      >
        {COST_UNITS.map((u) => {
          const isSelected = costUnit === u.id;
          return (
            <Pressable
              key={u.id}
              onPress={() => {
                onCostUnitChange(u.id);
                if (u.id === 'fixed') {
                  onCostQtyChange('');
                  onCostPerUnitChange('');
                } else {
                  onCostAmountChange('');
                }
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor: isSelected
                  ? COLORS.primary[500]
                  : 'transparent',
                borderWidth: 1,
                borderColor: isSelected
                  ? COLORS.primary[500]
                  : COLORS.cream[300],
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? '#FFFFFF' : COLORS.neutral[600],
                  fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Regular',
                }}
              >
                {u.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Fixed amount or qty × price */}
      {costUnit === 'fixed' ? (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: costAmount ? COLORS.primary[200] : COLORS.cream[300],
            backgroundColor: costAmount ? COLORS.primary[50] : COLORS.cream[50],
          }}
        >
          <Text
            style={{
              color: COLORS.neutral[400],
              fontSize: 14,
              fontWeight: '500',
              fontFamily: 'Rubik-Medium',
            }}
          >
            ₪
          </Text>
          <TextInput
            value={costAmount}
            onChangeText={(t) => onCostAmountChange(t.replace(/[^0-9,]/g, ''))}
            placeholder="הזן סכום"
            placeholderTextColor={COLORS.neutral[400]}
            keyboardType="numeric"
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[800],
              textAlign: 'right',
              padding: 0,
            }}
          />
        </View>
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row-reverse',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {/* Qty */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[400],
                  fontFamily: 'Rubik-Regular',
                  marginBottom: 3,
                  textAlign: 'right',
                }}
              >
                כמות
              </Text>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 4,
                  paddingVertical: 9,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: costQty
                    ? COLORS.primary[200]
                    : COLORS.cream[300],
                  backgroundColor: costQty
                    ? COLORS.primary[50]
                    : COLORS.cream[50],
                }}
              >
                <TextInput
                  value={costQty}
                  onChangeText={(t) =>
                    onCostQtyChange(t.replace(/[^0-9.,]/g, ''))
                  }
                  placeholder="0"
                  placeholderTextColor={COLORS.neutral[400]}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[800],
                    textAlign: 'right',
                    padding: 0,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {unitIcon}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 15,
                color: COLORS.neutral[400],
                fontWeight: '500',
                marginTop: 16,
              }}
            >
              ×
            </Text>

            {/* Price per unit */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[400],
                  fontFamily: 'Rubik-Regular',
                  marginBottom: 3,
                  textAlign: 'right',
                }}
              >
                מחיר ל{unitIcon}
              </Text>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 4,
                  paddingVertical: 9,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: costPerUnit
                    ? COLORS.primary[200]
                    : COLORS.cream[300],
                  backgroundColor: costPerUnit
                    ? COLORS.primary[50]
                    : COLORS.cream[50],
                }}
              >
                <Text
                  style={{
                    color: COLORS.neutral[400],
                    fontSize: 12,
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  ₪
                </Text>
                <TextInput
                  value={costPerUnit}
                  onChangeText={(t) =>
                    onCostPerUnitChange(t.replace(/[^0-9,]/g, ''))
                  }
                  placeholder="0"
                  placeholderTextColor={COLORS.neutral[400]}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[800],
                    textAlign: 'right',
                    padding: 0,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Total */}
          {totalCost > 0 ? (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: COLORS.gold[100],
                borderRadius: 6,
                marginTop: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.gold[700],
                  fontWeight: '500',
                  fontFamily: 'Rubik-Medium',
                }}
              >
                סה&quot;כ
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: COLORS.gold[700],
                  fontFamily: 'Rubik-Bold',
                }}
              >
                ₪{totalCost.toLocaleString()}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
