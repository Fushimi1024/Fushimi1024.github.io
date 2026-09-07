import { profile } from './profile';

export default function Home() {
  return (
    <>
      <section className="intro-section" aria-labelledby="about">
        <p className="eyebrow">ABOUT / 关于我</p>
        <h1 id="about">About Me<span className="heading-dot">.</span></h1>
        <p className="intro-copy">{profile.about}</p>
      </section>
      <section aria-labelledby="research">
        <div className="section-heading"><h2 id="research">Research Interest</h2><span>研究方向</span></div>
        <p>{profile.interests}</p>
      </section>
      <section aria-labelledby="publications">
        <div className="section-heading"><h2 id="publications">Publications</h2><span>论文</span></div>
        <ol className="publications">
          {profile.publications.map((paper) => (
            <li key={paper.title}>
              <h3>{paper.title}</h3>
              <p className="paper-authors">{paper.authors}</p>
              <p className="paper-venue">{paper.venue}</p>
              {paper.links.length > 0 && <div className="paper-links">{paper.links.map((link) => <a key={link.url} href={link.url}>{link.label}<span aria-hidden="true"> ↗</span></a>)}</div>}
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="seminars">
        <div className="section-heading"><h2 id="seminars">Seminars</h2><span>学术活动</span></div>
        <p>{profile.seminars}</p>
      </section>
    </>
  );
}
