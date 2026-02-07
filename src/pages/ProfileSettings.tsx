import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@clerk/clerk-react';
import { SkeletonProfile } from '@/components/Skeletons';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Save,
  Loader2,
  X,
  Code2,
  Megaphone,
  Palette,
  BarChart3,
  PenTool,
  FolderKanban,
  Database,
  Headphones,
  HelpCircle,
  Camera,
  Shield,
  MapPin,
  Github,
  Briefcase,
  ChevronDown,
} from 'lucide-react';

// ─── Profession definitions (shared with onboarding) ──────────
const PROFESSIONS = [
  { id: 'Software Engineering', label: 'Software Engineering', icon: Code2 },
  { id: 'Marketing', label: 'Marketing', icon: Megaphone },
  { id: 'Design', label: 'Design', icon: Palette },
  { id: 'Finance', label: 'Finance', icon: BarChart3 },
  { id: 'Writing', label: 'Writing', icon: PenTool },
  { id: 'Project Management', label: 'Project Management', icon: FolderKanban },
  { id: 'Data Analysis', label: 'Data Analysis', icon: Database },
  { id: 'Customer Service', label: 'Customer Service', icon: Headphones },
  { id: 'Other', label: 'Other', icon: HelpCircle },
] as const;

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineering': ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Engineer', 'QA Engineer'],
  'Marketing': ['Digital Marketing Manager', 'SEO Specialist', 'Content Strategist', 'Social Media Manager', 'Growth Marketer'],
  'Design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Brand Designer', 'Motion Designer'],
  'Finance': ['Financial Analyst', 'Bookkeeper', 'Accountant', 'Tax Specialist', 'CFO Consultant'],
  'Writing': ['Copywriter', 'Technical Writer', 'Content Writer', 'Blog Writer', 'Ghostwriter'],
  'Project Management': ['Project Manager', 'Scrum Master', 'Program Manager', 'Agile Coach', 'Product Manager'],
  'Data Analysis': ['Data Analyst', 'Business Intelligence Analyst', 'Data Scientist', 'Analytics Engineer'],
  'Customer Service': ['Support Agent', 'Customer Success Manager', 'Technical Support', 'Community Manager'],
  'Other': [],
};

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker', 'REST APIs', 'GraphQL', 'MongoDB'],
  'Marketing': ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'PPC', 'Email Marketing', 'Copywriting', 'A/B Testing'],
  'Design': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping'],
  'Finance': ['Financial Modeling', 'Excel', 'QuickBooks', 'Budgeting', 'Forecasting', 'Tax Preparation', 'Bookkeeping'],
  'Writing': ['Copywriting', 'SEO Writing', 'Technical Writing', 'Editing', 'Proofreading', 'Research', 'Storytelling'],
  'Project Management': ['Agile', 'Scrum', 'Jira', 'Asana', 'Risk Management', 'Stakeholder Management', 'Budgeting'],
  'Data Analysis': ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'R', 'Statistics', 'Data Visualization'],
  'Customer Service': ['Zendesk', 'Intercom', 'CRM', 'Conflict Resolution', 'Ticketing Systems', 'Live Chat'],
  'Other': [],
};

interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  country: string;
  profession: string;
  professionalRole: string;
  skills: string[];
  githubUsername: string;
  companyName: string;
  profilePicture: string;
}

const ProfileSettings = () => {
  const { user: authUser, refreshUser } = useAuth();
  const { user: clerkUser } = useUser();
  const { toast } = useToast();

  const userRole = authUser?.role === 'BusinessOwner' ? 'BusinessOwner' : 'Freelancer';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [professionOpen, setProfessionOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const [form, setForm] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    bio: '',
    country: '',
    profession: '',
    professionalRole: '',
    skills: [],
    githubUsername: '',
    companyName: '',
    profilePicture: '',
  });

  // Track original values to detect changes
  const [original, setOriginal] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/users/me/profile');
      const u = res.data.user;
      const data: ProfileData = {
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        bio: u.bio || '',
        country: u.country || '',
        profession: u.profession || '',
        professionalRole: u.professionalRole || '',
        skills: u.skills || [],
        githubUsername: u.githubUsername || '',
        companyName: u.companyName || '',
        profilePicture: u.profilePicture || '',
      };
      setForm(data);
      setOriginal(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const hasChanges = original && JSON.stringify(form) !== JSON.stringify(original);

  const handleSave = async () => {
    if (!authUser?._id || !hasChanges) return;

    try {
      setSaving(true);
      const payload: Record<string, unknown> = {};

      // Only send changed fields
      for (const key of Object.keys(form) as (keyof ProfileData)[]) {
        if (JSON.stringify(form[key]) !== JSON.stringify(original?.[key])) {
          payload[key] = form[key];
        }
      }

      await apiClient.put(`/api/users/${authUser._id}`, payload);
      await refreshUser();
      setOriginal({ ...form });

      toast({ title: 'Saved', description: 'Your profile has been updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed) && form.skills.length < 30) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleProfessionChange = (prof: string) => {
    setForm(f => ({
      ...f,
      profession: prof,
      // Reset role + skills if profession changed (user can re-add)
      professionalRole: prof === f.profession ? f.professionalRole : '',
    }));
    setProfessionOpen(false);
  };

  const avatarUrl =
    form.profilePicture ||
    clerkUser?.imageUrl ||
    `https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=e5e7eb&color=374151&bold=true&size=128`;

  if (loading) {
    return (
      <DashboardLayout userRole={userRole as 'BusinessOwner' | 'Freelancer'}>
        <div className="flex items-center justify-center h-screen p-8">
          <div className="max-w-3xl w-full">
            <SkeletonProfile />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole as 'BusinessOwner' | 'Freelancer'}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-body-sm text-gray-500 mt-0.5">Manage your profile and account preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-all shadow-sm active:scale-[0.97] w-full sm:w-auto ${
              hasChanges
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-3xl space-y-6 sm:space-y-8">
        {/* ── Profile Picture + Name ─────────────────────── */}
        <Section title="Profile" icon={<User className="w-5 h-5" />}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name">
                  <Input
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Last Name">
                  <Input
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    placeholder="Last name"
                  />
                </Field>
              </div>

              <Field label="Bio" hint={`${form.bio.length}/500`}>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 500) }))}
                  placeholder="Tell clients about yourself..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Country" icon={<MapPin className="w-4 h-4 text-gray-400" />}>
                  <Input
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    placeholder="e.g. United States"
                  />
                </Field>
                {userRole === 'BusinessOwner' && (
                  <Field label="Company Name" icon={<Briefcase className="w-4 h-4 text-gray-400" />}>
                    <Input
                      value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="Your company"
                    />
                  </Field>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Profession & Skills (Freelancer only) ──────── */}
        {userRole === 'Freelancer' && (
          <Section title="Profession & Skills" icon={<Code2 className="w-5 h-5" />}>
            {/* Profession selector */}
            <Field label="Profession">
              <div className="relative">
                <button
                  onClick={() => setProfessionOpen(!professionOpen)}
                  className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {form.profession ? (
                    <span className="flex items-center gap-2">
                      {(() => {
                        const p = PROFESSIONS.find(p => p.id === form.profession);
                        if (p) {
                          const Icon = p.icon;
                          return <Icon className="w-4 h-4 text-gray-500" />;
                        }
                        return null;
                      })()}
                      {form.profession}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select profession</span>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {professionOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {PROFESSIONS.map(p => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleProfessionChange(p.id)}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            form.profession === p.id ? 'bg-gray-50 font-medium' : ''
                          }`}
                        >
                          <Icon className="w-4 h-4 text-gray-500" />
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </Field>

            {/* Professional Role */}
            {form.profession && (
              <Field label="Professional Role">
                <div className="relative">
                  <button
                    onClick={() => setRoleOpen(!roleOpen)}
                    className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {form.professionalRole || <span className="text-muted-foreground">Select or type a role</span>}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {roleOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {(ROLE_SUGGESTIONS[form.profession] || []).map(r => (
                        <button
                          key={r}
                          onClick={() => { setForm(f => ({ ...f, professionalRole: r })); setRoleOpen(false); }}
                          className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                            form.professionalRole === r ? 'bg-gray-50 font-medium' : ''
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                      <div className="p-2 border-t border-gray-100">
                        <Input
                          placeholder="Custom role..."
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              setForm(f => ({ ...f, professionalRole: (e.target as HTMLInputElement).value }));
                              setRoleOpen(false);
                            }
                          }}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Field>
            )}

            {/* Skills */}
            <Field label="Skills" hint={`${form.skills.length}/30`}>
              <div className="space-y-3">
                {/* Current skills */}
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(skill => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="pl-3 pr-1 py-1 text-sm flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 p-0.5 hover:bg-gray-300 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Skill input */}
                <Input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="text-sm"
                />

                {/* Suggestions */}
                {form.profession && (SKILL_SUGGESTIONS[form.profession] || []).length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Suggestions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(SKILL_SUGGESTIONS[form.profession] || [])
                        .filter(s => !form.skills.includes(s))
                        .slice(0, 12)
                        .map(s => (
                          <button
                            key={s}
                            onClick={() => handleAddSkill(s)}
                            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </Field>

            {/* GitHub (developers only) */}
            {form.profession === 'Software Engineering' && (
              <Field label="GitHub Username" icon={<Github className="w-4 h-4 text-gray-400" />}>
                <Input
                  value={form.githubUsername}
                  onChange={e => setForm(f => ({ ...f, githubUsername: e.target.value.toLowerCase().trim() }))}
                  placeholder="your-username"
                />
              </Field>
            )}
          </Section>
        )}

        {/* ── Account Info ───────────────────────────────── */}
        <Section title="Account" icon={<Shield className="w-5 h-5" />}>
          <div className="space-y-4">
            <Field label="Email">
              <div className="flex items-center gap-3">
                <Input value={authUser?.email || ''} disabled className="text-sm bg-gray-50 text-gray-500" />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  authUser?.isEmailVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {authUser?.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </Field>

            <Field label="Role">
              <Input value={authUser?.role === 'BusinessOwner' ? 'Employer' : 'Freelancer'} disabled className="text-sm bg-gray-50 text-gray-500" />
            </Field>

            <Field label="Member Since">
              <Input
                value={authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                disabled
                className="text-sm bg-gray-50 text-gray-500"
              />
            </Field>
          </div>
        </Section>

        {/* Bottom spacer for scroll */}
        <div className="h-8" />
      </div>
    </DashboardLayout>
  );
};

/* ── Sub-components ────────────────────────────────────────── */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="text-gray-500">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          {icon}
          {label}
        </Label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default ProfileSettings;
