// Update all public profile details in this one place.
export const profile = {
  name: 'Tianyu Chen',
  role: 'Ph.D. Candidate',
  about: 'I am a second-year Ph.D. student in the School of Mathematics and Statistics at Central China Normal University, and a joint Ph.D. student in the Department of Mathematics and Applied Mathematics at the University of Crete.',
  interests: "My research interests lie in harmonic analysis, with a particular focus on Fuglede's spectral set conjecture.",
  seminars: '[To be added] Seminars, reading groups, and academic activities.',
  email: 'chentianyu1024@gmail.com',
  affiliation: 'School of Mathematics and Statistics, Central China Normal University',
  address: '[To be added] Office address',
  publications: [
    {
      title: "Fuglede's Conjecture for a Union of Two Intervals on $\\mathbb{R} \\times \\mathbb{Z}_N$",
      collaborators: 'Shilei Fan and Huaibin Li',
      venue: 'J. Fourier Anal. Appl. 32(5), Article 88 (2026)',
      links: [
        { label: 'journal', url: 'https://link.springer.com/article/10.1007/s00041-026-10295-7' },
      ] as { label: string; url: string }[],
    },
    {
      title: 'Weak Tiling by Unions of Non-overlapping Unit Cubes',
      collaborators: 'Shilei Fan, Mihail N. Kolountzakis, and Chun-Kit Lai',
      venue: 'arXiv:2609.34852 [math.CA] (2026)',
      links: [
        { label: 'arXiv', url: 'https://arxiv.org/abs/2609.34852' },
      ] as { label: string; url: string }[],
    },
  ],
};
