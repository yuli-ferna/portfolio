import { motion } from "motion/react";

const ContactIcon = () => {
  return (
    <motion.svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileInView={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <g filter="url(#filter0_d_contact)">
        <path
          d="M10 8H40C41.1 8 42 8.9 42 10V40C42 41.1 41.1 42 40 42H10C8.9 42 8 41.1 8 40V10C8 8.9 8.9 8 10 8Z"
          fill="#82DA75"
        />
        <path
          d="M10 10H40V16L25 24L10 16V10Z"
          fill="#EFB8C8"
        />
        <path
          d="M10 16L25 26L40 16V40H10V16Z"
          fill="#82DA75"
          opacity="0.5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_contact"
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

export default ContactIcon;
