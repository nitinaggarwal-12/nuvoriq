import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FamilyStoreProvider } from '@/context/FamilyStoreContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
    { media: '(prefers-color-scheme: light)', color: '#020617' },
  ],
};

export const metadata: Metadata = {
  title: 'Nuvoriq | Enterprise Family Executive-Functioning & Socratic Parent Coaching Platform',
  description:
    'Next-generation K-12 family executive functioning hub featuring Time-Blindness Calibration, Cognitive Energy Budgeting, 2-Stage Transition Runway Alerts, Low-Stakes Grace Shields, Self-Referenced Ipsative Radar Charts, and Socratic Sunday Family Summits.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nuvoriq Hub',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" id="html-root-nuvoriq">
      <body
        id="body-root-nuvoriq"
        className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500/30 selection:text-teal-200 flex flex-col"
      >
        <FamilyStoreProvider>{children}</FamilyStoreProvider>
      </body>
    </html>
  );
}
