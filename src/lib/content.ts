import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;
export type Note = CollectionEntry<'notes'>;
export type Publication = CollectionEntry<'publications'>;

/** Drafts stay visible while you're writing locally, never in production. */
const isVisible = (entry: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !entry.data.draft : true;

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', isVisible);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Featured posts for the homepage, newest first. */
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getPosts();
  const featured = posts.filter((p) => p.data.featured);
  // Fall back to the most recent posts so the homepage is never empty.
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}

/** Projects: explicit `order` first, then newest year. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', isVisible);
  return projects.sort(
    (a, b) => a.data.order - b.data.order || b.data.year.localeCompare(a.data.year),
  );
}

/** Newest note first. */
export async function getNotes(limit?: number): Promise<Note[]> {
  const notes = await getCollection('notes');
  const sorted = notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

/** All publications, newest first. */
export async function getPublications(): Promise<Publication[]> {
  const pubs = await getCollection('publications', isVisible);
  return pubs.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Featured papers for the homepage, newest first; falls back to the latest. */
export async function getFeaturedPublications(limit = 4): Promise<Publication[]> {
  const pubs = await getPublications();
  const featured = pubs.filter((p) => p.data.featured);
  return (featured.length > 0 ? featured : pubs).slice(0, limit);
}

/** Publications bucketed by year, newest year first. */
export function publicationsByYear(pubs: Publication[]): [number, Publication[]][] {
  const years = new Map<number, Publication[]>();
  for (const pub of pubs) {
    const year = pub.data.date.getUTCFullYear();
    const bucket = years.get(year);
    if (bucket) bucket.push(pub);
    else years.set(year, [pub]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}

/** Tag slug used in URLs. Keeps `/tags/ai-tooling` stable if the label changes case. */
export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export type TagCount = { tag: string; slug: string; count: number };

/** Every tag in use, most-used first, then alphabetical. */
export async function getTags(): Promise<TagCount[]> {
  const posts = await getPosts();
  const counts = new Map<string, TagCount>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const existing = counts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(slug, { tag, slug, count: 1 });
      }
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Previous/next within the chronological run, for post footers.
 * `next` is the newer post — the direction a reader moves forward in.
 */
export function neighbours(posts: Post[], id: string) {
  const i = posts.findIndex((p) => p.id === id);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    // posts[] is newest-first, so the newer neighbour sits at a lower index.
    next: i > 0 ? posts[i - 1] : undefined,
    prev: i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}
