
import * as motion from "motion/react-client"
import { useRef } from "react"
import SkillContainer from "./SkillContainer";
import { useTranslations } from "../../i18n/utils";

export default function DragConstraints({ lang }) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations(lang)
  const skillsList = t("skills")["skillsList"];
  const positions = [
    "md:top-5 md:left-100",
    "md:top-90 md:left-5",
    "md:top-110 md:left-90",
    "md:top-100 md:left-175",
  ]
  return (
    <motion.div ref={constraintsRef} className="w-fit h-fit md:w-screen md:h-screen flex flex-row flex-wrap justify-center gap-5 
      md:block
    relative">

      <div className="flex flex-col items-center justify-center gap-4 pt-10 pb-10
      md:justify-start md:gap-8 w-80 md:ml-20 md:mt-20
      ">
        <h1 className="title">{t("skills")["title"]}</h1>
        <p>
          {t("skills")["description"]}
        </p>
      </div>

      {Object.keys(skillsList).map((skill, index) => {
        const skillData = skillsList[skill];
        return <SkillContainer title={skill} skills={skillData} constraintsRef={constraintsRef} position={positions[index]} />
      })}
    </motion.div>
  )
}
