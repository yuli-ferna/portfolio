import { useEffect, useState } from "react";
import { getTranslatedPath } from "../../i18n/utils";

const CODES = ["es", "en"] as const;

/**
 * Segmented ES | EN switch. The current language is highlighted and the
 * other one links to the same page in that language.
 */
const LanguagePicker = ({ lang }: { lang: string }) => {
  const [pathname, setPathname] = useState("");
  const nextLang = lang === "es" ? "en" : "es";

  useEffect(() => {
    setPathname(
      getTranslatedPath(
        location.pathname.replace(`/${lang}`, "").replace(/^\/+/, ""),
        nextLang,
      ),
    );
  }, [lang]);

  return (
    <>
      {CODES.map((code) =>
        code === lang ? (
          <span key={code} className="lang-seg is-active" aria-current="true">
            {code.toUpperCase()}
          </span>
        ) : (
          <a
            key={code}
            className="lang-seg"
            href={pathname}
            hrefLang={code}
            aria-label={lang === "es" ? "Cambiar idioma" : "Change language"}
            data-astro-reload
          >
            {code.toUpperCase()}
          </a>
        ),
      )}
    </>
  );
};

export default LanguagePicker;
