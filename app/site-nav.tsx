'use client';

import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'About', subtitle: '关于我' },
  { href: '/teaching', label: 'Teaching', subtitle: '教学' },
  { href: '/contact', label: 'Contact', subtitle: '联系' },
];

export function SiteNav() {
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  return (
    <nav className="site-nav" aria-label="主导航">
      {pages.map((page) => (
        <a key={page.href} href={page.href} aria-current={pathname === page.href ? 'page' : undefined}>
          <span>{page.label}</span><span className="nav-translation" lang="zh-CN">{page.subtitle}</span>
        </a>
      ))}
    </nav>
  );
}
