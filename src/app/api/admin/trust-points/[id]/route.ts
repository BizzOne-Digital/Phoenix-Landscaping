import { TrustPoint } from '@/lib/db/models';
import { createItemHandlers } from '@/lib/api/crud';
import { pointSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, PATCH, DELETE } = createItemHandlers({
  model: TrustPoint,
  scope: 'admin/trust-points',
  schema: pointSchema,
});
