// features/onboarding/components/continue-button.tsx

"use client";

import { motion } from "framer-motion";

interface ContinueButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  text?: string;
}

export function ContinueButton({ onClick, className, disabled, text = "Continue" }: ContinueButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex justify-center w-full"
    >
      <button 
        onClick={onClick}
        className={`w-full max-w-md rounded-full bg-black py-4 text-lg font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 ${className}`}
        disabled={disabled}
      >
        {text}
      </button>
    </motion.div>
  );
}