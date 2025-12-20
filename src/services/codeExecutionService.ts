import { TestCase, CodeExecutionResult } from '@/types/test';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface ExecuteCodeRequest {
  code: string;
  language: string;
  testCases: TestCase[];
}

export async function executeCode(
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<CodeExecutionResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/execute-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        testCases,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Code execution failed');
    }

    const results: CodeExecutionResult[] = await response.json();
    return results;
  } catch (error) {
    console.error('Code execution error:', error);
    
    // Return error results for all test cases
    return testCases.map((testCase, index) => ({
      testCaseIndex: index,
      passed: false,
      output: '',
      expectedOutput: testCase.expectedOutput,
      error: error instanceof Error ? error.message : 'Failed to execute code',
      executionTime: 0,
    }));
  }
}
