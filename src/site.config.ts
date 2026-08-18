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
    'Lead AI Scientist at Poiro, working on generative AI and agentic systems for creative production. Research background in game theory and online learning.',

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
    /** The paragraph under the name on the homepage. */
    tagline:
      'I lead AI/ML at Poiro, working on generative AI and agentic systems for creative production. My research background is in game theory, online learning, and randomized algorithms, where I studied decision-making and learning under uncertainty. My current focus is on building reliable AI systems that can reason, use tools, and carry out creative workflows within real-world production systems.',
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
   * Cloudflare Web Analytics: cookieless, so no consent banner is required.
   *
   * This is a public, write-only site identifier — it ships in the HTML to every
   * visitor by design, so there is nothing here to keep secret.
   *
   * The token is needed even though the zone is proxied: Cloudflare's automatic
   * injection rewrites HTML as it passes from an origin through the proxy, and
   * Pages responses never make that hop. Selecting auto-inject in the dashboard
   * appears to work but injects nothing. Emptying this string disables analytics.
   */
  analytics: {
    cloudflareToken: '2331ed53331b48f093d3ddcbb61628da',
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

/**
 * `/projects` is deliberately absent: it builds and works, but holds only the
 * note about this site. Add it back here once there's work worth listing.
 */
export const NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Publications', href: '/publications' },
  { label: 'Writing', href: '/blog' },
  { label: 'CV', href: '/cv' },
];
