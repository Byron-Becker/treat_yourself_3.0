// pacing-lesson.ts
export const exerciseLessonContent = [
    {
      id: '1',
      type: 'info',
      title: 'What\'s the goal of these exercises?',
      body: 'These exercises are not for strengthening-- they are diagnostic tools to guide your recovery.',
      imageUrl: '/proneonelbows.png'
    },
    {
      id: '2',
      type: 'info',
      title: 'Creating The Right Environment',
      body: 'Stop any existing exercises you are currently doing for your low back.  This will help us more clearly determine which exercises are helping or hurting your condition.',
      imageUrl: '/longterm.png'
    },
    {
      id: '3',

      type: 'infoBullet',
      title: 'Understanding Your Exercise Response',
      introduction: 'Several key responses to pay attention to with the exercises:',
      bullets: [
        { text: 'Your pain may appear then gradually diminish' },
        { text: 'Your movement may improve with repetition' },
        { text: 'Your symptoms can increase or decrease' },
        { text: 'Your pain location may change or shift' }
      ],
      imageUrl: '/derangement.png'
    },
    {
      id: '4',
      type: 'infoBullet',
      title: 'What is Centralization?',
      introduction: 'Centralization is the movement of your pain to a more central location:',
      bullets: [
        { text: 'It is the best indicator of recovery' },
        { text: 'Exercises that centralize are the correct movements' },
        { text: 'Exercises that move pain away from the low back are the wrong movements' },
        { text: 'Let the exercises that centralize your pain guide you' }
      ],
      imageUrl: '/centralize.png'
    },

    {
      id: '5',
      type: 'question',
      question: 'Is the pain centralizing?',
      options: [
        { id: '1', text: 'No, the symptoms are moving away from the low back.', isCorrect: true },
        { id: '2', text: 'No, the symptoms are staying the same.', isCorrect: false },
        { id: '3', text: 'Yes, the symptoms move from the back of the thigh to the low back.', isCorrect: false }
      ],
      explanation: 'Remember, centralization is the movement of your pain to a more central location. If your pain is moving away from the low back, it is worsening.',
      imageUrl: '/beforeafter.png'
    },
    {
      id: '6',
      type: 'infoBullet',
      title: 'What is Directional Preference?',
      introduction: 'It\'s the movement direction that improves or centralizes your symptoms:',
      bullets: [
        { text: 'Most common direction is extension (backward bending)' },
        { text: 'Up to 70% of people exhibit a directional preference' },
        { text: 'Using repeated movements in the same direction can help determine the correct direction' },
        { text: 'The exercise module ahead will help guide you to find your directional preference' }
      ],
      imageUrl: '/standflexext.png'
      
    },
    {
      id: '7',
      type: 'question',
      question: 'A person has pain in their lower back and right hip. After performing 10 repetitions of forward bends (flexion), their symptoms have spread to include their lower back, right hip, and right calf. Is flexion their directional preference?',
      options: [
        { id: '1', text: 'Yes, their symptoms are centralizing', isCorrect: false },
        { id: '2', text: 'No, their symptoms are moving away from the low back.', isCorrect: true },
        { id: '3', text: 'Not enough information to determine', isCorrect: false }
      ],
      explanation: 'The answer is no.  The patient symptoms have moved further down into the calf.  This is the opposite of centralization, and tells us that we do not want to continue in that direction.  Remember:  If symptoms move away from the spine, pain intensity increases and remains worse, and/or your range of movement decreases,  you should discontinue the movement in that direction.',
      imageUrl: '/beforeaftercalf.png'
    },

    {
      id: '8',
      type: 'question',
      question: 'The same person now has pain in their low back, right hip, and right calf. After performing 10 repetitions of backward bends (extension), their symptoms are now in the low back and the right hip. Is extension their directional preference?',
      options: [
        { id: '1', text: 'Yes, their symptoms are centralizing', isCorrect: true },
        { id: '2', text: 'No, their symptoms are moving away from the low back.', isCorrect: false },
        { id: '3', text: 'Not enough information to determine', isCorrect: false }
      ],
      explanation: 'The answer is yes!  The right calf no longer has any symptoms, and the pain is back to the original location of the low back and right hip.  This is a centralizing response.  They should continue with extension.',
      imageUrl: '/afterbeforecalf.png'
    },
    {
      id: '9',
      type: 'info',
      title: 'Last but not least...',
      body: 'We understand that was a lot. Feel free to scroll up and review any of the principles we went over. The next module will help guide you through a series of exercises to help you find your directional preference.',
      imageUrl: '/sphinx-pose.png',
      nextRoute: '/exercise-progression/1'
    }
  ]