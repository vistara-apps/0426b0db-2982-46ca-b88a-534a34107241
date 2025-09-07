import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthSync - Your All-in-One Health Assistant',
  description: 'Track symptoms, manage medications, store health records, and share summaries with your healthcare providers.',
  keywords: 'health, symptoms, medication, tracking, Base, miniapp',
  authors: [{ name: 'HealthSync Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen cyber-grid">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
