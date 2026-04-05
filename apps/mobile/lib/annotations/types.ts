// --- Annotation Data Types ---
// All coordinates normalized to 0-1 range relative to image dimensions.

export type AnnotationTool = 'arrow' | 'circle' | 'underline' | 'text';

export interface AnnotationPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
}

export interface Annotation {
  id: string;
  tool: AnnotationTool;
  points: AnnotationPoint[];
  text?: string; // only for 'text' tool
  color: string; // default: '#FF0000'
  strokeWidth: number; // default: 3
}

export interface AnnotationLayer {
  version: 1;
  width: number; // original image pixel width
  height: number; // original image pixel height
  annotations: Annotation[];
}

export interface CapturedPhoto {
  id: string;
  uri: string;
  width: number;
  height: number;
  annotations?: AnnotationLayer;
}
