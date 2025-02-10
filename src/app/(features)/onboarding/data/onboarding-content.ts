// features/onboarding/data/onboarding-content.ts

import { Slide } from '../types/onboarding.types'
import { Timer, Lightbulb, Target, Flag, Circle, Tally1, Tally2, Tally3, Tally4 } from "lucide-react"

export const ONBOARDING_CONTENT: Slide[] = [
  {
    id: 'intro',
    type: 'media-text',
    title: "Why is this any different?",
    description: "Most programs teach you to manage back pain. We empower YOU to actually fix it and help keep it there- whether it's sciatica keeping you up at night or morning stiffness preventing you from getting out of bed.",
    imageUrl: "/derangement.png"
  },
  {
    id: 'teach',
    type: 'media-text',
    title: "Teach a man to fish, and he eats for a lifetime.",
    description: "Quick fixes explain why 40% of the population suffer from chronic low back pain. Research shows that lasting relief comes from understanding your pain and knowing how to address it. Our approach delivers both - helping you understand your unique pain patterns while giving you the exact tools needed to overcome them.",
    imageUrl: "/fish.png"
  },
  {
    id: 'features',
    type: 'feature-showcase',
    features: [
      {
        id: "personalized-exercise",
        title: "Personalized exercise",
        icon: Timer,
        content: "Personalized exercise progressions for diagnosing your specific problem",
        media: {
          type: "image",
          src: "/pronepressup.png"
        }
      },
      {
        id: "pain-mapping",
        title: "Pain Mapping",
        icon: Lightbulb,
        content: "Visual pain mapping to track the changes in your symptoms",
        media: {
          type: "image",
          src: "/afterbeforecalf.png"
        }
      },
      {
        id: "camera-analysis",
        title: "Camera Analysis",
        icon: Target,
        content: "Camera-based movement analysis to measure your progress",
        media: {
          type: "image",
          src: "/phone-outline.png"
        }
      },
      {
        id: "lesson-plans",
        title: "Lesson Plans",
        icon: Flag,
        content: "Step-by-step lessons to understand how to get your back better and keep it better",
        media: {
          type: "image",
          src: "/lesson-pic.png"
        }
      }
    ]
  },
  {
    id: 'options',
    type: 'option-card',
    title: "Before We Start",
    description: "How open minded are you to this approach for treating your back pain?",
    options: [
      {
        id: "0",
        title: "I am not interested in this",
        icon: Circle,
        color: "bg-gray-100 text-gray-700"
      },
      {
        id: "1",
        title: "I don't think this will work for me, I've done this kind of stuff before.",
        icon: Tally1,
        color: "bg-blue-100 text-blue-700"
      },
      {
        id: "2",
        title: "I want to try it out first and see if it's right for me.",
        icon: Tally2,
        color: "bg-purple-100 text-purple-700"
      },
      {
        id: "3",
        title: "I am interested and willing to try it out.",
        icon: Tally3,
        color: "bg-orange-100 text-orange-700"
      },
      {
        id: "4",
        title: "This sounds exciting and I'm ready to go!",
        icon: Tally4,
        color: "bg-gray-100 text-gray-700"
      }
    ]
  },
  {
    id: 'mindset',
    type: 'media-text',
    title: "Level of Open-mindedness",
    description: "In our experience, seeing a \"4\" is uncommon. Most people land in the \"2-3\" range, which makes perfect sense - you want to see if this really works. Some select \"1\" because while they've seen others succeed with similar approaches, past experiences make them doubtful for themselves. And if you chose \"0\"? That's completely okay. This might not be the right time for you to explore our approach.",
    imageUrl: "/open-mind.png"
  }
]