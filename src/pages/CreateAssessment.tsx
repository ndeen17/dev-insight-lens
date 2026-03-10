/**
 * CreateAssessment — Multi-step wizard for creating assessments.
 *
 * Step 1: Assessment Type (Coding vs AI Chat) + Metadata
 * Step 2: Add Questions (coding only — inline builder + library picker)
 * Step 3: Review & Create
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
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
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  X,
  Code2,
  MessageSquare,
  Check,
  Library,
  Trash2,
  GripVertical,
  Clock,
  Target,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuestionBuilder from '@/components/assessment/QuestionBuilder';
import QuestionLibrary from '@/components/assessment/QuestionLibrary';
import * as assessmentService from '@/services/assessmentService';
import type { Question, AssessmentType, AssessmentDifficulty } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

// ─── Shared data ──────────────────────────────────────────────

const PROFESSIONS = [
  'Software Engineering', 'Marketing', 'Design', 'Finance', 'Writing',
  'Project Management', 'Data Analysis', 'Customer Service', 'Other',
];

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineering': ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Engineer', 'QA Engineer'],
  'Marketing': ['Digital Marketing Manager', 'SEO Specialist', 'Content Strategist', 'Social Media Manager', 'Growth Marketer'],
  'Design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Brand Designer', 'Web Designer'],
  'Finance': ['Financial Analyst', 'Bookkeeper', 'Accountant', 'Tax Specialist', 'Financial Planner'],
  'Writing': ['Copywriter', 'Technical Writer', 'Content Writer', 'Blog Writer', 'Ghostwriter'],
  'Project Management': ['Project Manager', 'Scrum Master', 'Program Manager', 'Agile Coach', 'Product Manager'],
  'Data Analysis': ['Data Analyst', 'Business Intelligence Analyst', 'Data Scientist', 'Analytics Engineer'],
  'Customer Service': ['Support Agent', 'Customer Success Manager', 'Technical Support', 'Community Manager'],
  'Other': [],
};

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker', 'REST APIs', 'GraphQL', 'MongoDB'],
  'Marketing': ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'PPC', 'Email Marketing', 'A/B Testing'],
  'Design': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping'],
  'Finance': ['Financial Modeling', 'Excel', 'QuickBooks', 'Budgeting', 'Forecasting', 'Tax Preparation'],
  'Writing': ['Copywriting', 'SEO Writing', 'Technical Writing', 'Editing', 'Proofreading', 'Storytelling'],
  'Project Management': ['Agile', 'Scrum', 'Jira', 'Asana', 'Risk Management', 'Sprint Planning'],
  'Data Analysis': ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'Data Visualization'],
  'Customer Service': ['Zendesk', 'Intercom', 'CRM', 'Conflict Resolution', 'Ticketing Systems'],
  'Other': [],
};

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

const difficultyColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── Wizard state ───────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // ── Step 1: Metadata ───────────────────────────────────────
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('coding');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [profession, setProfession] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [difficulty, setDifficulty] = useState<AssessmentDifficulty>('intermediate');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [allowedLanguages, setAllowedLanguages] = useState<string[]>(['javascript', 'python', 'java', 'cpp']);

  // ── Step 2: Questions (coding only) ────────────────────────
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // AI Chat step 1 — same as original but with fewer fields
  const [questionCount, setQuestionCount] = useState(10);

  // ── Derived ────────────────────────────────────────────────
  const effectiveRole = customRole || role;
  const availableRoles = ROLE_SUGGESTIONS[profession] || [];
  const availableSkills = (SKILL_SUGGESTIONS[profession] || []).filter((s) => !skills.includes(s));
  const totalPoints = useMemo(() => questions.reduce((sum, q) => sum + (q.points || 0), 0), [questions]);

  const totalSteps = assessmentType === 'coding' ? 3 : 2;

  // ── Validation ─────────────────────────────────────────────
  const canStep1 = title.trim() && profession;
  const canStep2 = assessmentType === 'ai_chat' || questions.length >= 1;
  const canCreate = canStep1 && canStep2;

  // ── Handlers ───────────────────────────────────────────────
  const addSkill = (s: string) => {
    if (s && !skills.includes(s) && skills.length < 30) setSkills([...skills, s]);
  };
  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) { addSkill(customSkill.trim()); setCustomSkill(''); }
  };

  const toggleLanguage = (lang: string) => {
    setAllowedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  const handleQuestionSaved = (q: Question) => {
    if (editingQuestion) {
      setQuestions((prev) => prev.map((old) => (old._id === q._id ? q : old)));
    } else {
      setQuestions((prev) => [...prev, q]);
    }
    setShowBuilder(false);
    setEditingQuestion(null);
  };

  const handleLibraryAdd = (picked: Question[]) => {
    const existingIds = new Set(questions.map((q) => q._id));
    const newOnes = picked.filter((q) => !existingIds.has(q._id));
    setQuestions((prev) => [...prev, ...newOnes]);
  };

  const handleCreate = async () => {
    if (!canCreate) return;
    setSaving(true);

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        profession,
        role: effectiveRole,
        skills,
        difficulty,
        timeLimitMinutes,
        assessmentType,
      };

      if (assessmentType === 'coding') {
        payload.questions = questions.map((q) => q._id);
        payload.questionCount = questions.length;
        payload.allowedLanguages = allowedLanguages;
      } else {
        payload.questionCount = questionCount;
      }

      const assessment = await assessmentService.createAssessment(payload);
      toast({ title: 'Assessment created!' });
      navigate(`/employer/assessments/${assessment._id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create assessment';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => step > 1 ? prevStep() : navigate(ROUTES.EMPLOYER_ASSESSMENTS)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Create Assessment</h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Step {step} of {totalSteps} —{' '}
              {step === 1 ? 'Setup' : step === 2 && assessmentType === 'coding' ? 'Add Questions' : 'Review & Create'}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i + 1 <= step ? 'bg-lime-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4 sm:p-8">

        {/* ── STEP 1: TYPE + METADATA ─────────────────────── */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Assessment Type */}
            <section className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Assessment Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAssessmentType('coding')}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    assessmentType === 'coding'
                      ? 'border-lime-400 bg-lime-50 ring-1 ring-lime-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {assessmentType === 'coding' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-lime-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Code2 className="w-6 h-6 text-lime-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Coding Assessment</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Custom coding challenges with test cases, live code execution, and auto-grading
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentType('ai_chat')}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    assessmentType === 'ai_chat'
                      ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {assessmentType === 'ai_chat' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">AI Chat Assessment</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    AI-generated adaptive questions with real-time chat evaluation
                  </p>
                </button>
              </div>
            </section>

            {/* Title + Description */}
            <section className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Assessment Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior React Developer Assessment"
                  maxLength={200}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this assessment evaluates…"
                  maxLength={2000}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </section>

            {/* Profession */}
            <section className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Profession <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={profession}
                  onValueChange={(v) => {
                    setProfession(v);
                    setRole('');
                    setCustomRole('');
                    setSkills([]);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role */}
              {profession && (
                <div>
                  <Label className="text-sm font-medium">Role (optional)</Label>
                  {availableRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableRoles.map((r) => (
                        <Badge
                          key={r}
                          variant={role === r ? 'default' : 'outline'}
                          className={`cursor-pointer ${
                            role === r ? 'bg-lime-100 text-lime-800 border-lime-300 font-semibold' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => { setRole(role === r ? '' : r); setCustomRole(''); }}
                        >
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Input
                    placeholder="Or type a custom role"
                    value={customRole}
                    onChange={(e) => { setCustomRole(e.target.value); setRole(''); }}
                    className="mt-2"
                  />
                </div>
              )}
            </section>

            {/* Skills */}
            {profession && (
              <section className="space-y-3">
                <Label className="text-sm font-medium">Skills to assess</Label>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <Badge key={s} variant="secondary" className="pr-1">
                        {s}
                        <button onClick={() => removeSkill(s)} className="ml-1.5 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {availableSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {availableSkills.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="cursor-pointer text-xs hover:bg-gray-100"
                        onClick={() => addSkill(s)}
                      >
                        <Plus className="w-3 h-3 mr-1" />{s}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom skill"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }}
                  />
                  <Button variant="outline" size="sm" onClick={handleAddCustomSkill} disabled={!customSkill.trim()}>
                    Add
                  </Button>
                </div>
              </section>
            )}

            {/* Difficulty */}
            <section className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Difficulty</Label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
                {([
                  { value: 'beginner' as const, label: 'Beginner', color: 'text-emerald-600' },
                  { value: 'intermediate' as const, label: 'Intermediate', color: 'text-amber-600' },
                  { value: 'advanced' as const, label: 'Advanced', color: 'text-red-600' },
                ] as const).map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDifficulty(value)}
                    className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      difficulty === value
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${difficulty === value ? color.replace('text-', 'bg-') : 'bg-gray-300'} transition-colors`} />
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Time Limit */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Time Limit</Label>
                <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">
                  {timeLimitMinutes} min
                </span>
              </div>
              <Slider
                value={[timeLimitMinutes]}
                onValueChange={([v]) => setTimeLimitMinutes(v)}
                min={5}
                max={180}
                step={5}
                className="[&_[role=slider]]:bg-lime-500 [&_[role=slider]]:border-lime-500 [&_[role=slider]]:shadow-md [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[data-orientation=horizontal]>.bg-primary]:bg-lime-500"
              />
              <p className="text-xs text-gray-400">5 – 180 minutes</p>
            </section>

            {/* AI Chat: question count */}
            {assessmentType === 'ai_chat' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Questions</Label>
                  <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">{questionCount}</span>
                </div>
                <Slider
                  value={[questionCount]}
                  onValueChange={([v]) => setQuestionCount(v)}
                  min={3}
                  max={20}
                  step={1}
                  className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600 [&_[role=slider]]:shadow-md [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
                />
                <p className="text-xs text-gray-400">3 – 20 AI-generated adaptive questions</p>
              </section>
            )}

            {/* Coding: Allowed Languages */}
            {assessmentType === 'coding' && (
              <section className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Allowed Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => {
                    const sel = allowedLanguages.includes(lang.value);
                    return (
                      <Badge
                        key={lang.value}
                        variant={sel ? 'default' : 'outline'}
                        className={`cursor-pointer text-xs transition-all ${
                          sel
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
              </section>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)} className="flex-1">
                Cancel
              </Button>
              {assessmentType === 'coding' ? (
                <Button
                  onClick={nextStep}
                  disabled={!canStep1}
                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-bold"
                >
                  Next: Add Questions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canStep1}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Next: Review
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: ADD QUESTIONS (coding only) ─────────── */}
        {step === 2 && assessmentType === 'coding' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add Questions</h2>
                <p className="text-sm text-gray-500">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} • {totalPoints} total points
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowLibrary(true)}>
                  <Library className="w-4 h-4 mr-1.5" />
                  From Library
                </Button>
                <Button
                  size="sm"
                  onClick={() => { setEditingQuestion(null); setShowBuilder(true); }}
                  className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Question
                </Button>
              </div>
            </div>

            {/* Question list */}
            {questions.length === 0 && !showBuilder ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No questions yet</h3>
                <p className="text-gray-500 text-sm mb-4 max-w-sm">
                  Create a new coding question or pick from your library.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowLibrary(true)}>
                    <Library className="w-4 h-4 mr-1.5" />
                    Browse Library
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowBuilder(true)}
                    className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create Question
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q._id}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="text-xs font-mono text-gray-400 w-6">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{q.title}</h4>
                        <Badge className={`text-[10px] ${difficultyColor[q.difficulty] || ''}`}>
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                        {q.category && <span>{q.category}</span>}
                        <span className="flex items-center gap-0.5">
                          <Target className="w-3 h-3" />{q.points} pts
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />{Math.floor((q.timeLimitSeconds || 600) / 60)}m
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                      onClick={() => removeQuestion(q._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Inline QuestionBuilder */}
            {showBuilder && (
              <QuestionBuilder
                onSave={handleQuestionSaved}
                onCancel={() => { setShowBuilder(false); setEditingQuestion(null); }}
                editQuestion={editingQuestion}
              />
            )}

            {/* Library picker */}
            <QuestionLibrary
              open={showLibrary}
              onClose={() => setShowLibrary(false)}
              onAdd={handleLibraryAdd}
              alreadyAdded={questions.map((q) => q._id)}
            />

            {/* Navigation */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canStep2}
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-bold"
              >
                Next: Review
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP FINAL: REVIEW & CREATE ─────────────────── */}
        {((step === 2 && assessmentType === 'ai_chat') || (step === 3 && assessmentType === 'coding')) && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-semibold text-gray-900">Review Assessment</h2>

            {/* Summary card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {assessmentType === 'coding' ? (
                      <Code2 className="w-5 h-5 text-lime-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    )}
                    <h3 className="font-bold text-gray-900">{title}</h3>
                  </div>
                  {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
                <Badge className={assessmentType === 'coding' ? 'bg-lime-100 text-lime-800' : 'bg-blue-100 text-blue-800'}>
                  {assessmentType === 'coding' ? 'Coding' : 'AI Chat'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Profession</p>
                  <p className="text-sm font-medium text-gray-900">{profession}</p>
                  {effectiveRole && <p className="text-xs text-gray-500">{effectiveRole}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Difficulty</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{difficulty}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Questions</p>
                  <p className="text-sm font-medium text-gray-900">
                    {assessmentType === 'coding' ? questions.length : questionCount}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Time Limit</p>
                  <p className="text-sm font-medium text-gray-900">{timeLimitMinutes} min</p>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {assessmentType === 'coding' && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allowedLanguages.map((l) => (
                      <Badge key={l} className="bg-lime-100 text-lime-800 text-xs">{l}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Questions summary (coding only) */}
            {assessmentType === 'coding' && questions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Questions ({questions.length}) — {totalPoints} total points
                  </h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {questions.map((q, idx) => (
                    <div key={q._id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-xs font-mono text-gray-400 w-5">{idx + 1}</span>
                      <span className="text-sm text-gray-900 flex-1 truncate">{q.title}</span>
                      <Badge className={`text-[10px] ${difficultyColor[q.difficulty] || ''}`}>
                        {q.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">{q.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!canCreate || saving}
                className={`flex-1 font-bold active:scale-[0.97] transition-all ${
                  assessmentType === 'coding'
                    ? 'bg-lime-500 hover:bg-lime-600 text-black'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating…</>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> Create Assessment</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
