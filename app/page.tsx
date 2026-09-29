import { profile } from './profile';
import { Fragment } from 'react';

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
              {paper.collaborators.length > 0 && <><span className="paper-collaborators">(with {paper.collaborators.map((collaborator, index) => <Fragment key={collaborator.url}><a href={collaborator.url}>{collaborator.name}</a>{index < paper.collaborators.length - 2 ? ', ' : index === paper.collaborators.length - 2 ? ' and ' : ''}</Fragment>)})</span>, </>}
              <span className="paper-title">{paper.title}</span>,{' '}
              <span className="paper-venue">{paper.venue}</span>.
              {paper.links.length > 0 && <span className="paper-links">{' '}{paper.links.map((link, index) => <span key={link.url}><a href={link.url}>[{link.label}]</a>{index < paper.links.length - 1 && ', '}</span>)}</span>}
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
