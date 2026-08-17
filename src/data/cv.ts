/**
 * CV content.
 *
 * Experience, education and languages are transcribed from your LinkedIn
 * profile export; teaching, awards and academic service from anandkrishna.me.
 * Nothing here is a placeholder.
 *
 * Plain TypeScript rather than a content collection because a CV is one
 * structured document, not a list of pages: you get type-checking and
 * autocomplete while editing, with no loader in the way.
 */

export interface Role {
  role: string;
  org: string;
  orgUrl?: string;
  /** Display strings so you control the formatting: "May 2025", "2018". */
  start: string;
  /** Omit for a current role — renders as "Present". */
  end?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface Study {
  qualification: string;
  institution: string;
  start?: string;
  end: string;
  note?: string;
}

export interface Course {
  title: string;
  /** e.g. "Aug – Dec 2022", or several terms. */
  when: string;
  institution: string;
  /** Set when you were the instructor rather than a TA. */
  role?: 'Teaching Assistant' | 'Instructor';
}

export interface Award {
  title: string;
  date: string;
  awarder?: string;
  url?: string;
}

export interface Language {
  name: string;
  /** Free text: "Native", "Professional", "Conversational". */
  level: string;
}

export interface CV {
  /** Two or three sentences at the top of the page. */
  summary: string;
  /** External CV/résumé link or a PDF you drop in `public/`. */
  resumeUrl?: string;
  experience: Role[];
  education: Study[];
  teaching: Course[];
  awards: Award[];
  /** Venues you've reviewed for. */
  service: string[];
  languages: Language[];
  skills: { group: string; items: string[] }[];
}

export const cv: CV = {
  summary:
    'I lead Data Science & AI at Poiro. Previously a Postdoctoral Research Fellow at the National University of Singapore, and a Prime Minister’s Research Fellow in the Department of Computer Science and Automation at the Indian Institute of Science, where I completed my Ph.D. under Prof. Y. Narahari and Assoc. Prof. Siddharth Barman.',

  /**
   * No CV PDF yet — deliberately unset.
   *
   * The Google Drive link on your old site was the talk video for the WINE 2022
   * paper, not a CV; it now sits on that publication instead. Set this to a real
   * URL (or drop a file in `public/` and point at `/anand-krishna-cv.pdf`) and the
   * "Full CV (PDF)" button reappears on /cv automatically.
   */
  // resumeUrl: '/anand-krishna-cv.pdf',

  experience: [
    {
      role: 'Lead AI Scientist',
      org: 'Poiro',
      orgUrl: 'https://poiro.com',
      start: 'May 2025',
      location: 'Bengaluru, India',
      summary:
        'Leading Data Science & AI. Poiro builds AI systems and agents that supercharge marketing workflows and bring brands closer to consumers.',
      highlights: [
        'AI systems trained on a brand’s structured and unstructured marketing data — social content, marketplace data, first-party customer data — to build a knowledge representation of the brand and its category.',
        'Agents that run analytics and data-science workflows over that representation to produce actionable insight and guide marketing execution.',
        'Used by brands to identify content whitespaces, target creative and creator recommendations at ROI, and audit creator risk before commercial commitments.',
      ],
    },
    {
      role: 'Research Consultant',
      org: 'Walmart',
      start: 'Nov 2024',
      end: 'Apr 2025',
      location: 'Bengaluru, India',
      summary:
        'Developed scalable systems for real-time advertiser query processing to estimate impressions.',
    },
    {
      role: 'Postdoctoral Research Fellow',
      org: 'National University of Singapore',
      orgUrl: 'https://nus.edu.sg/',
      start: 'Sep 2023',
      end: 'Sep 2024',
      location: 'Singapore',
      summary: 'School of Computing, working with Prof. Vincent Y. F. Tan.',
      highlights: [
        'Online learning and optimization under adversarial corruption, including the LEARN invex loss for outlier-oblivious online convex optimization (UAI 2026).',
        'Extended p-mean welfare objectives from social choice to stochastic bandits, unifying average and Nash regret in one algorithm (AAAI 2025).',
        'Sample-efficient alternating minimization for robust phase retrieval, published in IEEE Transactions on Information Theory.',
      ],
    },
    {
      role: 'Prime Minister’s Research Fellow (PMRF)',
      org: 'Indian Institute of Science',
      orgUrl: 'https://iisc.ac.in/',
      start: 'Aug 2018',
      end: 'Aug 2023',
      location: 'Bengaluru, India',
      summary:
        'Ph.D. in the Department of Computer Science and Automation, advised by Prof. Y. Narahari and Assoc. Prof. Siddharth Barman.',
      highlights: [
        'Approximation algorithms for fair division: Nash social welfare and p-mean welfare under subadditive, XOS, and dichotomous valuations.',
        'Results published at ESA 2020, IJCAI 2022, WINE 2022, and ITCS 2024.',
      ],
    },
    {
      role: 'Research Intern',
      org: 'IBM India Research Lab',
      start: 'Jun 2019',
      end: 'Sep 2019',
      location: 'Bengaluru, India',
    },
    {
      role: 'Research and Development Intern',
      org: 'Aindra Systems',
      start: 'Jun 2018',
      end: 'Jul 2018',
      location: 'Bengaluru, India',
    },
  ],

  education: [
    {
      qualification: 'Ph.D. in Computer Science',
      institution: 'Indian Institute of Science',
      start: '2018',
      end: '2023',
      note: 'Department of Computer Science and Automation. Advised by Prof. Y. Narahari and Assoc. Prof. Siddharth Barman.',
    },
    {
      qualification: 'B.Tech (Honours) in Computer Engineering',
      institution: 'Government Engineering College, Thrissur',
      end: '2017',
    },
  ],

  teaching: [
    {
      title: 'Probability',
      when: 'Jan 2021',
      institution: 'Dayananda Sagar University',
      role: 'Instructor',
    },
    {
      title: 'Computational Methods of Optimization',
      when: 'Aug – Dec 2022',
      institution: 'Indian Institute of Science',
      role: 'Teaching Assistant',
    },
    {
      title: 'Game Theory',
      when: 'Jan – Jun 2020, 2021, 2023',
      institution: 'Indian Institute of Science',
      role: 'Teaching Assistant',
    },
    {
      title: 'Randomized Algorithms',
      when: 'Feb – Jun 2021',
      institution: 'Indian Institute of Science',
      role: 'Teaching Assistant',
    },
    {
      title: 'Linear Algebra and Probability',
      when: 'Aug – Dec 2019',
      institution: 'Indian Institute of Science',
      role: 'Teaching Assistant',
    },
  ],

  awards: [
    {
      title: 'Best Presentation Award, EECS Research Students Symposium',
      date: 'Apr 2023',
      awarder: 'Indian Institute of Science',
    },
    {
      title: 'Best Poster Award, Annual PMRF Symposium',
      date: 'Feb 2023',
      awarder: 'Prime Minister’s Research Fellowship',
    },
    {
      title:
        'Selected for Commendable Research by PMRFs in Computer Science & Engineering, Data Science, and Mathematics',
      date: 'Feb 2023',
      awarder: 'Prime Minister’s Research Fellowship',
    },
    {
      title: 'Visiting researcher with Prof. Warut Suksompong',
      date: 'Jan 2023',
      awarder: 'National University of Singapore',
    },
    {
      title: 'EC’20 Global Outreach Program and EC Mentoring Workshop',
      date: '2020',
      awarder: 'ACM Conference on Economics and Computation',
    },
  ],

  service: [
    'FOCS 2024',
    'APPROX 2023',
    'WWW 2023',
    'SOSA 2023',
    'WWW 2022',
    'SAGT 2021',
    'WINE 2020',
    'WINE 2019',
  ],

  languages: [
    { name: 'Tamil', level: 'Native' },
    { name: 'Malayalam', level: 'Native' },
    { name: 'Hindi', level: 'Native' },
    { name: 'English', level: 'Professional' },
  ],

  skills: [
    {
      group: 'Research areas',
      items: [
        'Game Theory',
        'Fair Division',
        'Online Learning',
        'Randomized Algorithms',
        'Reinforcement Learning',
        'Optimization',
        'Machine Learning',
      ],
    },
    {
      // TODO(anand): LinkedIn only surfaced three top skills. Extend this list.
      group: 'Tools',
      items: ['C++', 'Python', 'LaTeX'],
    },
  ],
};
