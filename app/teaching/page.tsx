import type { Metadata } from 'next';
import { profile } from '../profile';
export const metadata: Metadata = { title: 'Teaching' };
export default function Teaching() {
  return <section><h1>Teaching</h1><p>{profile.teaching}</p></section>;
}
