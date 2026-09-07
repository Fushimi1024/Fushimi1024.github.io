import type { Metadata } from 'next';
import { profile } from './profile';
import { SiteShell } from './site-shell';
import './globals.css';

export const metadata: Metadata = {
  title: { default: `${profile.name} | Academic Homepage`, template: `%s | ${profile.name}` },
  description: 'Academic homepage for Tianyu Chen: research, publications, and contact information.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
