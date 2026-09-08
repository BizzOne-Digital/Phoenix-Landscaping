import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Four seasons' };

export default function Page() {
  return (
    <CollectionManager
      endpoint="/api/admin/seasons"
      title="Four seasons"
      itemNoun="Season"
      description="The four-season section on the home and services pages."
      searchKeys={['name', 'headline']}
      columns={[
        { key: 'image.src', label: 'Photo', kind: 'thumb' },
        { key: 'name', label: 'Season' },
        { key: 'headline', label: 'Headline', kind: 'muted' },
        { key: 'order', label: 'Order', kind: 'muted' },
        { key: 'published', label: 'Status', kind: 'published' },
      ]}
      fields={[
        { type: 'text', name: 'name', label: 'Season name', required: true },
        { type: 'text', name: 'headline', label: 'Headline' },
        { type: 'textarea', name: 'description', label: 'Description', rows: 3 },
        { type: 'icon', name: 'icon', label: 'Icon' },
        { type: 'image', name: 'image', label: 'Photo', folder: 'pages' },
        { type: 'number', name: 'order', label: 'Order' },
        { type: 'switch', name: 'published', label: 'Show on the website' },
      ]}
    />
  );
}
