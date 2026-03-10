import { useState } from 'react';
import {
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick,
  Loader2,
  Terminal,
  FlaskConical,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { TestCaseResult, ExecutionResult } from '@/types/assessment';

type TabType = 'testcases' | 'output';

interface CodeExecutionPanelProps {
  /** Custom stdin for "Run Code" */
  stdin: string;
  onStdinChange: (value: string) => void;

  /** Output from "Run Code" */
  executionResult: ExecutionResult | null;

  /** Results from "Run Against Samples" or "Submit" */
  testCaseResults: TestCaseResult[];

  /** Loading states */
  isRunning: boolean;
  isSubmitting: boolean;

  /** Callbacks */
  onRun: () => void;
  onRunSamples: () => void;
  onSubmit: () => void;

  /** Overall submission result */
  submissionScore?: number | null;
  submissionStatus?: string | null;

  /** Whether to show submit button (only during active session) */
  showSubmit?: boolean;
  /** Read-only mode (reviewing past submissions) */
  readOnly?: boolean;
}

export default function CodeExecutionPanel({
  stdin,
  onStdinChange,
  executionResult,
  testCaseResults,
  isRunning,
  isSubmitting,
  onRun,
  onRunSamples,
  onSubmit,
  submissionScore,
  submissionStatus,
  showSubmit = true,
  readOnly = false,
}: CodeExecutionPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('testcases');

  const passedCount = testCaseResults.filter((r) => r.passed).length;
  const totalCount = testCaseResults.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700">
      {/* ─── Tab Bar + Actions ─────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-gray-700">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'testcases'
                ? 'bg-[#333333] text-lime-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Test Cases
            {totalCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
                  allPassed
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-600/50 text-gray-300'
                }`}
              >
                {passedCount}/{totalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'output'
                ? 'bg-[#333333] text-lime-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Output
          </button>
        </div>

        {/* Action Buttons */}
        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              onClick={onRun}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-200 bg-[#333333] hover:bg-[#3c3c3c] disabled:opacity-50 rounded-md transition-colors"
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Run
            </button>
            <button
              onClick={onRunSamples}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-200 bg-[#333333] hover:bg-[#3c3c3c] disabled:opacity-50 rounded-md transition-colors"
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FlaskConical className="w-3.5 h-3.5" />
              )}
              Test
            </button>
            {showSubmit && (
              <button
                onClick={onSubmit}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-900 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 rounded-md transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Submit
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── Submission Score Banner ──────────────────────── */}
      {submissionScore !== null && submissionScore !== undefined && (
        <div
          className={`px-4 py-2 text-sm font-medium border-b border-gray-700 ${
            submissionScore === 100
              ? 'bg-green-500/10 text-green-400'
              : submissionScore >= 50
              ? 'bg-yellow-500/10 text-yellow-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          Score: {submissionScore}% — {submissionStatus || 'Graded'}
        </div>
      )}

      {/* ─── Content Area ─────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-auto p-3">
        {activeTab === 'testcases' ? (
          <TestCasesView
            results={testCaseResults}
            stdin={stdin}
            onStdinChange={onStdinChange}
            readOnly={readOnly}
          />
        ) : (
          <OutputView result={executionResult} />
        )}
      </div>
    </div>
  );
}

// ─── Test Cases View ──────────────────────────────────────────

function TestCasesView({
  results,
  stdin,
  onStdinChange,
  readOnly,
}: {
  results: TestCaseResult[];
  stdin: string;
  onStdinChange: (v: string) => void;
  readOnly: boolean;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (results.length === 0) {
    return (
      <div className="space-y-3">
        <label className="text-xs text-gray-400 font-medium">Custom Input</label>
        <textarea
          value={stdin}
          onChange={(e) => onStdinChange(e.target.value)}
          placeholder="Enter custom stdin here..."
          disabled={readOnly}
          className="w-full h-32 bg-[#1e1e1e] border border-gray-600 rounded-md p-3 text-sm text-gray-200 font-mono placeholder-gray-500 focus:outline-none focus:border-lime-400 resize-none"
        />
        <p className="text-xs text-gray-500">
          Click "Run" to execute with custom input, or "Test" to run against sample test cases.
        </p>
      </div>
    );
  }

  const current = results[selectedIdx];

  return (
    <div className="space-y-3">
      {/* Test Case Tabs */}
      <div className="flex gap-1 flex-wrap">
        {results.map((r, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              i === selectedIdx
                ? 'bg-[#333333] text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {r.passed ? (
              <CheckCircle2 className="w-3 h-3 text-green-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
            {r.isHidden ? (
              <EyeOff className="w-3 h-3 text-gray-500" />
            ) : (
              <Eye className="w-3 h-3 text-gray-500" />
            )}
            Case {i + 1}
          </button>
        ))}
      </div>

      {/* Selected Test Case Details */}
      {current && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              Input
            </label>
            <pre className="mt-1 p-2 bg-[#1a1a1a] border border-gray-700 rounded text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-24 overflow-auto">
              {current.isHidden ? '[Hidden]' : current.input || '(empty)'}
            </pre>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              Expected Output
            </label>
            <pre className="mt-1 p-2 bg-[#1a1a1a] border border-gray-700 rounded text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-24 overflow-auto">
              {current.isHidden ? '[Hidden]' : current.expectedOutput || '(empty)'}
            </pre>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              Actual Output
            </label>
            <pre
              className={`mt-1 p-2 border rounded text-xs font-mono whitespace-pre-wrap max-h-24 overflow-auto ${
                current.passed
                  ? 'bg-green-500/5 border-green-500/30 text-green-300'
                  : 'bg-red-500/5 border-red-500/30 text-red-300'
              }`}
            >
              {current.actualOutput || '(no output)'}
            </pre>
          </div>

          {current.error && (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">
                Error
              </label>
              <pre className="mt-1 p-2 bg-red-500/5 border border-red-500/30 rounded text-xs text-red-300 font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                {current.error}
              </pre>
            </div>
          )}

          {/* Execution Metadata */}
          <div className="flex items-center gap-4 pt-1 text-[10px] text-gray-500">
            {current.executionTime !== null && current.executionTime !== undefined && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {current.executionTime.toFixed(1)} ms
              </span>
            )}
            {current.memoryUsed !== null && current.memoryUsed !== undefined && (
              <span className="flex items-center gap-1">
                <MemoryStick className="w-3 h-3" />
                {(current.memoryUsed / 1024).toFixed(1)} MB
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Raw Output View ──────────────────────────────────────────

function OutputView({ result }: { result: ExecutionResult | null }) {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Run your code to see output here.
      </div>
    );
  }

  const hasError = result.stderr || result.compileOutput;
  const isAccepted = result.status?.id === 3;

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
            isAccepted
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isAccepted ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          {result.status?.description || 'Unknown'}
        </span>
        <div className="flex items-center gap-4 text-[10px] text-gray-500">
          {result.executionTime !== null && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.executionTime.toFixed(1)} ms
            </span>
          )}
          {result.memoryUsed !== null && (
            <span className="flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              {(result.memoryUsed / 1024).toFixed(1)} MB
            </span>
          )}
        </div>
      </div>

      {/* stdout */}
      {result.stdout && (
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            stdout
          </label>
          <pre className="mt-1 p-3 bg-[#1a1a1a] border border-gray-700 rounded text-xs text-gray-200 font-mono whitespace-pre-wrap max-h-48 overflow-auto">
            {result.stdout}
          </pre>
        </div>
      )}

      {/* Compile Output */}
      {result.compileOutput && (
        <div>
          <label className="text-[10px] uppercase tracking-wider text-yellow-400 font-semibold">
            Compilation Output
          </label>
          <pre className="mt-1 p-3 bg-yellow-500/5 border border-yellow-500/30 rounded text-xs text-yellow-300 font-mono whitespace-pre-wrap max-h-48 overflow-auto">
            {result.compileOutput}
          </pre>
        </div>
      )}

      {/* stderr */}
      {result.stderr && (
        <div>
          <label className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">
            stderr
          </label>
          <pre className="mt-1 p-3 bg-red-500/5 border border-red-500/30 rounded text-xs text-red-300 font-mono whitespace-pre-wrap max-h-48 overflow-auto">
            {result.stderr}
          </pre>
        </div>
      )}

      {/* No output */}
      {!result.stdout && !hasError && (
        <div className="text-sm text-gray-500">No output produced.</div>
      )}
    </div>
  );
}
