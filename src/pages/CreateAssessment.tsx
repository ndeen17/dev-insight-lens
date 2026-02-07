import { useState } from 'react';
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
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import { ROUTES } from '@/config/constants';

// ─── Shared profession / role / skill data ─────────────────────

const PROFESSIONS = [
  'Software Engineering',
  'Marketing',
  'Design',
  'Finance',
  'Writing',
  'Project Management',
  'Data Analysis',
  'Customer Service',
  'Other',
];

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineering': ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Engineer', 'QA Engineer'],
  'Marketing': ['Digital Marketing Manager', 'SEO Specialist', 'Content Strategist', 'Social Media Manager', 'Growth Marketer', 'Email Marketing Specialist'],
  'Design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Brand Designer', 'Motion Designer', 'Web Designer'],
  'Finance': ['Financial Analyst', 'Bookkeeper', 'Accountant', 'Tax Specialist', 'CFO Consultant', 'Financial Planner'],
  'Writing': ['Copywriter', 'Technical Writer', 'Content Writer', 'Blog Writer', 'Grant Writer', 'Ghostwriter'],
  'Project Management': ['Project Manager', 'Scrum Master', 'Program Manager', 'Agile Coach', 'Product Manager'],
  'Data Analysis': ['Data Analyst', 'Business Intelligence Analyst', 'Data Scientist', 'Analytics Engineer', 'Reporting Analyst'],
  'Customer Service': ['Support Agent', 'Customer Success Manager', 'Technical Support', 'Community Manager', 'Help Desk Specialist'],
  'Other': [],
};

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker', 'REST APIs', 'GraphQL', 'MongoDB', 'PostgreSQL', 'CI/CD'],
  'Marketing': ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'PPC', 'Email Marketing', 'Copywriting', 'A/B Testing', 'Marketing Automation', 'CRM'],
  'Design': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Responsive Design'],
  'Finance': ['Financial Modeling', 'Excel', 'QuickBooks', 'Budgeting', 'Forecasting', 'Tax Preparation', 'Bookkeeping', 'GAAP', 'Financial Reporting', 'Payroll'],
  'Writing': ['Copywriting', 'SEO Writing', 'Technical Writing', 'Editing', 'Proofreading', 'Research', 'Storytelling', 'AP Style', 'CMS Management', 'Blog Writing'],
  'Project Management': ['Agile', 'Scrum', 'Jira', 'Asana', 'Risk Management', 'Stakeholder Management', 'Budgeting', 'Gantt Charts', 'Sprint Planning', 'Kanban'],
  'Data Analysis': ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'R', 'Statistics', 'Data Visualization', 'ETL', 'Machine Learning'],
  'Customer Service': ['Zendesk', 'Intercom', 'CRM', 'Conflict Resolution', 'Ticketing Systems', 'Live Chat', 'Phone Support', 'Knowledge Base', 'SLA Management', 'Empathy'],
  'Other': [],
};

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [profession, setProfession] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);

  const effectiveRole = customRole || role;
  const availableRoles = ROLE_SUGGESTIONS[profession] || [];
  const availableSkills = (SKILL_SUGGESTIONS[profession] || []).filter((s) => !skills.includes(s));

  const addSkill = (s: string) => {
    if (s && !skills.includes(s) && skills.length < 30) {
      setSkills([...skills, s]);
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill('');
    }
  };

  const canSubmit = title.trim() && profession;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);

    try {
      const assessment = await assessmentService.createAssessment({
        title: title.trim(),
        description: description.trim(),
        profession,
        role: effectiveRole,
        skills,
        difficulty,
        questionCount,
        timeLimitMinutes,
      });

      toast({ title: 'Assessment created!' });
      navigate(`/employer/assessments/${assessment._id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create assessment';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-4 pl-10 md:pl-0">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Create Assessment</h1>
            <p className="text-gray-500 text-xs sm:text-sm">Define the skills, difficulty, and format for your AI assessment</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Title + Description */}
        <section className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Assessment Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Senior React Developer Assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what this assessment evaluates…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
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
                      className={`cursor-pointer ${role === r ? 'bg-green-400 text-black font-semibold' : 'hover:bg-gray-100'}`}
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
                    <Plus className="w-3 h-3 mr-1" />
                    {s}
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
          <Label className="text-sm font-medium">Difficulty</Label>
          <div className="flex gap-3">
            {(['beginner', 'intermediate', 'advanced'] as const).map((d) => (
              <Button
                key={d}
                variant={difficulty === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDifficulty(d)}
                className={difficulty === d ? 'bg-green-400 text-black font-semibold' : ''}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Question count + time limit */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Questions: <span className="font-bold">{questionCount}</span>
            </Label>
            <Slider
              value={[questionCount]}
              onValueChange={([v]) => setQuestionCount(v)}
              min={3}
              max={20}
              step={1}
            />
            <p className="text-xs text-gray-400">3 – 20 questions</p>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Time Limit: <span className="font-bold">{timeLimitMinutes} min</span>
            </Label>
            <Slider
              value={[timeLimitMinutes]}
              onValueChange={([v]) => setTimeLimitMinutes(v)}
              min={5}
              max={120}
              step={5}
            />
            <p className="text-xs text-gray-400">5 – 120 minutes</p>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="flex-1 bg-green-400 hover:bg-green-500 text-black font-bold active:scale-[0.97] transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating…
              </>
            ) : (
              'Create Assessment'
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
