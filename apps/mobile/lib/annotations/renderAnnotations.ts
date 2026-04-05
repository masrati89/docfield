import {
  Skia,
  PaintStyle,
  StrokeCap,
  StrokeJoin,
} from '@shopify/react-native-skia';
import type { AnnotationLayer } from './types';

const ARROWHEAD_SIZE = 12;

export async function renderAnnotationsToImage(
  imageUri: string,
  layer: AnnotationLayer
): Promise<string> {
  // 1. Fetch image as bytes
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const data = Skia.Data.fromBytes(new Uint8Array(arrayBuffer));
  const image = Skia.Image.MakeImageFromEncoded(data);

  if (!image) {
    throw new Error('Failed to decode image for annotation rendering');
  }

  const w = image.width();
  const h = image.height();

  // 2. Create offscreen CPU surface
  const surface = Skia.Surface.Make(w, h);
  if (!surface) {
    throw new Error('Failed to create Skia surface');
  }

  const canvas = surface.getCanvas();

  // 3. Draw original image
  canvas.drawImage(image, 0, 0);

  // 4. Draw each annotation
  for (const annotation of layer.annotations) {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(annotation.color));
    paint.setStrokeWidth(annotation.strokeWidth);
    paint.setStyle(PaintStyle.Stroke);
    paint.setStrokeCap(StrokeCap.Round);
    paint.setStrokeJoin(StrokeJoin.Round);
    paint.setAntiAlias(true);

    const p0 = annotation.points[0];
    const p1 = annotation.points[1];

    switch (annotation.tool) {
      case 'arrow': {
        if (!p0 || !p1) break;
        const x0 = p0.x * w;
        const y0 = p0.y * h;
        const x1 = p1.x * w;
        const y1 = p1.y * h;
        canvas.drawLine(x0, y0, x1, y1, paint);
        const angle = Math.atan2(y1 - y0, x1 - x0);
        canvas.drawLine(
          x1,
          y1,
          x1 - ARROWHEAD_SIZE * Math.cos(angle - Math.PI / 6),
          y1 - ARROWHEAD_SIZE * Math.sin(angle - Math.PI / 6),
          paint
        );
        canvas.drawLine(
          x1,
          y1,
          x1 - ARROWHEAD_SIZE * Math.cos(angle + Math.PI / 6),
          y1 - ARROWHEAD_SIZE * Math.sin(angle + Math.PI / 6),
          paint
        );
        break;
      }
      case 'circle': {
        if (!p0 || !p1) break;
        const cx = p0.x * w;
        const cy = p0.y * h;
        const rx = Math.abs(p1.x * w - cx);
        const ry = Math.abs(p1.y * h - cy);
        const oval = Skia.XYWHRect(cx - rx, cy - ry, rx * 2, ry * 2);
        canvas.drawOval(oval, paint);
        break;
      }
      case 'underline': {
        if (!p0 || !p1) break;
        canvas.drawLine(p0.x * w, p0.y * h, p1.x * w, p1.y * h, paint);
        break;
      }
      case 'text': {
        if (!p0 || !annotation.text) break;
        const fillPaint = Skia.Paint();
        fillPaint.setColor(Skia.Color(annotation.color));
        fillPaint.setStyle(PaintStyle.Fill);
        fillPaint.setAntiAlias(true);
        // Skia.Font accepts optional typeface (omit for default system font)
        const font = Skia.Font(undefined, 24);
        canvas.drawText(annotation.text, p0.x * w, p0.y * h, fillPaint, font);
        break;
      }
    }
  }

  // 5. Export as base64 PNG
  surface.flush();
  const snapshot = surface.makeImageSnapshot();
  const encoded = snapshot.encodeToBase64();
  return `data:image/png;base64,${encoded}`;
}
