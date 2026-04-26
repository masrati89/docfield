import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { debugLogger } from '@/lib/debugLogger';
import type { DebugLog } from '@/lib/debugLogger';

const { height: screenHeight } = Dimensions.get('window');

export function DebugPanel() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = debugLogger.subscribe((newLogs) => {
      setLogs(newLogs);
    });
    return unsubscribe;
  }, []);

  // Show in dev mode OR if localhost (development)
  const isDev =
    __DEV__ ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost');

  if (!isDev) return null;

  const colors: Record<DebugLog['level'], string> = {
    info: '#E8F5E9',
    warn: '#FFF8E1',
    error: '#FFEBEE',
    navigation: '#E1F5FE',
    click: '#F3E5F5',
  };

  const textColors: Record<DebugLog['level'], string> = {
    info: '#1B7A44',
    warn: '#C8952E',
    error: '#d32f2f',
    navigation: '#0288d1',
    click: '#7b1fa2',
  };

  return (
    <>
      {/* Toggle button */}
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#333',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,.3)',
        }}
      >
        <Feather name="bug" size={24} color="#fff" />
      </Pressable>

      {/* Debug panel */}
      {isOpen && (
        <View
          style={{
            position: 'absolute',
            bottom: 80,
            right: 20,
            width: 320,
            maxHeight: screenHeight * 0.6,
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ddd',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,.15)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              backgroundColor: '#333',
              padding: 12,
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
              Debug Logs ({logs.length})
            </Text>
            <Pressable
              onPress={() => debugLogger.clear()}
              style={{ padding: 4 }}
            >
              <Feather name="trash-2" size={14} color="#fff" />
            </Pressable>
          </View>

          {/* Logs */}
          <ScrollView
            style={{ flex: 1, maxHeight: screenHeight * 0.5 }}
            showsVerticalScrollIndicator={false}
          >
            {logs.length === 0 ? (
              <View style={{ padding: 12, alignItems: 'center' }}>
                <Text style={{ color: '#999', fontSize: 12 }}>
                  בחכיתה ללוגים...
                </Text>
              </View>
            ) : (
              logs.map((log) => (
                <View
                  key={log.id}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    backgroundColor: colors[log.level],
                  }}
                >
                  <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#999',
                        fontFamily: 'Rubik-Regular',
                      }}
                    >
                      {log.timestamp}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: textColors[log.level],
                        fontWeight: 'bold',
                        fontFamily: 'Rubik-Medium',
                      }}
                    >
                      [{log.category}]
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#333',
                      marginTop: 2,
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    {log.message}
                  </Text>
                  {log.data && (
                    <Text
                      style={{
                        fontSize: 9,
                        color: '#666',
                        marginTop: 2,
                        fontFamily: 'Rubik-Regular',
                      }}
                    >
                      {JSON.stringify(log.data, null, 2).substring(0, 100)}
                    </Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
}
