import { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonBlock } from '@/components/ui';
import {
  ChecklistHeader,
  ChecklistFooter,
  RoomAccordion,
  AddDefectSheet,
  CHECKLIST_ROOMS,
} from '@/components/checklist';
import { useChecklist } from '@/hooks/useChecklist';

// --- Screen ---

export default function ChecklistScreen() {
  const { id: reportId } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const organizationId = profile?.organizationId;

  const [isLoading, setIsLoading] = useState(true);
  const [showAddDefect, setShowAddDefect] = useState(false);
  const [reportInfo, setReportInfo] = useState({
    title: '',
    projectName: '',
    tenantName: '',
    date: '',
  });

  const {
    openRooms,
    statuses,
    defectTexts,
    bathTypes,
    activeDefect,
    stats,
    toggleRoom,
    setItemStatus,
    setDefectText,
    setBathType,
    setActiveDefect,
  } = useChecklist();

  // Fetch report info
  useEffect(() => {
    async function fetchReport() {
      if (!reportId) return;
      try {
        const { data } = await supabase
          .from('delivery_reports')
          .select(
            'id, apartment_number, report_date, projects(name), clients(first_name, last_name)'
          )
          .eq('id', reportId)
          .single();

        if (data) {
          const project = data.projects as unknown as { name: string } | null;
          const client = data.clients as unknown as {
            first_name: string;
            last_name: string;
          } | null;
          setReportInfo({
            title: `פרוטוקול מסירה — דירה ${data.apartment_number || ''}`,
            projectName: project?.name || '',
            tenantName: client
              ? `${client.first_name} ${client.last_name}`
              : '',
            date: data.report_date
              ? new Date(data.report_date).toLocaleDateString('he-IL')
              : '',
          });
        }
      } catch {
        // Silent fail — header shows empty
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  const handleAddDefectSave = useCallback(
    async (data: {
      category: string;
      location: string;
      description: string;
    }) => {
      if (!reportId || !organizationId) return;
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      try {
        await supabase.from('defects').insert({
          delivery_report_id: reportId,
          organization_id: organizationId,
          description: data.description,
          room: data.location || null,
          category: data.category || null,
          severity: 'medium',
          source: 'checklist',
        });
      } catch {
        // Silent fail
      }
    },
    [reportId, organizationId]
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Green header bar */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: COLORS.primary[700],
          }}
        >
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(16,185,129,0.2)',
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#6ee7b7',
                    }}
                  />
                </View>
              </View>
              {reportInfo.projectName ? (
                <View
                  style={{
                    flexDirection: 'row-reverse',
                    gap: 4,
                    marginTop: 4,
                    opacity: 0.7,
                  }}
                >
                  <View style={{ flexDirection: 'row-reverse' }}>
                    {[reportInfo.projectName, reportInfo.title]
                      .filter(Boolean)
                      .map((part, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                          }}
                        >
                          {i > 0 ? (
                            <View
                              style={{
                                width: 3,
                                height: 3,
                                borderRadius: 1.5,
                                backgroundColor: '#FFFFFF',
                                opacity: 0.5,
                                marginHorizontal: 6,
                              }}
                            />
                          ) : null}
                          <View>
                            <StatusBar style="light" />
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Report card */}
        <ChecklistHeader
          isLoading={isLoading}
          reportTitle={reportInfo.title || 'פרוטוקול מסירה'}
          projectName={reportInfo.projectName}
          tenantName={reportInfo.tenantName}
          reportDate={reportInfo.date}
          checked={stats.checked}
          total={stats.total}
          defectCount={stats.defectCount}
          roomCount={CHECKLIST_ROOMS.length}
        />

        {/* Rooms */}
        <View style={{ padding: 12, paddingTop: 8 }}>
          {isLoading ? (
            <View style={{ gap: 8 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBlock
                  key={i}
                  width="100%"
                  height={52}
                  borderRadius={10}
                />
              ))}
            </View>
          ) : (
            CHECKLIST_ROOMS.map((room) => (
              <RoomAccordion
                key={room.id}
                room={room}
                isOpen={!!openRooms[room.id]}
                onToggle={() => toggleRoom(room.id)}
                statuses={statuses}
                defectTexts={defectTexts}
                bathType={bathTypes[room.id] || 'shower'}
                activeDefect={activeDefect}
                onStatus={setItemStatus}
                onDefectText={setDefectText}
                onBathTypeChange={(v) => setBathType(room.id, v)}
                onActivateDefect={setActiveDefect}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <ChecklistFooter
        onAddDefect={() => setShowAddDefect(true)}
        onCamera={() => {}}
        onSearch={() => {}}
      />

      {/* Add defect bottom sheet */}
      <AddDefectSheet
        visible={showAddDefect}
        onClose={() => setShowAddDefect(false)}
        onSave={handleAddDefectSave}
      />
    </View>
  );
}
