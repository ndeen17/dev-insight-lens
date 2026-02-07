import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Code2,
  Megaphone,
  Palette,
  BarChart3,
  PenTool,
  FolderKanban,
  Database,
  Headphones,
  HelpCircle,
  X,
  Github,
  Loader2,
} from 'lucide-react';

// ─── Profession definitions ────────────────────────────────────
const PROFESSIONS = [
  { id: 'Software Engineering', label: 'Software Engineering', icon: Code2, color: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
  { id: 'Marketing', label: 'Marketing', icon: Megaphone, color: 'bg-orange-50 border-orange-200 hover:border-orange-400' },
  { id: 'Design', label: 'Design', icon: Palette, color: 'bg-pink-50 border-pink-200 hover:border-pink-400' },
  { id: 'Finance', label: 'Finance', icon: BarChart3, color: 'bg-green-50 border-green-200 hover:border-green-400' },
  { id: 'Writing', label: 'Writing', icon: PenTool, color: 'bg-purple-50 border-purple-200 hover:border-purple-400' },
  { id: 'Project Management', label: 'Project Management', icon: FolderKanban, color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400' },
  { id: 'Data Analysis', label: 'Data Analysis', icon: Database, color: 'bg-teal-50 border-teal-200 hover:border-teal-400' },
  { id: 'Customer Service', label: 'Customer Service', icon: Headphones, color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400' },
  { id: 'Other', label: 'Other', icon: HelpCircle, color: 'bg-gray-50 border-gray-200 hover:border-gray-400' },
] as const;

// ─── Suggested roles per profession ────────────────────────────
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

// ─── Suggested skills per profession ───────────────────────────
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

const FreelancerOnboarding = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('');
  const [professionalRole, setProfessionalRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [saving, setSaving] = useState(false);

  const totalSteps = profession === 'Software Engineering' ? 4 : 3;
  const isDev = profession === 'Software Engineering';

  const effectiveRole = customRole || professionalRole;

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 30) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        profession,
        professionalRole: effectiveRole,
        skills,
      };
      if (isDev && githubUsername) {
        payload.githubUsername = githubUsername.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      }

      await apiClient.put('/api/auth/profile', payload);
      await refreshUser();

      toast({
        title: 'Profile set up!',
        description: 'Your profession and skills have been saved.',
      });

      navigate('/freelancer/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!profession;
      case 2: return !!effectiveRole;
      case 3: return skills.length > 0;
      case 4: return true; // GitHub step is optional
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Let's set up your profile
          </h1>
          <p className="text-gray-500">
            Tell us about yourself so employers can find you
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center mb-10">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > s
                    ? 'bg-green-500 text-white'
                    : step === s
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < totalSteps && (
                <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Profession */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">What do you do?</h2>
            <p className="text-gray-500 mb-6 text-sm">Select the profession that best describes your work</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROFESSIONS.map((p) => {
                const Icon = p.icon;
                const isSelected = profession === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setProfession(p.id);
                      setProfessionalRole('');
                      setCustomRole('');
                      setSkills([]);
                    }}
                    className={`flex flex-col items-center gap-2 p-5 border-2 rounded-xl transition-all text-center ${
                      isSelected
                        ? 'border-black bg-gray-50 ring-1 ring-black'
                        : p.color
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${isSelected ? 'text-black' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">What's your role?</h2>
            <p className="text-gray-500 mb-6 text-sm">Pick one or type your own</p>

            {ROLE_SUGGESTIONS[profession]?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {ROLE_SUGGESTIONS[profession].map((role) => (
                  <Badge
                    key={role}
                    variant={professionalRole === role ? 'default' : 'outline'}
                    className={`cursor-pointer py-2 px-4 text-sm ${
                      professionalRole === role
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setProfessionalRole(role);
                      setCustomRole('');
                    }}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="custom-role" className="text-sm text-gray-600">
                Or type your role
              </Label>
              <Input
                id="custom-role"
                placeholder="e.g., Machine Learning Engineer"
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  setProfessionalRole('');
                }}
                className="text-base"
              />
            </div>
          </div>
        )}

        {/* Step 3: Skills */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Your top skills</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Add skills that showcase your expertise (click suggestions or type below)
            </p>

            {/* Suggested skills */}
            {SKILL_SUGGESTIONS[profession]?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Suggested</p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_SUGGESTIONS[profession]
                    .filter(s => !skills.includes(s))
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer py-1.5 px-3 text-sm hover:bg-gray-50"
                        onClick={() => handleAddSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Custom skill input */}
            <div className="space-y-2 mb-5">
              <Label className="text-sm text-gray-600">Add custom skill</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="text-base"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddSkill(skillInput)}
                  disabled={!skillInput.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected skills */}
            {skills.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Your skills ({skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-black text-white py-1.5 px-3 text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: GitHub (devs only) */}
        {step === 4 && isDev && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Link your GitHub</h2>
            <p className="text-gray-500 mb-6 text-sm">
              This powers your developer Skills Card and makes you visible on the leaderboard.
              You can skip this and do it later.
            </p>

            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <Github className="w-8 h-8 text-gray-700 flex-shrink-0" />
              <div className="flex-1">
                <Input
                  placeholder="github.com/username or just username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="text-base"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Why link GitHub?</strong> We analyze your public repos to generate a Skills Card
              showing your code quality, architecture, activity, and more. This score helps employers
              find and evaluate you — and gets you on the developer leaderboard.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/freelancer/dashboard')}>
              Skip for now
            </Button>
          )}

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={saving || !canProceed()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerOnboarding;
