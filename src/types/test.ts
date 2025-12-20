// Test Assessment Type Definitions

export type TestCategory = 'coding' | 'cognitive' | 'personality' | 'language' | 'job-skills';

export type QuestionType = 'mcq' | 'coding' | 'scenario' | 'likert' | 'true-false';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  points: number;
  
  // MCQ specific
  options?: string[];
  correctAnswer?: number; // index of correct option
  
  // Coding specific
  starterCode?: string;
  language?: 'javascript' | 'python' | 'java' | 'cpp';
  testCases?: TestCase[];
  
  // Likert specific
  scaleLabels?: [string, string]; // [min label, max label]
  
  // Scenario specific (uses MCQ format but with long context)
}

export interface Test {
  id: string;
  title: string;
  category: TestCategory;
  duration: number; // in minutes
  difficulty: Difficulty;
  description: string;
  questions: Question[];
  skillsCovered: string[];
}

export interface TestSession {
  testId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePosition?: string;
  startTime: Date;
  answers: Record<string, any>; // questionId -> answer
  currentQuestion: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  candidateName?: string;
  candidateEmail?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  categoryScores: Record<string, number>;
  answers: Record<string, any>;
  correctAnswers: Record<string, boolean>;
  completedAt: Date;
  duration: number; // in seconds
  passed: boolean;
}

export interface CodeExecutionRequest {
  code: string;
  language: string;
  testCases: TestCase[];
}

export interface CodeExecutionResult {
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number;
  expectedOutput: string;
}

export interface CodeExecutionResponse {
  results: CodeExecutionResult[];
  allPassed: boolean;
}
 