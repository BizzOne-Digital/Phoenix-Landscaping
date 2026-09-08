import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Gallery' };

export default function Page() {
  return (
    <CollectionManager
      endpoint="/api/admin/gallery"
      title="Gallery"
      itemNoun="Gallery image"
      description="Job photography managed here and published to the public site through /api/gallery. Each item stores only the image URL; the binary lives in MongoDB."
      searchKeys={['title', 'alt']}
      columns={[
        { key: 'image', label: 'Photo', kind: 'thumb' },
        { key: 'title', label: 'Title' },
        { key: 'order', label: 'Order', kind: 'muted' },
        { key: 'published', label: 'Status', kind: 'published' },
      ]}
      fields={[
        { type: 'imagePath', name: 'image', label: 'Photo', folder: 'gallery' },
        { type: 'text', name: 'title', label: 'Title', hint: 'optional' },
        {
          type: 'text',
          name: 'alt',
          label: 'Alt text',
          hint: 'describes the photo for screen readers',
        },
        { type: 'number', name: 'order', label: 'Order' },
        { type: 'switch', name: 'published', label: 'Show in the gallery' },
      ]}
    />
  );
}
