// features/onboarding/components/feature-showcase.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContinueButton } from "@/app/(features)/shared/components/continue-button";
import Image from 'next/image'
import type { FeatureShowcase as FeatureShowcaseType } from '../types/onboarding.types';

interface FeatureShowcaseProps extends Omit<FeatureShowcaseType, 'id' | 'type'> {
  onContinue: () => void;
}

export function FeatureShowcase({ features, onContinue }: FeatureShowcaseProps) {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  const getButtonStyles = (isSelected: boolean, isMobile = false) => `
    ${isMobile ? 'flex items-center gap-2' : 'w-full p-4'}
    rounded-xl 
    transition-all 
    ${isSelected
      ? "bg-black text-white dark:bg-white dark:text-black"
      : "hover:bg-gray-100 dark:hover:bg-gray-800"
    }
    ${isMobile ? 'p-3' : ''}
  `;

  const MediaContent = () => {
    const { media } = selectedFeature;
    
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        {media.type === 'video' ? (
          <video 
            src={media.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <Image 
            src={media.src}
            alt={selectedFeature.title}
            width={800}
            height={500}
            className="w-full h-full object-contain rounded-xl"
          />
        )}
      </div>
    );
  };

  const FeatureAnimationContainer = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 h-[400px] ${className}`}>
      <AnimatedContent featureId={selectedFeature.id}>
        <div className="w-full h-full flex items-center justify-center">
          <MediaContent />
        </div>
      </AnimatedContent>
    </div>
  );

  const FeatureContent = () => (
    <AnimatedContent featureId={selectedFeature.id}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{selectedFeature.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {selectedFeature.content}
        </p>
      </div>
    </AnimatedContent>
  );

  const FeatureButtons = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'flex justify-center gap-2' : 'space-y-2'}`}>
      {features.map((feature) => {
        const Icon = feature.icon;
        const isSelected = selectedFeature.id === feature.id;
        
        return (
          <button
            key={feature.id}
            onClick={() => setSelectedFeature(feature)}
            className={getButtonStyles(isSelected, isMobile)}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6" />
              {isMobile ? (
                <AnimatePresence mode="wait">
                  {isSelected && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {feature.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              ) : (
                <span className="font-medium">{feature.title}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen w-full flex items-center justify-center px-4 lg:px-0"
    >
      {/* Mobile/Tablet Layout */}
      <div className="block lg:hidden w-full space-y-8 pb-32">
        <FeatureAnimationContainer />
        <FeatureContent />
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 space-y-4">
          <FeatureButtons isMobile />
          <ContinueButton onClick={onContinue} />
          
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-3 relative h-[500px]">
          <div className="sticky top-1/2 -translate-y-1/2 space-y-4">
            <FeatureButtons />
            <div className="absolute bottom-0 w-full">
              <ContinueButton onClick={onContinue} />
            </div>
          </div>
        </div>
        <FeatureAnimationContainer className="lg:col-span-5" />
        <div className="lg:col-span-4 h-[500px] flex items-center">
          <FeatureContent />
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedContent({ children, featureId }: { children: React.ReactNode; featureId: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={featureId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}