import { Season } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { seasonSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: Season,
  scope: 'admin/seasons',
  schema: seasonSchema,
  imagePaths: ['image.src'],
});
