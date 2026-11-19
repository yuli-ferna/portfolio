import { afterEach, describe, expect, it, vi } from 'vitest';
import en from './en.json';
import es from './es.json';
import localAssets from './assets.json';
import { defaultLang, fetchAssets, fetchTranslations, languages, localLang } from './ui';

const BASE = 'https://raw.githubusercontent.com/yuli-ferna/portfolio-assets/refs/heads/main';

const okResponse = (body: unknown) =>
  ({ ok: true, status: 200, json: () => Promise.resolve(body) }) as Response;
const errorResponse = (status = 500) =>
  ({ ok: false, status, json: () => Promise.resolve({}) }) as Response;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('constants', () => {
  it('exposes both supported languages with their labels', () => {
    expect(languages).toEqual({ en: 'EN', es: 'ES' });
  });

  it('uses English as the default language', () => {
    expect(defaultLang).toBe('en');
  });

  it('localLang returns the bundled JSON for each locale', () => {
    const local = localLang();
    expect(local.en).toBe(en);
    expect(local.es).toBe(es);
  });
});

describe('fetchTranslations', () => {
  it('returns the local JSON without hitting the network in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchTranslations()).resolves.toEqual({ en, es });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches every locale from the remote assets repo', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const remoteEn = { hello: 'remote en' };
    const remoteEs = { hello: 'remote es' };
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve(okResponse(url.endsWith('/en.json') ? remoteEn : remoteEs)),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchTranslations()).resolves.toEqual({ en: remoteEn, es: remoteEs });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/locale/en.json`);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/locale/es.json`);
  });

  it('falls back per language when one locale responds with an HTTP error', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const remoteEn = { hello: 'remote en' };
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve(url.endsWith('/en.json') ? okResponse(remoteEn) : errorResponse(404)),
      ),
    );

    const result = await fetchTranslations();
    expect(result.en).toEqual(remoteEn);
    expect(result.es).toBe(es);
  });

  it('falls back to the English bundle when only English fails', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const remoteEs = { hello: 'remote es' };
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        url.endsWith('/en.json') ? Promise.reject(new Error('offline')) : Promise.resolve(okResponse(remoteEs)),
      ),
    );

    const result = await fetchTranslations();
    expect(result.en).toBe(en);
    expect(result.es).toEqual(remoteEs);
  });

  it('falls back to the local bundles when the network is down', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));

    await expect(fetchTranslations()).resolves.toEqual({ en, es });
  });

  it('falls back when the response body is not valid JSON', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.reject(new SyntaxError('bad json')) }),
      ),
    );

    await expect(fetchTranslations()).resolves.toEqual({ en, es });
  });
});

describe('fetchAssets', () => {
  it('returns the local assets in development without fetching', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchAssets()).resolves.toBe(localAssets);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the remote assets manifest when available', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const remote = { skills: { react: 'https://cdn/react.svg' } };
    const fetchMock = vi.fn(() => Promise.resolve(okResponse(remote)));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchAssets()).resolves.toEqual(remote);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/assets.json`);
  });

  it('falls back to local assets on an HTTP error', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(errorResponse(503))));

    await expect(fetchAssets()).resolves.toBe(localAssets);
  });

  it('falls back to local assets on a network error', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));

    await expect(fetchAssets()).resolves.toBe(localAssets);
  });
});
