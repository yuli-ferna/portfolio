import { useMemo } from "react";
import { motion } from "motion/react";
import { useAssets } from "../../i18n/utils";

const SkillElem = ({ skill, soft }: { skill: string; soft: boolean }) => {
  const a = useAssets();

  const iconSrc = useMemo(() => {
    if (soft) return "/checkbox.svg";
    const resolved = a.skill(skill);
    // If the resolved path looks like a full URL, use it directly;
    // otherwise prefix with "/" for local public assets.
    return resolved.startsWith('http') ? resolved : `/${resolved}`;
  }, [skill, soft]);

  const fallbackSrc = "/checkbox.svg";

  return (
    <motion.div
      className="skill-elem flex flex-1/3 md:flex-1/4 items-start justify-start gap-3"
      whileHover={{ x: 15, scale: 1.2, textShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)", transition: { duration: 0.2 } }}
      whileTap={{ x: 5, scale: 0.9, textShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)", transition: { duration: 0.2 } }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.01 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 2, type: "spring", bounce: 0.2 }}
    >
      <div className="w-[27px] h-[27px]">
        <img
          id={`img-${skill}`}
          className="w-full h-full"
          src={iconSrc}
          alt={skill}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== window.location.origin + fallbackSrc) {
              img.src = fallbackSrc;
            }
          }}
        />
      </div>
      <div className="text-pink-200 text-start w-min min-w-20 whitespace-nowrap">
        {skill}
      </div>
    </motion.div>
  );
};

export default SkillElem;
