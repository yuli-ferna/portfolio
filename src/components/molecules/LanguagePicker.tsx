import { useEffect, useState } from "react";
import { getTranslatedPath } from "../../i18n/utils";
import { navigate } from "astro:transitions/client";

const LanguagePicker = ({ lang }) => {

  const [currentLang, setCurrentLang] = useState('');
  const [pathname, setPathname] = useState('');
  useEffect(() => {
    setCurrentLang(lang);
    const nextLang = lang === 'es' ? 'en' : 'es';
    const value = getTranslatedPath(
      location.pathname.replace(`/${lang}`, '').replace(/^\/+/, ''),
      nextLang
    );
    setPathname(value);
  }, [lang]);

  return <a
    className="icon-button title text-xl"
    href={pathname}
    aria-label={currentLang === 'es' ? 'Cambiar idioma' : 'Change language'}
    data-astro-reload
  >
    {currentLang === 'es' ? 'EN' : 'ES'}
  </a>
};

export default LanguagePicker;