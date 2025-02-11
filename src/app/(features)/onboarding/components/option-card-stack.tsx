// features/onboarding/components/option-card-stack.tsx

"use client";

import { motion } from "framer-motion";
import { cn } from '@/components/ui/utils';
import { ContinueButton } from '@/app/(features)/shared/components/continue-button';
import type { OptionCard } from '../types/onboarding.types';

interface OptionCardStackProps extends Omit<OptionCard, 'id' | 'type'> {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
}

export function OptionCardStack({ 
  title,
  description,
  options,
  selectedId,
  onSelect,
  onContinue 
}: OptionCardStackProps) {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="grid gap-2 max-w-2xl mx-auto">
        {options.map((option) => (
          <motion.button
            key={option.id}
            className={cn(
              "flex items-center space-x-4 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]",
              option.color,
              selectedId === option.id ? "ring-2 ring-black dark:ring-white" : ""
            )}
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: options.indexOf(option) * 0.1 }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/90">
              {<option.icon className="h-6 w-6" />}
            </div>
            <span className="text-lg font-medium text-left">{option.title}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-4">
        <ContinueButton
          onClick={onContinue}
          className={cn(
            "w-1/2 transition-opacity duration-200",
            !selectedId && "opacity-50 cursor-not-allowed"
          )}
          disabled={!selectedId}
        />
      </div>
    </motion.div>
  );
}