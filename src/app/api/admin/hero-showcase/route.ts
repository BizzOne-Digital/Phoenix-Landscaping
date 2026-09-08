import { HeroShowcaseItem } from '@/lib/db/models';
import { createCollectionHandlers } from '@/lib/api/crud';
import { heroShowcaseSchema } from '@/lib/api/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = createCollectionHandlers({
  model: HeroShowcaseItem,
  scope: 'admin/hero-showcase',
  schema: heroShowcaseSchema,
  imagePaths: ['image.src'],
});
