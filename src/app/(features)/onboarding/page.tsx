// features/onboarding/page.tsx

'use client'

import { useOnboarding } from "./hooks/use-onboarding"
import { MediaTextPanel } from "./components/media-text-panel"
import { FeatureShowcase } from "./components/feature-showcase"
import { OptionCardStack } from "./components/option-card-stack"
import { AnimatePresence, motion } from "framer-motion"



export default function OnboardingPage() {
  const { 
    currentSlide,
    handleContinue,
    handleOptionSelect,
    selectedOptionId 
  } = useOnboarding()

  return (
    <AnimatePresence mode="wait">
      {currentSlide.type === 'media-text' && (
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <MediaTextPanel
            title={currentSlide.title}
            description={currentSlide.description}
            imageUrl={currentSlide.imageUrl}
            onContinue={handleContinue}
          />
        </motion.div>
      )}

      {currentSlide.type === 'feature-showcase' && (
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <FeatureShowcase
            features={currentSlide.features}
            onContinue={handleContinue}
          />
        </motion.div>
      )}

      {currentSlide.type === 'option-card' && (
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <OptionCardStack
            title={currentSlide.title}
            description={currentSlide.description}
            options={currentSlide.options}
            selectedId={selectedOptionId}
            onSelect={handleOptionSelect}
            onContinue={handleContinue}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}