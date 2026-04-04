/**
 * useReport Hook — Critical Test
 *
 * SETUP REQUIRED:
 * Before running this test, install test dependencies:
 *
 *   npm install -D jest @testing-library/react-native @testing-library/react-hooks \
 *     jest-expo @types/jest react-test-renderer
 *
 * Add to apps/mobile/package.json:
 *   "jest": {
 *     "preset": "jest-expo",
 *     "transformIgnorePatterns": [
 *       "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@supabase/.*|@tanstack/.*)"
 *     ]
 *   }
 *
 * Add script to apps/mobile/package.json:
 *   "test": "jest"
 *
 * Then run: npm test -- --testPathPattern=useReport
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// ---- Mocks ----

// Mock Supabase client
const _mockSelect = jest.fn();
const _mockEq = jest.fn();
const _mockSingle = jest.fn();
const _mockOrder = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

// Import after mocking
import { useReport } from '../useReport';

// ---- Test Helpers ----

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

// Sample data matching real DB structure
const mockReportData = {
  id: 'report-123',
  report_type: 'delivery',
  status: 'draft',
  tenant_name: 'ישראל ישראלי',
  report_date: '2026-04-01',
  notes: 'הערות לדוח',
  apartments: {
    number: '5',
    buildings: {
      name: 'בניין א',
      projects: {
        name: 'פרויקט הגליל',
        address: 'רחוב הרצל 10, חיפה',
      },
    },
  },
};

const mockDefectsData = [
  {
    id: 'defect-1',
    description: 'סדק בקיר סלון',
    room: 'סלון',
    category: 'טיח',
    severity: 'medium',
    status: 'open',
    defect_photos: [{ id: 'photo-1' }, { id: 'photo-2' }],
  },
  {
    id: 'defect-2',
    description: 'דליפה במקלחת',
    room: 'אמבטיה',
    category: 'אינסטלציה',
    severity: 'critical',
    status: 'open',
    defect_photos: [],
  },
];

// ---- Tests ----

describe('useReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch when id is undefined', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useReport(undefined), { wrapper });

    expect(result.current.report).toBeNull();
    expect(result.current.defects).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('should fetch report and defects when id is provided', async () => {
    // Setup chain for report query
    const reportChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockReportData,
        error: null,
      }),
    };

    // Setup chain for defects query
    const defectsChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    // Last order() call resolves with data
    defectsChain.order
      .mockReturnValueOnce(defectsChain) // first .order('sort_order')
      .mockResolvedValueOnce({
        // second .order('created_at') resolves
        data: mockDefectsData,
        error: null,
      });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'delivery_reports') return reportChain;
      if (table === 'defects') return defectsChain;
      return {};
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useReport('report-123'), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify report data mapped correctly
    expect(result.current.report).not.toBeNull();
    expect(result.current.report?.id).toBe('report-123');
    expect(result.current.report?.reportType).toBe('delivery');
    expect(result.current.report?.status).toBe('draft');
    expect(result.current.report?.tenantName).toBe('ישראל ישראלי');
    expect(result.current.report?.projectName).toBe('פרויקט הגליל');
    expect(result.current.report?.buildingName).toBe('בניין א');
    expect(result.current.report?.apartmentNumber).toBe('5');
    expect(result.current.report?.address).toBe('רחוב הרצל 10, חיפה');

    // Verify defects mapped correctly
    expect(result.current.defects).toHaveLength(2);
    expect(result.current.defects[0].description).toBe('סדק בקיר סלון');
    expect(result.current.defects[0].photoCount).toBe(2);
    expect(result.current.defects[1].photoCount).toBe(0);
    expect(result.current.defects[1].severity).toBe('critical');
  });

  it('should set error state when report fetch fails', async () => {
    const reportChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found', code: 'PGRST116' },
      }),
    };

    mockFrom.mockReturnValue(reportChain);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useReport('nonexistent-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.error).toBe(true);
    });

    expect(result.current.report).toBeNull();
    expect(result.current.defects).toEqual([]);
  });

  it('should handle report with no defects', async () => {
    const reportChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockReportData,
        error: null,
      }),
    };

    const defectsChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    defectsChain.order
      .mockReturnValueOnce(defectsChain)
      .mockResolvedValueOnce({ data: [], error: null });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'delivery_reports') return reportChain;
      if (table === 'defects') return defectsChain;
      return {};
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useReport('report-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.report).not.toBeNull();
    expect(result.current.defects).toEqual([]);
    expect(result.current.error).toBe(false);
  });

  it('should return correct photoCount from defect_photos relation', async () => {
    const multiPhotoDefects = [
      {
        id: 'defect-many-photos',
        description: 'ליקוי עם 5 תמונות',
        room: null,
        category: null,
        severity: 'low',
        status: 'open',
        defect_photos: [
          { id: 'p1' },
          { id: 'p2' },
          { id: 'p3' },
          { id: 'p4' },
          { id: 'p5' },
        ],
      },
    ];

    const reportChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockReportData,
        error: null,
      }),
    };

    const defectsChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    defectsChain.order
      .mockReturnValueOnce(defectsChain)
      .mockResolvedValueOnce({ data: multiPhotoDefects, error: null });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'delivery_reports') return reportChain;
      if (table === 'defects') return defectsChain;
      return {};
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useReport('report-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.defects[0].photoCount).toBe(5);
  });

  it('should expose refetch that invalidates queries', async () => {
    const reportChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockReportData,
        error: null,
      }),
    };

    const defectsChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    defectsChain.order
      .mockReturnValueOnce(defectsChain)
      .mockResolvedValueOnce({ data: [], error: null });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'delivery_reports') return reportChain;
      if (table === 'defects') return defectsChain;
      return {};
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useReport('report-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // refetch should be a function
    expect(typeof result.current.refetch).toBe('function');

    // Should not throw
    await result.current.refetch();
  });
});
