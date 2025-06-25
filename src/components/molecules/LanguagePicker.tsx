import { useEffect, useState } from "react";
import { getLangFromUrl, getTranslatedPath } from "../../i18n/utils";

const LanguagePicker = () => {
  const [currentLang, setCurrentLang] = useState('');
  const [pathname, setPathname] = useState('');
  useEffect(() => {
    setCurrentLang(getLangFromUrl(new URL(location.href)));
    setPathname(location.pathname);
  }
  , []);

  const func = () => {
    const lang = currentLang === 'es' ? 'en' : 'es';
    const value = getTranslatedPath(
      pathname.replace(`/${currentLang}`, '').replace(/^\/+/, ''),
      lang
    );
    location.pathname = value;
  }

  return <button
    className="icon-button"
    onClick={func}
    aria-label={currentLang === 'es' ? 'Cambiar idioma' : 'Change language'}
  >
    {currentLang === 'es' ? 'EN' : 'ES'}
  </button>
};

export default LanguagePicker;