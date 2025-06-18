import { useMemo } from "react";
import { motion } from "motion/react";
const SkillElem = ({ skill }: { skill: string }) => {
  const icon = useMemo(() => (skill.toLowerCase().replace(/\s+/g, "-")), [skill]);
  return (
    <motion.div 
      className="skill-elem flex flex-1/3 md:flex-1/4 items-start justify-start gap-3"
      whileHover={{ x: 15, scale: 1.2, textShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)" }}
      whileTap={{ x: 5, scale: 0.9, textShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport= {{
        amount: 0.01,
      }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
      >
      <div><img className="w-6 h-6" src={`./${icon}.svg`} /></div>
      <div className="text-pink-200 text-start w-min min-w-20 whitespace-nowrap">{skill}</div>
    </motion.div>
  );
};

export default SkillElem;