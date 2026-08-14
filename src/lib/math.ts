import katex from 'katex';

/**
 * Inline maths for plain-text fields.
 *
 * Frontmatter strings — paper titles, one-line summaries, news items — are never
 * run through the markdown pipeline, so `$p$-Mean Regret` would otherwise render
 * with the dollar signs showing. These two helpers cover the two things you want
 * to do with such a string: display it, or flatten it.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]!);

/**
 * Splits on `$…$` spans, renders those with KaTeX, and HTML-escapes everything
 * around them. Returns HTML — use it with `set:html`.
 *
 * A lone or unmatched `$` is left as literal text, so prices and shell prompts
 * don't silently turn into maths.
 */
export function mathToHtml(text: string): string {
  // Non-greedy so adjacent spans don't merge; `\$` escapes a literal dollar.
  const pattern = /\$((?:[^$\\]|\\.)+)\$/g;
  let out = '';
  let last = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    out += escapeHtml(text.slice(last, start));
    try {
      out += katex.renderToString(match[1]!, {
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
        displayMode: false,
      });
    } catch {
      // Malformed maths falls back to the literal source rather than breaking.
      out += escapeHtml(match[0]);
    }
    last = start + match[0].length;
  }

  out += escapeHtml(text.slice(last));
  return out;
}

/**
 * Drops maths delimiters and backslash commands to leave readable plain text.
 *
 * For places that can't take markup at all: `<title>`, meta descriptions, and
 * the Satori-rendered social cards.
 */
export function stripMath(text: string): string {
  return text
    .replace(/\$((?:[^$\\]|\\.)+)\$/g, (_, tex: string) =>
      tex
        // \mathrm{NSW} -> NSW
        .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1')
        // Remaining commands and braces are noise in a plain-text context.
        .replace(/\\[a-zA-Z]+\s?/g, '')
        .replace(/[{}]/g, ''),
    )
    .replace(/\\\$/g, '$');
}
