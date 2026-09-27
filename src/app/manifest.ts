import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'nuvoriq-family-executive-pwa',
    name: 'Nuvoriq Family Executive-Functioning & Socratic Coaching Hub',
    short_name: 'Nuvoriq Hub',
    description:
      'K-12 Family Executive Functioning, Time-Blindness Calibration & Socratic Parent Coaching Platform for iOS, Android & Desktop.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#020617',
    theme_color: '#020617',
    categories: ['education', 'productivity', 'lifestyle'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
