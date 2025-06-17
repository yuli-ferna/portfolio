import { useEffect } from "react";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import Education from "../atoms/icons/Education";
import Home from "../atoms/icons/Home";
import Send from "../atoms/icons/Send";
import Skill from "../atoms/icons/Skill";
import Experience from "../atoms/icons/Work";

const Navbar = () => {

  const items = [
    { component: <Home />, section: "home", onView: false },
    { component: <Skill />, section: "skills", onView: false },
    { component: <Experience />, section: "experience", onView: false },
    { component: <Education />, section: "education", onView: false },
    { component: <Send />, section: "contact", onView: false },
  ];
  const onClick = (section: string) => {
    console.log(`Navigating to ${section}`);

    const buttons = document.getElementsByClassName(`navbar-item`);
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      button && button.classList.remove('active');
    }
    window.scrollTo({
      top: document.getElementById(section)?.offsetTop || 0
    });
  }
  useEffect(() => {
    const lang = getLangFromUrl(new URL(location.href));
    const t = useTranslations(lang);
    
  }, []);
  return (
    <nav id="main-nav" className="navbar">
      {items.map((item, index) => (
        <a key={`${item.section}-${index}`} className={`${item.section} navbar-item ${index == 0 ? 'active' : ''}`} onClick={() => {
          onClick(item.section);
        }}>
          {item.component}
        </a>
      ))}
    </nav>
  );
}
export default Navbar;

