import { PageImage } from '@/lib/db/models';
import { createItemHandlers } from '@/lib/api/crud';
import { pageImageSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, PATCH, DELETE } = createItemHandlers({
  model: PageImage,
  scope: 'admin/page-images',
  schema: pageImageSchema,
  imagePaths: ['image.src'],
  uniqueField: 'key',
  sort: { key: 1 },
});
