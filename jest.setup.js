// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom' 

// jest.setup.js

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => null,
    Loader2: () => null,
    Menu: () => null,
    X: () => null,
    ImageOff: () => null,
    CheckCircle: () => null
  }))