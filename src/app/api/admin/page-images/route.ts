import { PageImage } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { pageImageSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: PageImage,
  scope: 'admin/page-images',
  schema: pageImageSchema,
  imagePaths: ['image.src'],
  uniqueField: 'key',
  sort: { key: 1 },
});
