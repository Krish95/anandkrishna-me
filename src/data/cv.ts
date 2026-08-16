/**
 * CV content.
 *
 * Transcribed from anandkrishna.me. Plain TypeScript rather than a content
 * collection because a CV is one structured document, not a list of pages: you
 * get type-checking and autocomplete while editing, with no loader in the way.
 *
 * TODO(anand): every date written as `20XX` below is a placeholder — I could not
 * source it. LinkedIn blocks automated fetching, so the Poiro and Walmart
 * entries came from your public headline ("Research @ Poiro | Ex-Walmart | NUS |
 * IISc") and nothing more. Fill in:
 *   - Poiro   : start date, and your exact title
 *   - Walmart : start and end dates, and your exact title
 *   - NUS     : end date
 * The Ph.D. start (Aug 2018) is sourced from your advisor's group page.
 */

export interface Role {
  role: string;
  org: string;
  orgUrl?: string;
  /** Display strings so you control the formatting: "Jun 2019", "2023". */
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
  /** e.g. "Aug 2022 – Dec 2022", or several terms. */
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
  skills: { group: string; items: string[] }[];
}

export const cv: CV = {
  summary:
    'Researcher at Poiro. Previously a postdoctoral research fellow at the National University of Singapore working with Prof. Vincent Y. F. Tan, and before that at Walmart. I completed my Ph.D. as a Prime Minister’s Research Fellow in the Department of Computer Science and Automation at the Indian Institute of Science, under Prof. Y. Narahari and Assoc. Prof. Siddharth Barman.',

  // The CV PDF linked from the previous site.
  resumeUrl: 'https://drive.google.com/file/d/14H7znegK0vE0-aOFUkDg06msh27qRQDE/view?usp=sharing',

  experience: [
    {
      // TODO(anand): confirm title and start date.
      role: 'Researcher',
      org: 'Poiro',
      orgUrl: 'https://poiro.com',
      start: '20XX',
      location: 'Bengaluru, India',
    },
    {
      // TODO(anand): confirm title and dates.
      role: 'Researcher',
      org: 'Walmart',
      start: '20XX',
      end: '20XX',
      location: 'Bengaluru, India',
    },
    {
      role: 'Postdoctoral Research Fellow',
      org: 'National University of Singapore',
      orgUrl: 'https://nus.edu.sg/',
      start: '2023',
      end: '20XX',
      location: 'Singapore',
      summary: 'School of Computing, working with Prof. Vincent Y. F. Tan.',
      highlights: [
        'Online learning and optimization under adversarial corruption, including the LEARN invex loss for outlier-oblivious online convex optimization.',
        'Extended p-mean welfare objectives from social choice to stochastic bandits, unifying average and Nash regret in one algorithm (AAAI 2025).',
        'Sample-efficient alternating minimization for robust phase retrieval, published in IEEE Transactions on Information Theory.',
      ],
    },
    {
      role: 'Prime Minister’s Research Fellow (PMRF)',
      org: 'Indian Institute of Science',
      orgUrl: 'https://iisc.ac.in/',
      start: 'Aug 2018',
      end: '2023',
      location: 'Bangalore, India',
      summary:
        'Ph.D. in the Department of Computer Science and Automation, advised by Prof. Y. Narahari and Assoc. Prof. Siddharth Barman.',
      highlights: [
        'Approximation algorithms for fair division: Nash social welfare and p-mean welfare under subadditive, XOS, and dichotomous valuations.',
        'Results published at ESA 2020, IJCAI 2022, WINE 2022, and ITCS 2024.',
      ],
    },
    {
      role: 'Research Intern',
      org: 'IBM Research',
      start: 'Jun 2019',
      end: 'Sep 2019',
    },
    {
      role: 'R&D Intern',
      org: 'Aindra Systems',
      start: 'Jun 2018',
      end: 'Jul 2018',
    },
  ],

  education: [
    {
      qualification: 'Ph.D. in Computer Science',
      institution: 'Indian Institute of Science',
      end: '2023',
      note: 'Department of Computer Science and Automation. Advised by Prof. Y. Narahari and Assoc. Prof. Siddharth Barman.',
    },
    {
      qualification: 'B.Tech (Hons.) in Computer Science',
      institution: 'Govt. Engineering College, Thrissur, Kerala',
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
      ],
    },
    {
      group: 'Tools',
      items: ['Python', 'C++', 'LaTeX', 'NumPy', 'PyTorch'],
    },
  ],
};
