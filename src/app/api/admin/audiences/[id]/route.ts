import { Audience } from '@/lib/db/models';
import { createItemHandlers } from '@/lib/api/crud';
import { audienceSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, PATCH, DELETE } = createItemHandlers({
  model: Audience,
  scope: 'admin/audiences',
  schema: audienceSchema,
  imagePaths: ['image.src'],
});
