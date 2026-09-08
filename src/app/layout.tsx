import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ParkPing — Smart Vehicle QR Scanner & Privacy Masked Contact',
  description: 'Generate smart vehicle QR stickers with phone number masking. Allow anyone to call or message the vehicle owner securely without revealing personal contact numbers.',
  keywords: ['ParkPing', 'Vehicle QR Code', 'Smart Car Tag', 'Parking Scanner', 'Masked Call', 'Car QR Sticker'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#080c14] text-slate-100 selection:bg-brand-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
