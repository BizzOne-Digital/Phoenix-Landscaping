import { GalleryItem } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { galleryItemSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: GalleryItem,
  scope: 'admin/gallery',
  schema: galleryItemSchema,
  imagePaths: ['image'],
});
