/**
 * QuestionBuilder — Inline form for authoring a coding question.
 * Used inside the Create Assessment wizard (Step 2).
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Save,
  Loader2,
  X,
  Code2,
  Tag,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TestCaseEditor, { type TestCaseInput } from './TestCaseEditor';
import type { Question, QuestionDifficulty } from '@/types/assessment';
import * as questionService from '@/services/questionService';

const CATEGORIES = [
  'Arrays & Strings',
  'Linked Lists',
  'Trees & Graphs',
  'Dynamic Programming',
  'Sorting & Searching',
  'Hash Tables',
  'Recursion',
  'Math & Logic',
  'System Design',
  'SQL & Databases',
  'Other',
];

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'kotlin', label: 'Kotlin' },
];

interface QuestionBuilderProps {
  onSave: (question: Question) => void;
  onCancel: () => void;
  editQuestion?: Question | null;
}

export default function QuestionBuilder({ onSave, onCancel, editQuestion }: QuestionBuilderProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [points, setPoints] = useState(10);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [constraints, setConstraints] = useState('');
  const [examples, setExamples] = useState('');
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(600);
  const [allowedLanguages, setAllowedLanguages] = useState<string[]>(['javascript', 'python', 'java', 'cpp']);
  const [testCases, setTestCases] = useState<TestCaseInput[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  // Pre-fill from editQuestion
  useEffect(() => {
    if (editQuestion) {
      setTitle(editQuestion.title || '');
      setDescription(editQuestion.description || '');
      setDifficulty(editQuestion.difficulty || 'medium');
      setPoints(editQuestion.points || 10);
      setCategory(editQuestion.category || '');
      setTags(editQuestion.tags || []);
      setConstraints(editQuestion.constraints || '');
      setExamples(editQuestion.examples || '');
      setTimeLimitSeconds(editQuestion.timeLimitSeconds || 600);
      setAllowedLanguages(editQuestion.allowedLanguages?.length ? editQuestion.allowedLanguages : ['javascript', 'python', 'java', 'cpp']);
      setIsPublic(editQuestion.isPublic || false);
      if (editQuestion.testCases?.length) {
        setTestCases(
          editQuestion.testCases.map((tc, i) => ({
            id: tc._id || `edit_${i}`,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            explanation: tc.explanation || '',
          }))
        );
      }
    }
  }, [editQuestion]);

  const toggleLanguage = (lang: string) => {
    setAllowedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const canSave =
    title.trim() &&
    description.trim() &&
    testCases.length >= 1 &&
    testCases.every((tc) => tc.input.trim() || tc.expectedOutput.trim()) &&
    allowedLanguages.length >= 1;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);

    try {
      const payload: Partial<Question> = {
        title: title.trim(),
        description: description.trim(),
        type: 'coding',
        difficulty,
        points,
        category: category || 'Other',
        tags,
        constraints: constraints.trim(),
        examples: examples.trim(),
        timeLimitSeconds,
        allowedLanguages,
        isPublic,
        testCases: testCases.map((tc) => ({
          _id: '',
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          explanation: tc.explanation,
        })),
      };

      let question: Question;
      if (editQuestion?._id) {
        question = await questionService.updateQuestion(editQuestion._id, payload);
        toast({ title: 'Question updated!' });
      } else {
        question = await questionService.createQuestion(payload);
        toast({ title: 'Question created!' });
      }

      onSave(question);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save question';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-lime-600" />
          <h3 className="font-semibold text-sm text-gray-900">
            {editQuestion ? 'Edit Question' : 'New Coding Question'}
          </h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-5 space-y-5">
        {/* Title */}
        <div>
          <Label className="text-xs font-medium text-gray-600">
            Question Title <span className="text-red-500">*</span>
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Two Sum"
            maxLength={200}
            className="mt-1"
          />
        </div>

        {/* Description / Problem Statement */}
        <div>
          <Label className="text-xs font-medium text-gray-600">
            Problem Statement <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution.`}
            rows={5}
            className="mt-1 font-mono text-xs"
          />
        </div>

        {/* Examples */}
        <div>
          <Label className="text-xs font-medium text-gray-600">Examples (shown to candidate)</Label>
          <Textarea
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            placeholder={`Example 1:\n  Input: nums = [2,7,11,15], target = 9\n  Output: [0,1]\n  Explanation: nums[0] + nums[1] == 9\n\nExample 2:\n  Input: nums = [3,2,4], target = 6\n  Output: [1,2]`}
            rows={4}
            className="mt-1 font-mono text-xs"
          />
        </div>

        {/* Constraints */}
        <div>
          <Label className="text-xs font-medium text-gray-600">Constraints</Label>
          <Textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder={`• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• Only one valid answer exists.`}
            rows={3}
            className="mt-1 text-xs"
          />
        </div>

        {/* Difficulty + Points + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as QuestionDifficulty)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Easy</span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
                </SelectItem>
                <SelectItem value="hard">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Hard</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Points</Label>
            <div className="flex items-center gap-2 mt-1">
              <Slider
                value={[points]}
                onValueChange={([v]) => setPoints(v)}
                min={1}
                max={100}
                step={5}
                className="flex-1 [&_[role=slider]]:bg-lime-500 [&_[role=slider]]:border-lime-500"
              />
              <span className="text-sm font-semibold text-gray-700 min-w-[3ch] text-right">{points}</span>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Time Limit</Label>
            <div className="flex items-center gap-2 mt-1">
              <Slider
                value={[timeLimitSeconds]}
                onValueChange={([v]) => setTimeLimitSeconds(v)}
                min={60}
                max={3600}
                step={60}
                className="flex-1 [&_[role=slider]]:bg-lime-500 [&_[role=slider]]:border-lime-500"
              />
              <span className="text-xs font-semibold text-gray-700 min-w-[4ch] text-right">
                {Math.floor(timeLimitSeconds / 60)}m
              </span>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <Label className="text-xs font-medium text-gray-600">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-xs font-medium text-gray-600">Tags</Label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px] pr-1">
                <Tag className="w-2.5 h-2.5 mr-0.5" />
                {t}
                <button
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag"
              className="text-xs"
            />
            <Button variant="outline" size="sm" onClick={addTag} disabled={!tagInput.trim()}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Allowed Languages */}
        <div>
          <Label className="text-xs font-medium text-gray-600">
            Allowed Languages <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {LANGUAGES.map((lang) => {
              const selected = allowedLanguages.includes(lang.value);
              return (
                <Badge
                  key={lang.value}
                  variant={selected ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs transition-all ${
                    selected
                      ? 'bg-lime-100 text-lime-800 border-lime-300 hover:bg-lime-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleLanguage(lang.value)}
                >
                  {lang.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Test Cases */}
        <div>
          <Label className="text-xs font-medium text-gray-600 mb-2 block">
            Test Cases <span className="text-red-500">*</span>
          </Label>
          <TestCaseEditor testCases={testCases} onChange={setTestCases} />
        </div>

        {/* Public toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-xs text-gray-600">Share this question with the public question library</span>
        </label>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!canSave || saving}
          size="sm"
          className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
        >
          {saving ? (
            <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-3.5 h-3.5 mr-1.5" /> {editQuestion ? 'Update Question' : 'Save Question'}</>
          )}
        </Button>
      </div>
    </div>
  );
}
