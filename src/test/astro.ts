import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getContainerRenderer } from '@astrojs/react';
import { loadRenderers } from 'astro:container';
import { Window } from 'happy-dom';

let containerPromise: Promise<AstroContainer> | undefined;

/** One shared Astro container with the React renderer registered. */
export function getContainer() {
  containerPromise ??= loadRenderers([getContainerRenderer()]).then((renderers) =>
    AstroContainer.create({ renderers }),
  );
  return containerPromise;
}

type RenderOptions = {
  lang?: 'en' | 'es';
  path?: string;
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
};

/** Renders an .astro component to HTML for the given locale. */
export async function renderAstro(Component: any, { lang = 'en', path, props, slots }: RenderOptions = {}) {
  const container = await getContainer();
  const url = `https://yuli-ferna.vercel.app${path ?? (lang === 'es' ? '/es/' : '/')}`;
  return container.renderToString(Component, { props, slots, request: new Request(url) });
}

/** Renders an .astro component and parses it into a queryable Document. */
export async function renderAstroDom(Component: any, options: RenderOptions = {}) {
  const html = await renderAstro(Component, options);
  const window = new Window();
  const doc = new window.DOMParser().parseFromString(
    /<html[\s>]/i.test(html) ? html : `<!doctype html><html><body>${html}</body></html>`,
    'text/html',
  );
  return { html, doc: doc as unknown as Document };
}

/** Parsed `props` of every astro-island (hydrated React component) in the document. */
export function islands(doc: Document) {
  return Array.from(doc.querySelectorAll('astro-island')).map((el) => ({
    el,
    client: el.getAttribute('client'),
    url: el.getAttribute('component-url') ?? '',
    export: el.getAttribute('component-export'),
    opts: JSON.parse(el.getAttribute('opts') ?? '{}'),
  }));
}
