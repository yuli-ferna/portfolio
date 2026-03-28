import { motion } from "motion/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const LoadingSpinner = ({
  size = "md",
  color = "var(--color-primary)",
}: LoadingSpinnerProps) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-flex ${sizeMap[size]}`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.2"
        />
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="31.4 125.6"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [-125.6, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
};

export default LoadingSpinner;
