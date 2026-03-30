import { defaultLang, fetchTranslations, localLang } from './ui';

export let ui;
ui = await fetchTranslations();

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

export function replaceVariableField(translation: string, fieldsVar, variable) {
	for (let ii = 0; ii < fieldsVar.length; ii++) {
		const key = fieldsVar[ii];
		console.log("key", key, variable[key], translation)
		translation = translation?.replaceAll(`{${key}}`, `${variable[key]}`)

	}
	return translation;
}

export function useTranslations(lang) {
	return function t(key, variable = {}) {
		let UI = ui;
		const fieldsVar = Object.keys(variable);
		if(!variable) return UI[lang][key] || UI[defaultLang][key];
		if (UI === undefined) {
			const localUi = localLang();
			let translation = localUi[lang][key] || localUi[defaultLang][key];
			console.log("localUi")
			if (typeof translation === "string") {
				translation = replaceVariableField(translation, fieldsVar, variable);
			}
			return translation;
		}
		let translation = ui[lang][key] || ui[defaultLang][key];

		translation = replaceVariableField(translation, fieldsVar, variable);
		return translation;
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
