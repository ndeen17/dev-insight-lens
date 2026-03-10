import { useState, useEffect, useCallback } from 'react';
import { Code2, Wifi, WifiOff } from 'lucide-react';
import CodeEditor from '@/components/assessment/CodeEditor';
import CodeExecutionPanel from '@/components/assessment/CodeExecutionPanel';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import type { LanguageInfo, ExecutionResult, TestCaseResult } from '@/types/assessment';
import * as codeExecutionService from '@/services/codeExecutionService';

/**
 * Playground Page
 * Standalone code editor + execution panel for testing.
 * Available to all authenticated users — great for practice.
 */

// Default languages (used if API is unavailable)
const DEFAULT_LANGUAGES: LanguageInfo[] = [
  { key: 'javascript', id: 63, name: 'JavaScript (Node.js)', monacoId: 'javascript' },
  { key: 'python',     id: 71, name: 'Python 3',             monacoId: 'python' },
  { key: 'java',       id: 62, name: 'Java',                 monacoId: 'java' },
  { key: 'cpp',        id: 54, name: 'C++ (GCC)',             monacoId: 'cpp' },
  { key: 'typescript', id: 74, name: 'TypeScript',            monacoId: 'typescript' },
  { key: 'go',         id: 60, name: 'Go',                    monacoId: 'go' },
  { key: 'ruby',       id: 72, name: 'Ruby',                  monacoId: 'ruby' },
  { key: 'rust',       id: 73, name: 'Rust',                  monacoId: 'rust' },
  { key: 'csharp',     id: 51, name: 'C#',                    monacoId: 'csharp' },
  { key: 'kotlin',     id: 78, name: 'Kotlin',                monacoId: 'kotlin' },
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Welcome to Artemis Playground!\n// Write your JavaScript code here and click "Run"\n\nconsole.log("Hello, World!");`,
  python: `# Welcome to Artemis Playground!\n# Write your Python code here and click "Run"\n\nprint("Hello, World!")`,
  java: `// Welcome to Artemis Playground!\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `// Welcome to Artemis Playground!\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  typescript: `// Welcome to Artemis Playground!\n\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);`,
  go: `// Welcome to Artemis Playground!\npackage main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}`,
  ruby: `# Welcome to Artemis Playground!\nputs "Hello, World!"`,
  rust: `// Welcome to Artemis Playground!\nfn main() {\n    println!("Hello, World!");\n}`,
  csharp: `// Welcome to Artemis Playground!\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  kotlin: `// Welcome to Artemis Playground!\nfun main() {\n    println("Hello, World!")\n}`,
};

export default function Playground() {
  const [languages, setLanguages] = useState<LanguageInfo[]>(DEFAULT_LANGUAGES);
  const [selectedLang, setSelectedLang] = useState<LanguageInfo>(DEFAULT_LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [stdin, setStdin] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting] = useState(false);
  const [judge0Healthy, setJudge0Healthy] = useState<boolean | null>(null);

  // Load languages & check Judge0 health on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [langs, health] = await Promise.all([
          codeExecutionService.getLanguages(),
          codeExecutionService.checkHealth(),
        ]);
        if (langs.length > 0) setLanguages(langs);
        setJudge0Healthy(health.healthy);
      } catch {
        setJudge0Healthy(false);
      }
    };
    init();
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((lang: LanguageInfo) => {
    setSelectedLang(lang);
    setCode(DEFAULT_CODE[lang.key] || `// Write your ${lang.name} code here\n`);
    setExecutionResult(null);
    setTestCaseResults([]);
  }, []);

  // Run code with custom stdin
  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setTestCaseResults([]);
    try {
      const result = await codeExecutionService.runCode({
        sourceCode: code,
        language: selectedLang.key,
        stdin,
      });
      setExecutionResult(result);
    } catch (err: unknown) {
      setExecutionResult({
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Execution failed',
        compileOutput: '',
        status: { id: 0, description: 'Error' },
        executionTime: null,
        memoryUsed: null,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLang, stdin]);

  const { user } = useAuth();

  return (
    <DashboardLayout userRole={user?.role as 'BusinessOwner' | 'Freelancer' | undefined}>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* ─── Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Code2 className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Code Playground</h1>
              <p className="text-xs text-gray-500">
                Write, run, and test your code in 10+ languages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {judge0Healthy !== null && (
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${
                  judge0Healthy
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {judge0Healthy ? (
                  <Wifi className="w-3.5 h-3.5" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5" />
                )}
                {judge0Healthy ? 'Engine Online' : 'Engine Offline'}
              </span>
            )}
          </div>
        </div>

        {/* ─── Split Pane: Editor | Output ─────────────────── */}
        <div className="flex-1 min-h-0 flex">
          {/* Left: Code Editor */}
          <div className="w-1/2 min-h-0 border-r border-gray-200">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLang}
              languages={languages}
              onLanguageChange={handleLanguageChange}
              starterCode={DEFAULT_CODE[selectedLang.key]}
            />
          </div>

          {/* Right: Output / Test Cases */}
          <div className="w-1/2 min-h-0">
            <CodeExecutionPanel
              stdin={stdin}
              onStdinChange={setStdin}
              executionResult={executionResult}
              testCaseResults={testCaseResults}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onRun={handleRun}
              onRunSamples={() => {}} // No question context in playground
              onSubmit={() => {}}     // No session context in playground
              showSubmit={false}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
