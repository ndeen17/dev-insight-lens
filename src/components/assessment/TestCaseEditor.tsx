/**
 * TestCaseEditor — Add/edit test cases for a coding question.
 * Supports sample (visible to candidate) and hidden test cases.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { TestCase } from '@/types/assessment';

// Local working type (no _id yet for new test cases)
export interface TestCaseInput {
  id: string; // local-only key
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation: string;
}

interface TestCaseEditorProps {
  testCases: TestCaseInput[];
  onChange: (testCases: TestCaseInput[]) => void;
}

let _counter = 0;
const uid = () => `tc_${Date.now()}_${++_counter}`;

export default function TestCaseEditor({ testCases, onChange }: TestCaseEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addTestCase = (hidden: boolean) => {
    const tc: TestCaseInput = {
      id: uid(),
      input: '',
      expectedOutput: '',
      isHidden: hidden,
      explanation: '',
    };
    onChange([...testCases, tc]);
    setExpandedId(tc.id);
  };

  const updateTestCase = (id: string, field: keyof TestCaseInput, value: string | boolean) => {
    onChange(
      testCases.map((tc) =>
        tc.id === id ? { ...tc, [field]: value } : tc
      )
    );
  };

  const removeTestCase = (id: string) => {
    onChange(testCases.filter((tc) => tc.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleHidden = (id: string) => {
    onChange(
      testCases.map((tc) =>
        tc.id === id ? { ...tc, isHidden: !tc.isHidden } : tc
      )
    );
  };

  const sampleCases = testCases.filter((tc) => !tc.isHidden);
  const hiddenCases = testCases.filter((tc) => tc.isHidden);

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs">
          <Eye className="w-3 h-3 mr-1" />
          {sampleCases.length} sample
        </Badge>
        <Badge variant="outline" className="text-xs">
          <EyeOff className="w-3 h-3 mr-1" />
          {hiddenCases.length} hidden
        </Badge>
        <span className="text-xs text-gray-400 ml-auto">
          {testCases.length} total test case{testCases.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Test case list */}
      <div className="space-y-2">
        {testCases.map((tc, idx) => {
          const isExpanded = expandedId === tc.id;
          return (
            <div
              key={tc.id}
              className={`border rounded-lg transition-all ${
                isExpanded
                  ? 'border-gray-300 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:bg-white'
              }`}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : tc.id)}
              >
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-0 truncate flex-1">
                  Test Case {idx + 1}
                </span>
                <Badge
                  variant={tc.isHidden ? 'secondary' : 'outline'}
                  className={`text-[10px] px-1.5 py-0 cursor-pointer ${
                    tc.isHidden
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'text-green-700 hover:bg-green-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHidden(tc.id);
                  }}
                >
                  {tc.isHidden ? (
                    <><EyeOff className="w-2.5 h-2.5 mr-0.5" /> Hidden</>
                  ) : (
                    <><Eye className="w-2.5 h-2.5 mr-0.5" /> Sample</>
                  )}
                </Badge>
                {tc.input && tc.expectedOutput && (
                  <span className="text-[10px] text-green-600 font-medium">✓</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTestCase(tc.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 space-y-3 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Input</Label>
                      <Textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                        placeholder={'e.g.\n[1, 2, 3]\n5'}
                        rows={3}
                        className="mt-1 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Expected Output</Label>
                      <Textarea
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(tc.id, 'expectedOutput', e.target.value)}
                        placeholder={'e.g.\n[0, 1]'}
                        rows={3}
                        className="mt-1 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Explanation (shown to candidate if sample)</Label>
                    <Input
                      value={tc.explanation}
                      onChange={(e) => updateTestCase(tc.id, 'explanation', e.target.value)}
                      placeholder="Because nums[0] + nums[1] == 5, return [0, 1]"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTestCase(false)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Sample Case
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTestCase(true)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Hidden Case
        </Button>
      </div>

      {testCases.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">
          Add at least one test case. Sample cases are visible to candidates; hidden cases are used for final grading.
        </p>
      )}
    </div>
  );
}
