import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FEFDFB',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: 'Rubik-Regular', color: '#7A766F' }}>
        הגדרות
      </Text>
    </View>
  );
}
