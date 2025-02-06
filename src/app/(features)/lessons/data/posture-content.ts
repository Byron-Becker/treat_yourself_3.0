// posture-lesson.ts
export const postureLessonContent = [
    {
      id: '1',
      type: 'info',
      title: 'Understanding Posture',
      body: 'Good posture is essential for reducing strain on your body and preventing pain. In this lesson, we\'ll explore what makes good posture and how to maintain it throughout your day.',
      imageUrl: '/goodbadposture.png'
    },
    {
      id: '2',
      type: 'info',
      title: 'The Spine\'s Natural Curves',
      body: 'Your spine has natural curves that help distribute weight and absorb shock. Maintaining these curves while sitting and standing is key to good posture.',
      imageUrl: '/lumbar-good.png'
    },
    {
      id: '3',
      type: 'question',
      question: 'Which of these is a sign of poor posture?',
      options: [
        { id: '1', text: 'Rounded shoulders and forward head position', isCorrect: true },
        { id: '2', text: 'Ears aligned with shoulders when viewed from the side', isCorrect: false },
        { id: '3', text: 'Natural curve in lower back', isCorrect: false }
      ],
      explanation: 'Rounded shoulders and forward head position put extra strain on your neck and upper back muscles. This posture often develops from prolonged computer use or phone viewing.',
      imageUrl: '/posture-good.png'
    },
    {
      id: '4',
      type: 'info',
      title: 'Common Posture Mistakes',
      body: 'Many daily activities can lead to poor posture. Looking down at phones, slouching at desks, and carrying heavy bags on one shoulder are common culprits.',
      imageUrl: '/slouchposture.png'
    },
    {
      id: '5',
      type: 'question',
      question: 'What is the best way to check your standing posture?',
      options: [
        { id: '1', text: 'Stand with your back against a wall, with head, shoulders, and hips touching', isCorrect: true },
        { id: '2', text: 'Look in the mirror while standing normally', isCorrect: false },
        { id: '3', text: 'Ask someone to take a photo of you', isCorrect: false }
      ],
      explanation: 'The wall check provides consistent reference points for alignment. Your head, shoulder blades, and buttocks should touch the wall, with feet about 4 inches from the wall.',
      imageUrl: ''
    }
  ]