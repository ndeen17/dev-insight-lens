import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/StatCard';
import {
  Loader2,
  MapPin,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Github,
  ClipboardCheck,
  BarChart3,
  Code2,
  MessageSquare,
  Star,
  Zap,
  Crown,
  Target,
  Trophy,
  TrendingUp,
  Play,
  Settings,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as talentService from '@/services/talentService';
import { SkeletonProfile } from '@/components/Skeletons';
import type {
  FreelancerProfile,
  FreelancerSelfAssessment,
  ActiveSession,
  ProfileBadge,
} from '@/types/talent';
import { ROUTES } from '@/config/constants';

// ─── Helpers ──────────────────────────────────────────────────

const scoreColor = (s: number) =>
  s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

const scoreBarColor = (s: number) =>
  s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';

const scoreBg = (s: number) =>
  s >= 80 ? 'bg-green-50 border-green-200 text-green-600' : s >= 60 ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-red-50 border-red-200 text-red-600';

const diffBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

const typeBadge: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
  coding: { bg: 'bg-lime-100 text-lime-700', icon: <Code2 className="w-3 h-3" />, label: 'Coding' },
  ai_chat: { bg: 'bg-blue-100 text-blue-700', icon: <MessageSquare className="w-3 h-3" />, label: 'AI Chat' },
};

const badgeIcons: Record<string, React.ReactNode> = {
  award: <Award className="w-4 h-4" />,
  trophy: <Trophy className="w-4 h-4" />,
  star: <Star className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  crown: <Crown className="w-4 h-4" />,
  target: <Target className="w-4 h-4" />,
};

const badgeBg: Record<string, string> = {
  first_assessment: 'bg-blue-50 text-blue-700 border-blue-200',
  five_assessments: 'bg-amber-50 text-amber-700 border-amber-200',
  ten_assessments: 'bg-purple-50 text-purple-700 border-purple-200',
  top_scorer: 'bg-green-50 text-green-700 border-green-200',
  elite: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300',
  perfect: 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 border-pink-200',
};

export default function MyProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [assessments, setAssessments] = useState<FreelancerSelfAssessment[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await talentService.getMyFullProfile();
        setProfile(data.profile);
        setAssessments(data.assessments);
        setActiveSessions(data.activeSessions);
      } catch {
        toast({ title: 'Error', description: 'Failed to load profile', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  if (loading) {
    return (
      <DashboardLayout userRole="Freelancer">
        <SkeletonProfile />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userRole="Freelancer">
        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <User className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-600">Something went wrong. Please try again.</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.FREELANCER_DASHBOARD)}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="Freelancer">
      {/* ─── Header ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.bestScore != null && (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-sm font-semibold ${scoreBg(profile.bestScore)}`}>
                    <Award className="w-4 h-4" />
                    {profile.bestScore}%
                  </div>
                )}
              </div>

              <p className="text-gray-500 mt-0.5">
                {profile.professionalRole || profile.profession || 'Freelancer'}
              </p>

              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-400 flex-wrap">
                {profile.country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.country}
                  </span>
                )}
                {profile.githubUsername && (
                  <a
                    href={`https://github.com/${profile.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    {profile.githubUsername}
                  </a>
                )}
                {profile.assessmentCount > 0 && (
                  <span className="flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    {profile.assessmentCount} assessment{profile.assessmentCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Badges */}
              {profile.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.badges.map((b: ProfileBadge) => (
                    <span
                      key={b.key}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badgeBg[b.key] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
                    >
                      {badgeIcons[b.icon] || <Award className="w-3.5 h-3.5" />}
                      {b.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.SETTINGS)} className="shrink-0">
              <Settings className="w-4 h-4 mr-1.5" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* ─── Bio ───────────────────────────────────────────── */}
        {profile.bio && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* ─── Skills ────────────────────────────────────────── */}
        {profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* ─── Stats ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Best Score"
            value={profile.bestScore != null ? `${profile.bestScore}%` : '—'}
            icon={<Award className="w-5 h-5 text-green-600" />}
            bg="bg-green-50"
            index={0}
          />
          <StatCard
            label="Avg Score"
            value={profile.avgScore != null ? `${profile.avgScore}%` : '—'}
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            bg="bg-blue-50"
            index={1}
          />
          <StatCard
            label="Completed"
            value={profile.assessmentCount}
            sub="assessments"
            icon={<ClipboardCheck className="w-5 h-5 text-amber-600" />}
            bg="bg-amber-50"
            index={2}
          />
          <StatCard
            label="Active"
            value={activeSessions.length}
            sub="in progress"
            icon={<Play className="w-5 h-5 text-purple-600" />}
            bg="bg-purple-50"
            index={3}
          />
        </div>

        {/* ─── Active Sessions ───────────────────────────────── */}
        {activeSessions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              In Progress
            </h3>
            <div className="space-y-3">
              {activeSessions.map((s) => (
                <button
                  key={s._id}
                  onClick={() => navigate(ROUTES.ASSESSMENT_SESSION.replace(':id', s._id))}
                  className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4 text-left hover:border-amber-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Play className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{s.assessment.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span>{s.assessment.profession}</span>
                        <Badge className={diffBadge[s.assessment.difficulty] || ''} variant="outline">
                          {s.assessment.difficulty}
                        </Badge>
                        {s.assessment.assessmentType && (
                          <Badge className={typeBadge[s.assessment.assessmentType]?.bg || ''} variant="outline">
                            {typeBadge[s.assessment.assessmentType]?.label || s.assessment.assessmentType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-600 group-hover:text-amber-700">
                    Continue →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Assessment Results ────────────────────────────── */}
        {assessments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Assessment History ({assessments.length})
            </h3>
            <div className="space-y-4">
              {assessments.map((a) => {
                const aType = a.assessment?.assessmentType;
                const employer = a.assessment?.createdBy;
                return (
                  <div
                    key={a._id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-gray-900">{a.assessment.title}</h4>
                          <Badge className={diffBadge[a.assessment.difficulty] || ''}>
                            {a.assessment.difficulty}
                          </Badge>
                          {aType && typeBadge[aType] && (
                            <Badge className={typeBadge[aType].bg}>
                              <span className="flex items-center gap-1">
                                {typeBadge[aType].icon}
                                {typeBadge[aType].label}
                              </span>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {a.assessment.profession}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {a.timeSpentSeconds
                              ? `${Math.floor(a.timeSpentSeconds / 60)}m ${a.timeSpentSeconds % 60}s`
                              : '—'}
                          </span>
                          {employer && (
                            <span className="text-gray-400">
                              by {employer.companyName || `${employer.firstName} ${employer.lastName}`}
                            </span>
                          )}
                          <span className="text-gray-400">
                            {new Date(a.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className={`text-2xl font-bold ${scoreColor(a.score ?? 0)}`}>
                        {a.score ?? '—'}%
                      </p>
                    </div>

                    {/* Skill breakdown */}
                    {a.breakdown && Object.keys(a.breakdown).length > 0 && (
                      <div className="space-y-2 mb-3">
                        {Object.entries(a.breakdown).map(([skill, score]) => (
                          <div key={skill}>
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs text-gray-600">{skill}</span>
                              <span className={`text-xs font-semibold ${scoreColor(score)}`}>
                                {score}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${scoreBarColor(score)}`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Strengths & weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {a.strengths.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Strengths
                          </p>
                          <ul className="space-y-0.5">
                            {a.strengths.slice(0, 3).map((s, i) => (
                              <li key={i} className="text-xs text-gray-600">{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {a.weaknesses.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-700 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Areas to Improve
                          </p>
                          <ul className="space-y-0.5">
                            {a.weaknesses.slice(0, 3).map((w, i) => (
                              <li key={i} className="text-xs text-gray-600">{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {assessments.length === 0 && activeSessions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No assessments yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Complete assessments to build your developer profile. Browse available assessments or
              accept invitations from employers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(ROUTES.ASSESSMENT_CATALOG)} className="bg-blue-600 hover:bg-blue-700">
                Browse Assessments
              </Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.ASSESSMENT_INVITATIONS)}>
                View Invitations
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
