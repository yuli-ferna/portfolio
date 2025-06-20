import { motion } from "motion/react";

const Experience = () => {
  return <motion.svg
      width="61"
      height="26"
      viewBox="0 0 61 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileInView={{ y: [10, 0, 10]}}
      transition={{ repeat: Infinity}}
    >
      <g filter="url(#filter0_d_78_956)">
        <mask id="path-1-inside-1_78_956" fill="white">
          <path d="M15 8H23V15H15V24H8V15H0V8H8V0H15V8Z"></path>
        </mask>
        <path d="M15 8H23V15H15V24H8V15H0V8H8V0H15V8Z" fill="#82DA75"></path>
        <path
          d="M15 8H14V9H15V8ZM23 8H24V7H23V8ZM23 15V16H24V15H23ZM15 15V14H14V15H15ZM15 24V25H16V24H15ZM8 24H7V25H8V24ZM8 15H9V14H8V15ZM0 15H-1V16H0V15ZM0 8V7H-1V8H0ZM8 8V9H9V8H8ZM8 0V-1H7V0H8ZM15 0H16V-1H15V0ZM15 8V9H23V8V7H15V8ZM23 8H22V15H23H24V8H23ZM23 15V14H15V15V16H23V15ZM15 15H14V24H15H16V15H15ZM15 24V23H8V24V25H15V24ZM8 24H9V15H8H7V24H8ZM8 15V14H0V15V16H8V15ZM0 15H1V8H0H-1V15H0ZM0 8V9H8V8V7H0V8ZM8 8H9V0H8H7V8H8ZM8 0V1H15V0V-1H8V0ZM15 0H14V8H15H16V0H15Z"
          fill="#EFB8C8"
          mask="url(#path-1-inside-1_78_956)"></path>
        <mask id="path-3-inside-2_78_956" fill="white">
          <path d="M49 8H57V15H49V24H42V15H34V8H42V0H49V8Z"></path>
        </mask>
        <path d="M49 8H57V15H49V24H42V15H34V8H42V0H49V8Z" fill="#82DA75"></path>
        <path
          d="M49 8H48V9H49V8ZM57 8H58V7H57V8ZM57 15V16H58V15H57ZM49 15V14H48V15H49ZM49 24V25H50V24H49ZM42 24H41V25H42V24ZM42 15H43V14H42V15ZM34 15H33V16H34V15ZM34 8V7H33V8H34ZM42 8V9H43V8H42ZM42 0V-1H41V0H42ZM49 0H50V-1H49V0ZM49 8V9H57V8V7H49V8ZM57 8H56V15H57H58V8H57ZM57 15V14H49V15V16H57V15ZM49 15H48V24H49H50V15H49ZM49 24V23H42V24V25H49V24ZM42 24H43V15H42H41V24H42ZM42 15V14H34V15V16H42V15ZM34 15H35V8H34H33V15H34ZM34 8V9H42V8V7H34V8ZM42 8H43V0H42H41V8H42ZM42 0V1H49V0V-1H42V0ZM49 0H48V8H49H50V0H49Z"
          fill="#EFB8C8"
          mask="url(#path-3-inside-2_78_956)"></path>
      </g>
      <defs>
        <filter
          id="filter0_d_78_956"
          x="0"
          y="0"
          width="61"
          height="26"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"></feColorMatrix>
          <feOffset dx="4" dy="2"></feOffset>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.94 0"></feColorMatrix>
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_78_956"></feBlend>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_78_956"
            result="shape"></feBlend>
        </filter>
      </defs>
    </motion.svg>
}

export default Experience;