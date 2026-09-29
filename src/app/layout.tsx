import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ParkEase | Smart Peer-to-Peer Parking & Driveway Rentals',
  description:
    'Find and reserve guaranteed private parking spots and driveways, or earn passive income by renting your empty driveway or garage stall.',
  keywords: [
    'parking rental',
    'driveway rental',
    'rent my parking spot',
    'hourly parking',
    'airport parking',
    'ev charging parking',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
