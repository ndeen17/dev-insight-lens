/**
 * QuestionLibrary — Modal / inline picker to browse and add existing questions
 * from the question bank into an assessment.
 */

import { useState, useEffect, useCallback } from 'react';
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
  Search,
  Plus,
  Check,
  Loader2,
  Library,
  Filter,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Question, QuestionDifficulty } from '@/types/assessment';
import * as questionService from '@/services/questionService';

const diffColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

interface QuestionLibraryProps {
  open: boolean;
  onClose: () => void;
  onAdd: (questions: Question[]) => void;
  alreadyAdded: string[]; // IDs already in the assessment
}

export default function QuestionLibrary({ open, onClose, onAdd, alreadyAdded }: QuestionLibraryProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { type: 'coding', limit: '50' };
      if (search.trim()) params.search = search.trim();
      if (difficulty) params.difficulty = difficulty;
      if (category) params.category = category;

      const data = await questionService.getQuestions(params);
      setQuestions(data.questions);
    } catch {
      // Silent fail — questions will be empty
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, category]);

  useEffect(() => {
    if (open) {
      fetchQuestions();
      questionService.getCategories().then(setCategories).catch(() => {});
    }
  }, [open, fetchQuestions]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const picked = questions.filter((q) => selected.has(q._id));
    onAdd(picked);
    setSelected(new Set());
    onClose();
  };

  const isAlreadyAdded = (id: string) => alreadyAdded.includes(id);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Library className="w-5 h-5 text-lime-600" />
            Question Library
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 pb-3 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="pl-8 text-sm"
            />
          </div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-40">
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

        {/* Question list */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No questions found. Try a different search.</p>
            </div>
          ) : (
            questions.map((q) => {
              const added = isAlreadyAdded(q._id);
              const isSelected = selected.has(q._id);
              return (
                <div
                  key={q._id}
                  onClick={() => !added && toggleSelect(q._id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    added
                      ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-lime-400 bg-lime-50 ring-1 ring-lime-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {/* Selection indicator */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      added
                        ? 'border-gray-300 bg-gray-200'
                        : isSelected
                        ? 'border-lime-500 bg-lime-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {(added || isSelected) && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Question info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{q.title}</h4>
                      <Badge className={`text-[10px] ${diffColor[q.difficulty] || ''}`}>
                        {q.difficulty}
                      </Badge>
                      <span className="text-[10px] text-gray-400">{q.points} pts</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {q.category && (
                        <span className="text-[10px] text-gray-500">{q.category}</span>
                      )}
                      {q.tags?.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-[9px] px-1 py-0">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="shrink-0">
                    {added ? (
                      <span className="text-[10px] text-gray-400">Already added</span>
                    ) : isSelected ? (
                      <Badge className="bg-lime-100 text-lime-700 text-[10px]">Selected</Badge>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="border-t pt-3">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-500">
              {selected.size} question{selected.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={selected.size === 0}
                className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add {selected.size > 0 ? `(${selected.size})` : ''}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
