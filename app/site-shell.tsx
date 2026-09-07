'use client';

import type { ReactNode } from 'react';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { SiteNav } from './site-nav';
import { profile } from './profile';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="academic-shell">
      <Sidebar collapsible="none" className="profile-sidebar">
        <header className="profile-header">
          <p className="eyebrow">PERSONAL WEBSITE</p>
          <a className="author" href="/">{profile.name}</a>
          <p className="chinese-name">{profile.role}</p>
          <p className="affiliation">{profile.affiliation}</p>
        </header>
        <SiteNav />
        {profile.email && <a className="sidebar-email" href={`mailto:${profile.email}`}>{profile.email}</a>}
      </Sidebar>
      <main id="main" className="content" tabIndex={-1}>{children}</main>
    </SidebarProvider>
  );
}
