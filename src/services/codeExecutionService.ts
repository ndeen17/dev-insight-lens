import { TestCase, CodeExecutionResult } from '@/types/test';
import { API_CONFIG } from '@/config/constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ExecuteCodeRequest {
  code: string;
  language: string;
  testCases: TestCase[];
}

/**
 * Get the current Clerk auth token for authenticated requests
 */
async function getAuthToken(): Promise<string | null> {
  try {
    // Access Clerk's session token from the global Clerk instance
    const token = await window.Clerk?.session?.getToken();
    return token || null;
  } catch {
    return null;
  }
}

export async function executeCode(
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<CodeExecutionResult[]> {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/execute-code`, {
      method: 'POST',
      headers,
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
