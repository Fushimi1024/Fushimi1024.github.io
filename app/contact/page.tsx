import type { Metadata } from 'next';
import { profile } from '../profile';
export const metadata: Metadata = { title: 'Contact' };
export default function Contact() {
  return <section>
    <h1>Contact</h1>
    <dl>
      <dt>Email</dt>
      <dd>{profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : '［邮箱待填写］'}</dd>
      <dt>Affiliation</dt><dd>{profile.affiliation}</dd>
      <dt>Office</dt><dd>{profile.address}</dd>
    </dl>
  </section>;
}
