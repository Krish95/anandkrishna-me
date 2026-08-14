import type { ElementContent } from 'hast';
import type { ShikiTransformer } from 'shiki';

/**
 * Adds two fence-meta features Astro's built-in Shiki doesn't handle:
 *
 *   ```ts title="src/thing.ts"   -> filename header above the block
 *   ```ts showLineNumbers        -> gutter line numbers (CSS counters)
 *
 * Both are Expressive Code features; this reimplements just those two rather
 * than pulling in another integration.
 *
 * A titled block becomes:
 *   <figure class="code-figure">
 *     <figcaption>src/thing.ts</figcaption>
 *     <pre class="astro-code …">…</pre>
 *   </figure>
 */
export function transformerCodeTitle(): ShikiTransformer {
  return {
    name: 'code-title',

    pre(node) {
      const raw = this.options.meta?.__raw;
      if (typeof raw !== 'string' || !/\bshowLineNumbers\b/.test(raw)) return;
      // Numbering itself is done with a CSS counter — see global.css.
      const existing = typeof node.properties.class === 'string' ? node.properties.class : '';
      node.properties.class = `${existing} line-numbers`.trim();
    },

    root(node) {
      // `__raw` is everything after the language on the fence line.
      const raw = this.options.meta?.__raw;
      if (typeof raw !== 'string') return;

      const title = raw.match(/title="([^"]+)"/)?.[1] ?? raw.match(/title='([^']+)'/)?.[1];
      if (!title) return;

      // A hast root can technically hold a doctype, which isn't valid inside an
      // element — narrow to the node kinds a <figure> can actually contain.
      const blocks = node.children.filter(
        (child): child is ElementContent =>
          child.type === 'element' || child.type === 'text' || child.type === 'comment',
      );

      node.children = [
        {
          type: 'element',
          tagName: 'figure',
          properties: { class: 'code-figure' },
          children: [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { class: 'code-figure__title' },
              children: [{ type: 'text', value: title }],
            },
            // The original <pre> (and nothing else) follows the caption.
            ...blocks,
          ],
        },
      ];
    },
  };
}
