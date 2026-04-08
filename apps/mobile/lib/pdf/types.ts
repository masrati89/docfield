// --- PDF Report Data Types ---

export interface PdfInspector {
  name: string;
  licenseNumber?: string;
  education?: string;
  experience?: string;
  companyName?: string;
  companyLogoUrl?: string;
}

export interface PdfProperty {
  projectName: string;
  address?: string;
  apartmentNumber: string;
  floor?: number;
  area?: string;
  contractor?: string;
}

export interface PdfClient {
  name: string;
  phone?: string;
  email?: string;
  idNumber?: string;
}

export interface PdfDefect {
  number: number;
  title: string;
  location: string;
  category: string;
  description?: string;
  standardRef?: string;
  standardText?: string;
  recommendation?: string;
  cost?: number;
  costLabel?: string;
  note?: string;
  photoUrls?: string[];
  photos?: { url: string; caption?: string }[];
  annotationsJson?: Record<string, unknown>[]; // annotation layers per photo
  annexText?: string;
}

export interface PdfChecklistItem {
  text: string;
  status: 'ok' | 'defect' | 'partial';
  category: string;
  refNumber?: number;
}

export interface PdfSignature {
  signerType: 'inspector' | 'tenant';
  signerName: string;
  imageUrl?: string;
  signedAt: string;
}

export interface PdfKeyDelivery {
  label: string;
  value: string;
}

export interface PdfReportData {
  reportType: 'bedek_bait' | 'delivery';
  reportNumber: string;
  reportDate: string;
  status: 'draft' | 'in_progress' | 'completed' | 'sent';
  inspector: PdfInspector;
  property: PdfProperty;
  client: PdfClient;
  defects: PdfDefect[];
  checklistItems?: PdfChecklistItem[];
  signatures?: PdfSignature[];
  notes?: string;
  tenantNotes?: string;
  weatherConditions?: string;
  limitations?: string;
  tools?: string[];
  keyDelivery?: PdfKeyDelivery[];
  logoUrl?: string;
  stampUrl?: string;
  declaration?: string;
  scope?: string;
  propertyDescription?: string;
  contractorName?: string;
  contractorPhone?: string;
}

// --- Grouped defects by category ---

export interface DefectGroup {
  category: string;
  defects: PdfDefect[];
}
