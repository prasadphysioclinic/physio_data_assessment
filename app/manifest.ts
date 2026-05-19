import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Prasad Physio Therapy',
    short_name: 'PhysioTrack',
    description: 'Clinical Physiotherapy Assessment System',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '192x192 512x512',
        type: 'image/jpeg',
        purpose: 'any maskable',
      },
    ],
  };
}
