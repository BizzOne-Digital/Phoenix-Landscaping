import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Who we serve' };

export default function Page() {
  return (
    <CollectionManager
      endpoint="/api/admin/audiences"
      title="Who we serve"
      itemNoun="Audience"
      description="The client-type cards on the home and services pages."
      searchKeys={['title', 'description']}
      columns={[
        { key: 'image.src', label: 'Photo', kind: 'thumb' },
        { key: 'title', label: 'Title' },
        { key: 'order', label: 'Order', kind: 'muted' },
        { key: 'published', label: 'Status', kind: 'published' },
      ]}
      fields={[
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'textarea', name: 'description', label: 'Description', rows: 3 },
        { type: 'icon', name: 'icon', label: 'Icon' },
        { type: 'image', name: 'image', label: 'Photo', folder: 'pages' },
        { type: 'number', name: 'order', label: 'Order' },
        { type: 'switch', name: 'published', label: 'Show on the website' },
      ]}
    />
  );
}
