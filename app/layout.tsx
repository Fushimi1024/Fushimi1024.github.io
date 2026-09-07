import type { Metadata } from 'next';
import { profile } from './profile';
import { SiteShell } from './site-shell';
import './globals.css';

export const metadata: Metadata = {
  title: { default: `${profile.name} | 个人主页`, template: `%s | ${profile.name}` },
  description: '个人学术主页：个人介绍、研究方向、论文、教学与联系方式。',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main">跳转到正文</a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
