import { motion } from "motion/react";

const SkillsIcon = () => {
  return (
    <motion.svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileInView={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <g filter="url(#filter0_d_skills)">
        <rect x="5" y="8" width="14" height="14" fill="#82DA75" rx="2" />
        <rect x="31" y="8" width="14" height="14" fill="#82DA75" rx="2" />
        <rect x="5" y="28" width="14" height="14" fill="#82DA75" rx="2" />
        <rect x="31" y="28" width="14" height="14" fill="#82DA75" rx="2" />

        <path
          d="M9 13H17V21H9V13Z"
          fill="#EFB8C8"
          opacity="0.6"
        />
        <path
          d="M35 13H43V21H35V13Z"
          fill="#EFB8C8"
          opacity="0.6"
        />
        <path
          d="M9 33H17V41H9V33Z"
          fill="#EFB8C8"
          opacity="0.6"
        />
        <path
          d="M35 33H43V41H35V33Z"
          fill="#EFB8C8"
          opacity="0.6"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_skills"
          x="0"
          y="0"
          width="50"
          height="50"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.94 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </motion.svg>
  );
};

export default SkillsIcon;
