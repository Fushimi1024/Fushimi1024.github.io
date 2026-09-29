// Update all public profile details in this one place.
export const profile = {
  name: 'Tianyu Chen',
  role: 'Ph.D. Candidate',
  about: 'I am a second-year Ph.D. student in the School of Mathematics and Statistics at Central China Normal University, and a joint Ph.D. student in the Department of Mathematics and Applied Mathematics at the University of Crete.',
  interests: "My research interests lie in harmonic analysis, with a particular focus on Fuglede's spectral set conjecture.",
  seminars: '[To be added] Seminars, reading groups, and academic activities.',
  email: 'chentianyu1024@gmail.com',
  affiliation: 'School of Mathematics and Statistics, Central China Normal University',
  address: 'School of Mathematics and Statistics and Hubei Key Laboratory of Mathematical Science,\nCentral China Normal University, Wuhan 430079, China\n\nDepartment of Mathematics and Applied Mathematics,\nUniversity of Crete, Voutes Campus, 70013 Heraklion, Greece',
  publications: [
    {
      title: 'Weak Tiling by Unions of Non-overlapping Unit Cubes',
      collaborators: [
        { name: 'Shilei Fan', url: 'https://maths.ccnu.edu.cn/info/1155/21114.htm' },
        { name: 'Mihail N. Kolountzakis', url: 'https://eigen-space.org/' },
        { name: 'Chun-Kit Lai', url: 'https://sites.google.com/view/chunkitlai/home' },
      ],
      venue: 'arXiv:2609.34852 (2026)',
      links: [
        { label: 'arXiv', url: 'https://arxiv.org/abs/2609.34852' },
      ] as { label: string; url: string }[],
    },
    {
      title: "Fuglede's Conjecture for a Union of Two Intervals on \\(\\mathbb{R} \\times \\mathbb{Z}_N\\)",
      collaborators: [
        { name: 'Shilei Fan', url: 'https://maths.ccnu.edu.cn/info/1155/21114.htm' },
        { name: 'Huaibin Li', url: 'https://www.cupk.edu.cn/wlxy/c/2024-04-29/521364.shtml' },
      ],
      venue: 'J. Fourier Anal. Appl. 32(5), Article 88 (2026)',
      links: [
        { label: 'journal', url: '/two-intervals-R-times-Z.pdf' },
      ] as { label: string; url: string }[],
    },
  ],
};
