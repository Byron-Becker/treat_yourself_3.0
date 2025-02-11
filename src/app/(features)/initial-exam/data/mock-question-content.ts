export const examContent = {
    safety: {
      title: "Safety Screening",
      description: "Please answer these safety questions to ensure this program is right for you.",
      questions: [
        {
          id: 'severe-leg-pain',
          text: 'Do you have ALL of the following:',
          subItems: [
            'Severe leg pain below the knee',
            'Weakness, numbness, or pins and needles in foot/toes'
          ],
          options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
          ]
        },
        {
          id: 'recent-accident',
          text: 'Have you developed low back problems following a recent severe accident?',
          options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
          ]
        },
        {
          id: 'bladder-issues',
          text: 'Have you developed any bladder problems following a recent severe episode of low back pain?',
          options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
          ]
        }
      ]
    },
    treatment: {
      title: "Treatment Assessment",
      description: "Please answer the following questions about your condition.",
      questions: [
        {
          id: 'pain-free-periods',
          text: 'Are there periods in the day when you have no pain? Even ten minutes?',
          options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
          ]
        },
        {
          id: 'pain-above-knee',
          text: 'Is the pain confined to areas above the knee?',
          options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
          ]
        },
        {
          id: 'worse-sitting',
          text: 'Are you generally worse when sitting for prolonged periods or on rising from the sitting position?',
          options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
          ]
        }
      ]
    }
  }