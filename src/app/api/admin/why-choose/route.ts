import { WhyChooseItem } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { pointSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: WhyChooseItem,
  scope: 'admin/why-choose',
  schema: pointSchema,
});
