import { Exercise, Question } from '../types'

export const exercises: Record<string, Exercise> = {
  '1': {
    id: '1',
    name: 'Lying Face Down',
    duration: 120, // 2 minutes
    imageUrl: '/prone-lying.png',
    mediaType: 'image',
    instructions: {
      setup: [
        'Find a comfortable spot on the floor or bed if unable to lie on floor',
        'Have your phone in front of you and accessible',
        'Ensure enough space to lie flat',
        'When you are in position and ready, press "Start Exercise" button below',
        'The exercise should be performed for 1-2 minutes'
      ],
      execution: [
        'Be mindful of how the pain is distributed',
        'Pain reducing, or disappearing is a good sign',
        'Pain moving out of the legs and towards the spine is a good sign'
      ],
      safety: [
        'Stop if pain increases in butt or legs',
        'Stop if symptoms move further down your legs',
      ]
    }
  },
  '2': {
    id: '2',
    name: "Lying Down on Elbows",
    duration: 120, // 2 minutes
    imageUrl: "/prone-on-elbows.png",
    mediaType: 'image',
    instructions: {
      setup: [
        "Start by lying face down",
        "Position elbows under shoulders",
        "Have your phone within reach",
        "When you are in position and ready, press 'Start Exercise' button below"       
      ],
      execution: [
        "Be mindful of how the pain is distributed",
        "Pain reducing, or disappearing is a good sign",
        "Pain moving out of the legs and towards the spine is a good sign"
      ],
      safety: [
        "Stop if pain increases in butt or legs",
        "Stop if symptoms move further into legs",
      ]
    }
  },
  '3': {
    id: '3',
    name: "Prone Press Up",
    duration: 120, // 2 minutes
    imageUrl: "/prone-press-up.mp4",
    mediaType: 'video',
    instructions: {
      setup: [
        'Start by lying face down, with hands by chest in a push up position', 
        'While pressing up, your back, hips and legs should remain relaxed', 
        'The goal is to let the back arch and curl up, while keeping the hips and legs relaxed',
        'When you are in position and ready, press "Start Exercise" button below',
        'Perform 10-15 repetitions'
      ],
      execution: [
        "Be mindful of how the pain is distributed",
        "Pain reducing, or disappearing is a good sign",
        "Pain moving out of the legs and towards the spine is a good sign"
      ],
      safety: [
        'Stop if pain increases',
        'Stop if symptoms move further into legs',
      ]
    }
  }
}

export const questions: Record<string, Question> = {
  'initial': {
    id: 'initial',
    text: 'Wait to answer this question until you notice a change in your symptoms. How are your symptoms responding?',
    options: [
      { 
        id: 'better', 
        text: 'Better',
        nextQuestionId: 'location'
      },
      { 
        id: 'worse', 
        text: 'Worse',
        nextQuestionId: 'stop'
      },
      { 
        id: 'same', 
        text: 'Same',
        nextQuestionId: 'location'
      }
    ]
  },
  'location': {
    id: 'location',
    text: 'Where is your pain located now?',
    options: [
      { 
        id: 'central', 
        text: 'More central/toward spine',
        nextQuestionId: 'continue'
      },
      { 
        id: 'peripheral', 
        text: 'More peripheral/toward legs',
        nextQuestionId: 'stop'
      },
      { 
        id: 'same', 
        text: 'Same location',
        nextQuestionId: 'continue'
      }
    ]
  },
  'continue': {
    id: 'continue',
    text: 'Would you like to continue with the exercise?',
    options: [
      { 
        id: 'yes', 
        text: 'Yes',
        nextQuestionId: null
      },
      { 
        id: 'no', 
        text: 'No',
        nextQuestionId: 'stop'
      }
    ]
  },
  'stop': {
    id: 'stop',
    text: 'We should stop this exercise.',
    options: [
      {
        id: "return_to_dashboard",
        text: "Return to Dashboard",
        nextQuestionId: null
      }
    ]
  },
  'completion': {
    id: 'completion',
    text: 'This is the last exercise in the series. When you are done with it, please return to the dashboard.',
    options: [
      { 
        id: 'finish', 
        text: 'Return to Dashboard',
        nextQuestionId: null
      }
    ]
  }
} 