import { profile } from './profile';

export default function Home() {
  return (
    <>
      <section className="intro-section" aria-labelledby="about">
        <h1 id="about">About Me<span className="heading-dot">.</span></h1>
        <p className="intro-copy">{profile.about}</p>
      </section>
      <section aria-labelledby="research">
        <div className="section-heading"><h2 id="research">Research Interests</h2></div>
        <p>{profile.interests}</p>
      </section>
      <section aria-labelledby="publications">
        <div className="section-heading"><h2 id="publications">Publications</h2></div>
        <ol className="publications">
          {profile.publications.map((paper) => (
            <li key={paper.title}>
              <span className="paper-title">{paper.title}</span>{' '}
              {paper.collaborators && <span className="paper-collaborators">(with {paper.collaborators})</span>},<br />
              <span className="paper-venue">{paper.venue}</span>.
              {paper.links.length > 0 && <div className="paper-links">{paper.links.map((link) => <a key={link.url} href={link.url}>{link.label}<span aria-hidden="true"> ↗</span></a>)}</div>}
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="seminars">
        <div className="section-heading"><h2 id="seminars">Seminars</h2></div>
        <p>{profile.seminars}</p>
      </section>
    </>
  );
}
