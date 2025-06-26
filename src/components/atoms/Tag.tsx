import { motion } from "motion/react";
const Tag = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{
        boxShadow: "none"
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "2px 3px var(--color-bg-default)"
      }}
      whileTap={{
        scale: 0.9,
        boxShadow: "none"
      }}
      className={`flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2.5 py-1 rounded-[50px] bg-container-primary border border-primary text-primary hover:bg-container-paper/10 dark:hover:bg-primary/50 hover:text-container-paper hover:border-container-paper  bg-mix-blend-plus-darker cursor-pointer ${className}`}
    >
      <p
        className={`flex-grow-0 flex-shrink-0 text-[13px] text-left`}
      >
        {text}
      </p>
    </motion.div>
  );
}
export default Tag;