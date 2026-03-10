/**
 * QuestionBank — Recruiter page to browse, create, and manage coding questions.
 * Standalone page accessible from sidebar.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  Loader2,
  MoreVertical,
  Trash2,
  Pencil,
  Eye,
  Library,
  Clock,
  Target,
  Tag,
  Code2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuestionBuilder from '@/components/assessment/QuestionBuilder';
import * as questionService from '@/services/questionService';
import { SkeletonList } from '@/components/Skeletons';
import type { Question, QuestionDifficulty } from '@/types/assessment';

const diffColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function QuestionBank() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  // Builder
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { type: 'coding', limit: '50' };
      if (search.trim()) params.search = search.trim();
      if (difficulty && difficulty !== 'all') params.difficulty = difficulty;
      if (category && category !== 'all') params.category = category;

      const data = await questionService.getQuestions(params);
      setQuestions(data.questions);
      setTotal(data.pagination.total);
    } catch {
      toast({ title: 'Error', description: 'Failed to load questions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, category, toast]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    questionService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await questionService.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      toast({ title: 'Question deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleSaved = (q: Question) => {
    if (editingQuestion) {
      setQuestions((prev) => prev.map((old) => (old._id === q._id ? q : old)));
    } else {
      setQuestions((prev) => [q, ...prev]);
    }
    setShowBuilder(false);
    setEditingQuestion(null);
  };

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-lime-600" />
              <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">
                Question Bank
              </h1>
            </div>
            <p className="text-body-sm text-gray-500 mt-0.5">
              Create and manage coding challenges for your assessments
            </p>
          </div>
          <Button
            onClick={() => { setEditingQuestion(null); setShowBuilder(true); }}
            className="bg-lime-500 hover:bg-lime-600 text-black font-bold shadow-sm active:scale-[0.97] transition-all w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Question
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="pl-9"
            />
          </div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-36">
              <Filter className="w-3 h-3 mr-1.5 text-gray-400" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Builder (inline, appears at top) */}
        {showBuilder && (
          <div className="mb-6">
            <QuestionBuilder
              onSave={handleSaved}
              onCancel={() => { setShowBuilder(false); setEditingQuestion(null); }}
              editQuestion={editingQuestion}
            />
          </div>
        )}

        {/* Preview modal */}
        {previewQuestion && (
          <div className="mb-6 bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-lime-600" />
                  <h3 className="font-bold text-gray-900">{previewQuestion.title}</h3>
                  <Badge className={`text-xs ${diffColor[previewQuestion.difficulty] || ''}`}>
                    {previewQuestion.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{previewQuestion.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPreviewQuestion(null)}>
                Close
              </Button>
            </div>
            {previewQuestion.examples && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Examples</h4>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg whitespace-pre-wrap font-mono">{previewQuestion.examples}</pre>
              </div>
            )}
            {previewQuestion.constraints && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Constraints</h4>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{previewQuestion.constraints}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-3 border-t">
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {previewQuestion.points} pts</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.floor((previewQuestion.timeLimitSeconds || 600) / 60)}m</span>
              {previewQuestion.category && <span>{previewQuestion.category}</span>}
              {previewQuestion.testCases && (
                <span>{previewQuestion.testCases.length} test case{previewQuestion.testCases.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            {previewQuestion.tags && previewQuestion.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {previewQuestion.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    <Tag className="w-2.5 h-2.5 mr-0.5" />
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question list */}
        {loading ? (
          <SkeletonList count={5} />
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 animate-float">
              <Library className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No questions yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Create your first coding question to start building assessments.
            </p>
            <Button
              onClick={() => setShowBuilder(true)}
              className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Question
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{total} question{total !== 1 ? 's' : ''}</p>
            <div className="grid gap-3">
              {questions.map((q) => (
                <div
                  key={q._id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  onClick={() => setPreviewQuestion(previewQuestion?._id === q._id ? null : q)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{q.title}</h3>
                        <Badge className={`text-[10px] ${diffColor[q.difficulty] || ''}`}>
                          {q.difficulty}
                        </Badge>
                        {q.isPublic && (
                          <Badge variant="outline" className="text-[10px] text-blue-600">Public</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{q.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        {q.category && <span>{q.category}</span>}
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {q.points} pts</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.floor((q.timeLimitSeconds || 600) / 60)}m</span>
                        {q.testCases && (
                          <span>{q.testCases.length} test cases</span>
                        )}
                      </div>
                      {q.tags && q.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {q.tags.slice(0, 4).map((t) => (
                            <Badge key={t} variant="outline" className="text-[9px] px-1 py-0">{t}</Badge>
                          ))}
                          {q.tags.length > 4 && (
                            <span className="text-[10px] text-gray-400">+{q.tags.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setPreviewQuestion(q);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setEditingQuestion(q);
                          setShowBuilder(true);
                        }}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleDelete(q._id); }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
