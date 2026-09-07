'use client';

import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNav() {
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  return (
    <nav className="site-nav" aria-label="Main navigation">
      {pages.map((page) => (
        <a key={page.href} href={page.href} aria-current={pathname === page.href ? 'page' : undefined}>
          {page.label}
        </a>
      ))}
    </nav>
  );
}
