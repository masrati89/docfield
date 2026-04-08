import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useInspectorSettings } from '@/hooks/useInspectorSettings';
import type { DefectItem } from '@/hooks/useReport';
import type { ReportContent } from '@/hooks/useReportContent';

// --- Types ---

export interface ShortageItem {
  label: string;
  category: string;
  isRequired: boolean;
}

export interface ShortageCategory {
  name: string;
  items: Array<{ label: string; isPresent: boolean; isRequired: boolean }>;
}

export interface UseReportShortagesResult {
  requiredMissing: ShortageItem[];
  optionalMissing: ShortageItem[];
  totalRequired: number;
  categories: ShortageCategory[];
  isLoading: boolean;
}

interface ReportRow {
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  client_id_number: string | null;
  tenant_name: string | null;
  tenant_phone: string | null;
  property_type: string | null;
  property_area: string | null;
  report_content: ReportContent | null;
  apartments: {
    number: string;
    buildings: {
      name: string;
      projects: { name: string; address: string | null };
    };
  } | null;
}

// --- Helper ---

function has(value: string | null | undefined): boolean {
  return !!value && value.trim().length > 0;
}

// --- Hook ---

export function useReportShortages(
  reportId: string | undefined,
  defects: DefectItem[]
): UseReportShortagesResult {
  const { profile } = useAuth();
  const { settings, isLoading: settingsLoading } = useInspectorSettings();
  const [reportRow, setReportRow] = useState<ReportRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch report fields needed for validation
  useEffect(() => {
    if (!reportId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        const { data } = await supabase
          .from('delivery_reports')
          .select(
            `client_name, client_phone, client_email, client_id_number,
             tenant_name, tenant_phone, property_type, property_area,
             report_content,
             apartments(number, buildings(name, projects(name, address)))`
          )
          .eq('id', reportId)
          .single();

        if (!cancelled && data) {
          setReportRow(data as unknown as ReportRow);
        }
      } catch {
        // Keep null on error
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  if (isLoading || settingsLoading || !reportRow) {
    return {
      requiredMissing: [],
      optionalMissing: [],
      totalRequired: 0,
      categories: [],
      isLoading: true,
    };
  }

  const apt = reportRow.apartments;
  const content = reportRow.report_content ?? {};

  // Build categories
  const categories: ShortageCategory[] = [
    {
      name: 'פרופיל בודק',
      items: [
        {
          label: 'שם מלא',
          isPresent: has(profile?.fullName),
          isRequired: true,
        },
        {
          label: 'מספר רישיון',
          isPresent: has(settings?.license_number),
          isRequired: true,
        },
        {
          label: 'חתימה',
          isPresent: has(profile?.signatureUrl),
          isRequired: true,
        },
        {
          label: 'חותמת',
          isPresent: has(profile?.stampUrl),
          isRequired: false,
        },
      ],
    },
    {
      name: 'פרטי לקוח',
      items: [
        {
          label: 'שם לקוח',
          isPresent: has(reportRow.client_name) || has(reportRow.tenant_name),
          isRequired: true,
        },
        {
          label: 'טלפון לקוח',
          isPresent: has(reportRow.client_phone) || has(reportRow.tenant_phone),
          isRequired: true,
        },
        {
          label: 'אימייל',
          isPresent: has(reportRow.client_email),
          isRequired: false,
        },
        {
          label: 'ת.ז.',
          isPresent: has(reportRow.client_id_number),
          isRequired: false,
        },
      ],
    },
    {
      name: 'פרטי נכס',
      items: [
        {
          label: 'פרויקט',
          isPresent: has(apt?.buildings?.projects?.name),
          isRequired: true,
        },
        {
          label: 'כתובת',
          isPresent: has(apt?.buildings?.projects?.address),
          isRequired: true,
        },
        { label: 'מספר דירה', isPresent: has(apt?.number), isRequired: true },
        {
          label: 'סוג נכס',
          isPresent: has(reportRow.property_type),
          isRequired: false,
        },
        {
          label: 'שטח',
          isPresent: has(reportRow.property_area),
          isRequired: false,
        },
      ],
    },
    {
      name: 'תוכן הדוח',
      items: [
        {
          label: 'הצהרת בודק',
          isPresent: has(content.declaration),
          isRequired: true,
        },
        {
          label: 'היקף הבדיקה',
          isPresent: has(content.scope),
          isRequired: false,
        },
      ],
    },
    {
      name: 'ממצאים',
      items: [
        {
          label: 'לפחות ממצא אחד',
          isPresent: defects.length > 0,
          isRequired: true,
        },
        {
          label: 'כל הממצאים עם קטגוריה',
          isPresent:
            defects.length > 0 && defects.every((d) => has(d.category)),
          isRequired: false,
        },
      ],
    },
    {
      name: 'תמונות',
      items: [
        {
          label: 'ממצאים עם תמונות',
          isPresent:
            defects.length > 0 && defects.some((d) => d.photoCount > 0),
          isRequired: false,
        },
      ],
    },
  ];

  const requiredMissing: ShortageItem[] = [];
  const optionalMissing: ShortageItem[] = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      if (!item.isPresent) {
        const shortage: ShortageItem = {
          label: item.label,
          category: cat.name,
          isRequired: item.isRequired,
        };
        if (item.isRequired) {
          requiredMissing.push(shortage);
        } else {
          optionalMissing.push(shortage);
        }
      }
    }
  }

  return {
    requiredMissing,
    optionalMissing,
    totalRequired: requiredMissing.length,
    categories,
    isLoading: false,
  };
}
