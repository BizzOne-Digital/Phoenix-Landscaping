import { Service } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { serviceSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: Service,
  scope: 'admin/services',
  schema: serviceSchema,
  imagePaths: ['image.src'],
  uniqueField: 'slug',
});
