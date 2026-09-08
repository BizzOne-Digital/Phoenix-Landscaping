import { Testimonial } from '@/lib/db/models';
import { createItemHandlers } from '@/lib/api/crud';
import { testimonialSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, PATCH, DELETE } = createItemHandlers({
  model: Testimonial,
  scope: 'admin/testimonials',
  schema: testimonialSchema,
});
