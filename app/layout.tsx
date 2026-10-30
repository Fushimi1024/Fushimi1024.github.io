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
  const cloudflareWebAnalyticsToken = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.MathJax = { tex: { inlineMath: [['\\\\(', '\\\\)'], ['$', '$']] }, options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] } };` }} />
        <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <SiteShell>{children}</SiteShell>
        {cloudflareWebAnalyticsToken ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cloudflareWebAnalyticsToken })}
          />
        ) : null}
      </body>
    </html>
  );
}
