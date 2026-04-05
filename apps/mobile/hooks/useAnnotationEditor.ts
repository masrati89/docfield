import { useCallback, useState } from 'react';
import * as Crypto from 'expo-crypto';

import type {
  AnnotationTool,
  Annotation,
  AnnotationLayer,
} from '@/lib/annotations';

interface UseAnnotationEditorReturn {
  activeTool: AnnotationTool;
  setActiveTool: (tool: AnnotationTool) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  undo: () => void;
  canUndo: boolean;
  clear: () => void;
  toLayer: (width: number, height: number) => AnnotationLayer;
  loadLayer: (layer: AnnotationLayer) => void;
}

const DEFAULT_COLOR = '#FF0000';
const DEFAULT_STROKE_WIDTH = 3;

export function useAnnotationEditor(): UseAnnotationEditorReturn {
  const [activeTool, setActiveTool] = useState<AnnotationTool>('arrow');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = useCallback((annotation: Omit<Annotation, 'id'>) => {
    const full: Annotation = {
      ...annotation,
      id: Crypto.randomUUID(),
      color: annotation.color || DEFAULT_COLOR,
      strokeWidth: annotation.strokeWidth || DEFAULT_STROKE_WIDTH,
    };
    setAnnotations((prev) => [...prev, full]);
  }, []);

  const undo = useCallback(() => {
    setAnnotations((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setAnnotations([]);
  }, []);

  const toLayer = useCallback(
    (width: number, height: number): AnnotationLayer => ({
      version: 1,
      width,
      height,
      annotations,
    }),
    [annotations]
  );

  const loadLayer = useCallback((layer: AnnotationLayer) => {
    setAnnotations(layer.annotations);
  }, []);

  return {
    activeTool,
    setActiveTool,
    annotations,
    addAnnotation,
    undo,
    canUndo: annotations.length > 0,
    clear,
    toLayer,
    loadLayer,
  };
}
