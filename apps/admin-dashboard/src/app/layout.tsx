import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Delivra Admin Dashboard',
  description: 'Admin dashboard for Delivra multi-category delivery platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
