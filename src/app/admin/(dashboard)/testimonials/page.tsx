import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Testimonials' };

export default function Page() {
  return (
    <CollectionManager
      endpoint="/api/admin/testimonials"
      title="Testimonials"
      itemNoun="Testimonial"
      description="Real client feedback only. While this list is empty the public pages keep showing their honest &ldquo;reviews coming soon&rdquo; panel."
      searchKeys={['author', 'quote', 'location']}
      columns={[
        { key: 'author', label: 'Author' },
        { key: 'quote', label: 'Quote', kind: 'muted' },
        { key: 'location', label: 'Location', kind: 'muted' },
        { key: 'published', label: 'Status', kind: 'published' },
      ]}
      fields={[
        {
          type: 'textarea',
          name: 'quote',
          label: 'Quote',
          required: true,
          rows: 5,
          hint: 'exactly as the client wrote it',
        },
        { type: 'text', name: 'author', label: 'Author', required: true },
        { type: 'text', name: 'role', label: 'Role', hint: 'optional, e.g. Homeowner' },
        { type: 'text', name: 'location', label: 'Location', hint: 'optional' },
        { type: 'text', name: 'service', label: 'Service', hint: 'optional' },
        { type: 'number', name: 'order', label: 'Order' },
        { type: 'switch', name: 'published', label: 'Show on the website' },
      ]}
    />
  );
}
