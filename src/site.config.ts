/**
 * Single source of truth for site identity.
 *
 * This is the only file you must edit to change who the site is about.
 * Everything else (pages, RSS, OG images, sitemap, structured data) reads
 * from here.
 *
 * Kept dependency-free on purpose: `astro.config.ts` imports it, so it must
 * not import anything from `astro:*` virtual modules.
 */

export const SITE = {
  /** No trailing slash. Override per-environment with the SITE_URL env var. */
  url: 'https://anandkrishna.me',

  /** Browser tab, `<title>` suffix, RSS channel title. */
  title: 'Anand Krishna',

  /** Meta description fallback and RSS channel description. */
  description:
    'Lead AI Scientist at Poiro, leading Data Science & AI. Previously a Postdoctoral Research Fellow at NUS and a Prime Minister’s Research Fellow at IISc. Game theory, online learning, randomized algorithms, and reinforcement learning.',

  author: {
    name: 'Anand Krishna',
    /** Role line under the name on the homepage. */
    role: 'Lead AI Scientist',
    /** Current affiliation, shown next to the role. */
    affiliation: 'Poiro',
    // poiro.ai redirects here, so this is the canonical host.
    affiliationUrl: 'https://poiro.com',
    /** Shown after the affiliation in the hero. */
    location: 'Bengaluru, India',
    /** One sentence in the hero, under the name. */
    tagline:
      'I lead Data Science & AI at Poiro. My research is on game theory, online learning, and randomized algorithms — allocating things fairly, and learning well under adversarial conditions.',
    email: 'anandkrishna1995@live.com',
    /** Drop a square image at `src/assets/portrait.{jpg,png,webp}` to show it. */
    portraitAlt: 'Portrait of Anand Krishna',
  },

  /**
   * Research interests, listed in the homepage hero.
   * Taken from the previous site — reorder or edit freely.
   */
  interests: ['Game Theory', 'Online Learning', 'Randomized Algorithms', 'Reinforcement Learning'],

  /** BCP-47 language tag for `<html lang>` and RSS. */
  locale: 'en',

  /** Twitter/X handle without the @, for `twitter:creator`. Empty disables. */
  twitterHandle: 'anand95krish',

  /**
   * Cloudflare Web Analytics: cookieless, no consent banner required.
   *
   * TODO(anand): paste the token here after adding the site in the Cloudflare
   * dashboard (Analytics & Logs -> Web Analytics -> Add a site). Leaving it
   * empty simply omits the script, so the site works fine without it.
   */
  analytics: {
    cloudflareToken: '',
  },
} as const;

export type SocialLink = {
  label: string;
  href: string;
  /** Key into the icon set in `src/components/Icon.astro`. */
  icon: 'mail' | 'github' | 'x' | 'linkedin' | 'rss' | 'scholar' | 'dblp';
};

export const SOCIALS: SocialLink[] = [
  { label: 'Email', href: `mailto:anandkrishna1995@live.com`, icon: 'mail' },
  { label: 'GitHub', href: 'https://github.com/Krish95', icon: 'github' },
  { label: 'X', href: 'https://x.com/anand95krish', icon: 'x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anandkrishna95/', icon: 'linkedin' },
  { label: 'DBLP', href: 'https://dblp.org/search?q=Anand+Krishna', icon: 'dblp' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
];

export const NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Publications', href: '/publications' },
  { label: 'Writing', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'CV', href: '/cv' },
];
