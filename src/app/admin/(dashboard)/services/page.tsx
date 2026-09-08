import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Services' };

export default function Page() {
  return (
    <CollectionManager
      endpoint="/api/admin/services"
      title="Services"
      itemNoun="Service"
      description="The service pillars shown on the home page, the services page and in the footer. The slug is the anchor used by /services#slug links."
      searchKeys={['title', 'slug', 'shortDescription']}
      columns={[
        { key: 'image.src', label: 'Photo', kind: 'thumb' },
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug', kind: 'muted' },
        { key: 'order', label: 'Order', kind: 'muted' },
        { key: 'published', label: 'Status', kind: 'published' },
      ]}
      fields={[
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'text', name: 'slug', label: 'Slug', required: true, hint: 'lowercase, hyphenated' },
        { type: 'textarea', name: 'shortDescription', label: 'Short description', rows: 3 },
        { type: 'textarea', name: 'longDescription', label: 'Long description', rows: 7 },
        { type: 'list', name: 'benefits', label: 'What you get', hint: 'one per line' },
        { type: 'list', name: 'suitableFor', label: 'Suitable for', hint: 'one per line' },
        { type: 'icon', name: 'icon', label: 'Icon' },
        { type: 'image', name: 'image', label: 'Service photo', folder: 'pages' },
        { type: 'number', name: 'order', label: 'Order' },
        { type: 'switch', name: 'published', label: 'Show on the website' },
      ]}
    />
  );
}
