import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Delivra Vendor Portal',
  description: 'Manage your store on Delivra',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
