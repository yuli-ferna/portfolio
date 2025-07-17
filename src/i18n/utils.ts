import { defaultLang, fetchTranslations } from './ui';

const ui = await fetchTranslations();

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getTranslatedPath(path: string, lang: string) {
	const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path

	if (pathWithoutLeadingSlash === '') {
		if (lang === defaultLang) return '/'
		return `/${lang}/`
	}

	if (lang === defaultLang) return `/${pathWithoutLeadingSlash}`
	return `/${lang}/${pathWithoutLeadingSlash}`
}
