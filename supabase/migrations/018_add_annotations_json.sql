-- Add non-destructive annotation layer to defect photos
ALTER TABLE defect_photos
ADD COLUMN annotations_json JSONB DEFAULT NULL;

COMMENT ON COLUMN defect_photos.annotations_json IS
  'Non-destructive annotation layer (arrows, circles, underlines, text) as JSON. Original photo unchanged.';
