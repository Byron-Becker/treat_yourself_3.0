// features/onboarding/components/media-text-panel.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ContinueButton } from "@/app/(features)/shared/components/continue-button";

interface MediaTextPanelProps {
  title: string;
  description: string;
  imageUrl: string;
  onContinue: () => void;
}

export function MediaTextPanel({ title, description, imageUrl, onContinue }: MediaTextPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col md:grid md:grid-cols-2 gap-8 md:items-center"
    >
      <div className="order-1 md:order-none relative aspect-[4/3] w-full">
        <Image
          src={imageUrl}
          alt="Illustration"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-2xl object-contain"
          priority
        />
      </div>

      <div className="order-2 md:order-none space-y-6 text-center md:text-left flex flex-col">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
          {title}
        </h1>
        <p className="mx-auto max-w-[500px] text-gray-500 text-center md:text-center lg:text-xl lg:text-center xl:text-center dark:text-gray-400">
          {description}
        </p>
        <div className="order-3 md:order-none">
          <ContinueButton onClick={onContinue} />
        </div>
      </div>
    </motion.div>
  );
}