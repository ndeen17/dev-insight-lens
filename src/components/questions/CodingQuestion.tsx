import { useState } from 'react';
import { Question, CodeExecutionResult } from '../../types/test';
import { executeCode } from '../../services/codeExecutionService';
import Editor from '@monaco-editor/react';
import { Button } from '../ui/button';
import { Play, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface CodingQuestionProps {
  question: Question;
  value?: string;
  onChange: (code: string) => void;
}

const CodingQuestion = ({ question, value, onChange }: CodingQuestionProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<CodeExecutionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRunCode = async () => {
    if (!value || !question.testCases || !question.language) return;

    setIsRunning(true);
    setError(null);
    setTestResults([]);

    try {
      const results = await executeCode(value, question.language, question.testCases);
      setTestResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const visibleTestCases = question.testCases?.filter(tc => !tc.hidden) || [];
  const hasHiddenTestCases = question.testCases?.some(tc => tc.hidden);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{question.title}</h3>
        <p className="text-gray-600">{question.description}</p>
        <p className="text-sm text-gray-500">{question.points} points</p>
      </div>

      <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage={question.language || 'javascript'}
          value={value || question.starterCode || ''}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {question.testCases && (
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRunCode}
            disabled={isRunning || !value}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
          <span className="text-sm text-gray-500">
            Test against {visibleTestCases.length} visible test case{visibleTestCases.length !== 1 ? 's' : ''}
            {hasHiddenTestCases && ` + hidden test cases`}
          </span>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {testResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Test Results:</h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  result.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {result.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {result.executionTime}ms
                  </span>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <div>
                    <span className="font-medium">Expected:</span>{' '}
                    <code className="bg-white px-2 py-1 rounded">
                      {result.expectedOutput}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Got:</span>{' '}
                    <code className="bg-white px-2 py-1 rounded">
                      {result.output || result.error}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingQuestion;
