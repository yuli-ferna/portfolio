import { motion } from "motion/react";

const HomeIcon = () => {
  return (
    <motion.svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileInView={{ y: [0, -5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <g filter="url(#filter0_d_home)">
        <path
          d="M25 5L7 18V40C7 41.1 7.9 42 9 42H41C42.1 42 43 41.1 43 40V18L25 5Z"
          fill="#82DA75"
        />
        <path
          d="M25 8L38 18.5V40H12V18.5L25 8Z"
          fill="#EFB8C8"
          opacity="0.7"
        />
        <rect x="18" y="25" width="14" height="15" fill="#82DA75" opacity="0.5" />
      </g>
      <defs>
        <filter
          id="filter0_d_home"
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

export default HomeIcon;
