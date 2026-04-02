import { Redirect, Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';

// Design tokens (inline — no theme import needed here)
const g500 = '#1B7A44';
const n400 = '#A8A49D';
const cr50 = '#FEFDFB';
const cr200 = '#F5EFE6';
const sR = '#EF4444';

// Custom tab bar label component
function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? '600' : '400',
          color: focused ? g500 : n400,
          fontFamily: 'Rubik-Regular',
        }}
      >
        {label}
      </Text>
      {focused && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: g500,
          }}
        />
      )}
    </View>
  );
}

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  // Still loading — don't redirect yet
  if (isLoading) return null;

  // Not authenticated — redirect to login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(254,253,251,0.92)',
          borderTopColor: cr200,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 22,
          paddingHorizontal: 8,
          height: 72,
        },
        tabBarActiveTintColor: g500,
        tabBarInactiveTintColor: n400,
      }}
    >
      {/* RTL order: הגדרות — פרויקטים — דוחות — בית */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="הגדרות" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Feather name="settings" size={22} color={focused ? g500 : n400} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="פרויקטים" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Feather name="folder" size={22} color={focused ? g500 : n400} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="דוחות" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Feather
                name="file-text"
                size={22}
                color={focused ? g500 : n400}
              />
              {/* Badge — draft count, wired in HomeScreen task */}
              <View
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -6,
                  minWidth: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: sR,
                  borderWidth: 1.5,
                  borderColor: cr50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: '700',
                    color: 'white',
                    fontFamily: 'Inter',
                  }}
                >
                  4
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="בית" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <Feather name="home" size={22} color={focused ? g500 : n400} />
          ),
        }}
      />
    </Tabs>
  );
}
