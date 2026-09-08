import type { Metadata } from 'next';
import CollectionManager from '@/components/admin/CollectionManager';

export const metadata: Metadata = { title: 'Page photography' };

export default function Page() {
  return (
    <div className="space-y-10">
      <CollectionManager
        endpoint="/api/admin/page-images"
        title="Page photography"
        itemNoun="Page photo"
        description="The full-width hero and feature photos on each page. The key decides where the photo appears, so keys are fixed rather than created."
        searchKeys={['key', 'label']}
        allowCreate={false}
        allowDelete={false}
        columns={[
          { key: 'image.src', label: 'Photo', kind: 'thumb' },
          { key: 'label', label: 'Slot' },
          { key: 'key', label: 'Key', kind: 'muted' },
        ]}
        fields={[
          { type: 'text', name: 'label', label: 'Slot name' },
          { type: 'image', name: 'image', label: 'Photo', folder: 'pages' },
        ]}
      />

      <CollectionManager
        endpoint="/api/admin/hero-showcase"
        title="Hero collage"
        itemNoun="Collage tile"
        description="The four photos beside the home-page headline on large screens."
        searchKeys={['label']}
        columns={[
          { key: 'image.src', label: 'Photo', kind: 'thumb' },
          { key: 'label', label: 'Label' },
          { key: 'order', label: 'Order', kind: 'muted' },
          { key: 'published', label: 'Status', kind: 'published' },
        ]}
        fields={[
          { type: 'text', name: 'label', label: 'Label', required: true },
          { type: 'image', name: 'image', label: 'Photo', folder: 'pages' },
          { type: 'number', name: 'order', label: 'Order' },
          { type: 'switch', name: 'published', label: 'Show in the collage' },
        ]}
      />
    </div>
  );
}
