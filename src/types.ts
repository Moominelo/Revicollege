
export type Level = '6ème' | '5ème' | '4ème' | '3ème';

export type Subject = 
  | 'Mathématiques' 
  | 'Français' 
  | 'Histoire-Géographie' 
  | 'SVT' 
  | 'Physique-Chimie' 
  | 'Technologie' 
  | 'Anglais' 
  | 'Espagnol'
  | 'Allemand'
  | 'Italien'
  | 'EMC'
  | 'Arts Plastiques'
  | 'Éducation Musicale'
  | 'Brevet Blanc'
  | 'Annales Brevet';

export type QuizDifficulty = 'intro' | 'revision' | 'mastery';
export type QuestionCount = 5 | 10 | 20;

export interface Curriculum {
  level: Level;
  subjects: {
    name: Subject;
    topics: string[];
  }[];
}

export interface SheetContent {
  title: string;
  objectives: string[];
  keyPoints: string[];
  detailedContent: string;
  examples: string[];
  // Command string for GeoGebra (e.g., "f(x)=x^2") - Only for Math
  geogebraCommand?: string;
  // Chart data for SVT (only if needed)
  chartContent?: ChartContent; 
  examSample: {
    instruction: string;
    perfectCopy: string;
    tips: string;
  };
}

export interface ChartContent {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  data: { name: string; value: number }[];
  type: 'bar' | 'line';
}

export type QuestionType = 'MCQ' | 'OPEN';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  // For Dictée or oral comprehension
  textToRead?: string; 
  // For MCQ
  options?: string[];
  correctAnswerIndex?: number;
  // For OPEN
  correctAnswerText?: string; // The reference answer for the AI grader
  explanation: string; // General explanation
}

export interface QuizContent {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface QuizConfig {
  questionCount: QuestionCount;
  difficulty: QuizDifficulty;
}

export interface GradingResult {
  isCorrect: boolean;
  score: number; // 0 or 1
  feedback: string;
}

export type AppState = 'HOME' | 'SELECTION' | 'LOADING_SHEET' | 'SHEET' | 'QUIZ_SETUP' | 'LOADING_QUIZ' | 'QUIZ' | 'RESULT';
