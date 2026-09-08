import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Why choose us' };

export default function Page() {
  return (
    <CollectionManager
      endpoint="/api/admin/why-choose"
      title="Why choose us"
      itemNoun="Reason"
      description="The &ldquo;Why Phoenix&rdquo; grid on the home and about pages."
      searchKeys={['title', 'description']}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', kind: 'muted' },
        { key: 'order', label: 'Order', kind: 'muted' },
        { key: 'published', label: 'Status', kind: 'published' },
      ]}
      fields={[
        { type: 'text', name: 'title', label: 'Title', required: true },
        { type: 'textarea', name: 'description', label: 'Description', rows: 3 },
        { type: 'icon', name: 'icon', label: 'Icon' },
        { type: 'number', name: 'order', label: 'Order' },
        { type: 'switch', name: 'published', label: 'Show on the website' },
      ]}
    />
  );
}
