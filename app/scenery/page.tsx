import type { Metadata } from 'next';
import { profile } from '../profile';

export const metadata: Metadata = { title: 'Scenery' };

export default function Scenery() {
  return (
    <section aria-labelledby="scenery">
      <div className="section-heading">
        <h1 id="scenery">Scenery<span className="heading-dot">.</span></h1>
        <span className="section-kicker">Photos &amp; videos</span>
      </div>
      {profile.scenery.items.length > 0 ? (
        <div className="scenery-grid">
          {profile.scenery.items.map((item) => (
            <figure className="scenery-item" key={`${item.type}-${item.src}`}>
              {item.type === 'video' ? (
                <video src={item.src} controls preload="metadata" aria-label={item.title} />
              ) : (
                <img src={item.src} alt={item.title} loading="lazy" />
              )}
              <figcaption>
                <span>{item.title}</span>
                {item.location && <small>{item.location}</small>}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="scenery-empty">
          <p className="scenery-empty-title">{profile.scenery.description}</p>
          <p className="scenery-empty-copy">Photos and videos will appear here.</p>
        </div>
      )}
    </section>
  );
}
