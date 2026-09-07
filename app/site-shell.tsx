'use client';

import type { ReactNode } from 'react';
import { SiteNav } from './site-nav';
import { profile } from './profile';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="academic-shell">
      <header className="profile-sidebar">
        <a className="author" href="/">{profile.name}</a>
        <SiteNav />
      </header>
      <main id="main" className="content" tabIndex={-1}>{children}</main>
    </div>
  );
}
