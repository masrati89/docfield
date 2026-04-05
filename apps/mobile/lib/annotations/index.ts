export type {
  AnnotationTool,
  AnnotationPoint,
  Annotation,
  AnnotationLayer,
  CapturedPhoto,
} from './types';
// renderAnnotationsToImage not exported from barrel — it imports @shopify/react-native-skia
// which crashes on web. Import conditionally via Platform.OS check + require().
