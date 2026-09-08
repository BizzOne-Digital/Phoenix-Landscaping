import { WhyChooseItem } from '@/lib/db/models';
import { createItemHandlers } from '@/lib/api/crud';
import { pointSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, PATCH, DELETE } = createItemHandlers({
  model: WhyChooseItem,
  scope: 'admin/why-choose',
  schema: pointSchema,
});
