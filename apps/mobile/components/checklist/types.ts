// --- Status Types ---

export type ChecklistStatus = 'ok' | 'defect' | 'partial' | 'skip';

export interface StatusConfig {
  label: string;
  sym: string;
  color: string;
  bg: string;
  border: string;
}

// --- Checklist Item Types ---

export interface ChecklistItemData {
  id: string;
  text: string;
  hasChildren?: boolean;
  parentId?: string;
  bathType?: 'shower' | 'bath';
  trade?: string;
}

export interface ChecklistRoom {
  id: string;
  name: string;
  hasBathType?: boolean;
  items: ChecklistItemData[];
}

// --- State Types ---

export type StatusMap = Record<string, ChecklistStatus>;
export type DefectTextMap = Record<string, string>;
export type BathTypeMap = Record<string, 'shower' | 'bath'>;
export type OpenMap = Record<string, boolean>;
