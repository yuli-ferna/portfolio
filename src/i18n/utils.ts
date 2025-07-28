import { defaultLang, fetchTranslations, localLang } from './ui';

export let ui;
ui = await fetchTranslations();

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang) {
  return function t(key) {
		let UI = ui;
		if (UI === undefined) {
			const localUi = localLang();
			return localUi[lang][key] || localUi[defaultLang][key];
		}
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
