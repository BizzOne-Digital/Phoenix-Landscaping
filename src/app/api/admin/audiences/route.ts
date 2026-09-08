import { Audience } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { audienceSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: Audience,
  scope: 'admin/audiences',
  schema: audienceSchema,
  imagePaths: ['image.src'],
});
