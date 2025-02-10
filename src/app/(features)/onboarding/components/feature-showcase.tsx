// features/onboarding/components/feature-showcase.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContinueButton } from "./continue-button";
import Image from 'next/image'
import type { FeatureShowcase as FeatureShowcaseType } from '../types/onboarding.types';

// Add onContinue to props
interface FeatureShowcaseProps extends Omit<FeatureShowcaseType, 'id' | 'type'> {
 onContinue: () => void;
}

export function FeatureShowcase({ features, onContinue }: FeatureShowcaseProps) {
 const [selectedFeature, setSelectedFeature] = useState(features[0]);

 // Shared button styles
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

 // Replace the entire featureAnimations object with a MediaContent component
 const MediaContent = () => {
   const { media } = selectedFeature;
   
   return (
     <div className="w-full flex items-center justify-center">
       {media.type === 'video' ? (
         <video 
           src={media.src}
           autoPlay
           loop
           muted
           playsInline
           className="w-full h-auto max-h-[500px] object-contain rounded-xl"
         />
       ) : (
         <Image 
           src={media.src}
           alt={selectedFeature.title}
           width={800}
           height={500}
           className="w-full h-auto max-h-[500px] object-contain rounded-xl"
         />
       )}
     </div>
   );
 };

 // Update FeatureAnimationContainer to use MediaContent
 const FeatureAnimationContainer = ({ className = "" }: { className?: string }) => (
   <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 ${className}`}>
     <AnimatedContent featureId={selectedFeature.id}>
       <div className="w-full h-full flex items-center justify-center">
         <MediaContent />
       </div>
     </AnimatedContent>
   </div>
 );

 // Shared feature content
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

 // Feature navigation buttons
 const FeatureButtons = ({ isMobile = false }) => (
   <>
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
   </>
 );

 return (
   <motion.div
     initial={{ opacity: 0, x: 50 }}
     animate={{ opacity: 1, x: 0 }}
     exit={{ opacity: 0, x: -50 }}
     className="flex flex-col gap-8 min-h-[600px] px-4 lg:px-0"
   >
     {/* Mobile/Tablet Layout */}
     <div className="block lg:hidden space-y-8">
       <FeatureAnimationContainer />
       <FeatureContent />
       <div className="flex flex-col gap-4">
         <div className="flex items-center justify-center gap-2">
           <FeatureButtons isMobile />
         </div>
         <ContinueButton onClick={onContinue} />
       </div>
     </div>

     {/* Desktop Layout */}
     <div className="hidden lg:grid lg:grid-cols-12 gap-8">
       <div className="lg:col-span-3 flex lg:flex-col gap-4">
         <FeatureButtons />
         <ContinueButton onClick={onContinue} />
       </div>
       <FeatureAnimationContainer className="lg:col-span-5" />
       <div className="lg:col-span-4 mt-24">
         <FeatureContent />
       </div>
     </div>
   </motion.div>
 );
}

// Shared content wrapper for animations
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