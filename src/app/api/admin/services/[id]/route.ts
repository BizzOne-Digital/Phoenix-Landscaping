import { Service } from '@/lib/db/models';
import { createItemHandlers } from '@/lib/api/crud';
import { serviceSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, PATCH, DELETE } = createItemHandlers({
  model: Service,
  scope: 'admin/services',
  schema: serviceSchema,
  imagePaths: ['image.src'],
  uniqueField: 'slug',
});
