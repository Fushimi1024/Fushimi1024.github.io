'use client';

import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'About', subtitle: 'Profile' },
  { href: '/contact', label: 'Contact', subtitle: 'Details' },
];

export function SiteNav() {
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  return (
    <nav className="site-nav" aria-label="Main navigation">
      {pages.map((page) => (
        <a key={page.href} href={page.href} aria-current={pathname === page.href ? 'page' : undefined}>
          <span>{page.label}</span><span className="nav-translation">{page.subtitle}</span>
        </a>
      ))}
    </nav>
  );
}
