import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Loader2,
  XCircle,
  MapPin,
  Mail,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Github,
  Send,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as talentService from '@/services/talentService';
import { SkeletonProfile } from '@/components/Skeletons';
import type { TalentProfile as TalentProfileType, TalentAssessmentResult } from '@/types/talent';
import { ROUTES } from '@/config/constants';

const scoreColor = (s: number) =>
  s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

const scoreBarColor = (s: number) =>
  s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';

const diffBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function TalentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<TalentProfileType | null>(null);
  const [assessments, setAssessments] = useState<TalentAssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await talentService.getTalentProfile(id);
        setProfile(data.profile);
        setAssessments(data.assessments);
      } catch {
        toast({ title: 'Error', description: 'Failed to load profile', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, toast]);

  if (loading) {
    return (
      <DashboardLayout userRole="BusinessOwner">
        <SkeletonProfile />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userRole="BusinessOwner">
        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-600">Freelancer not found</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.BROWSE_TALENT)}>
            Back to Browse
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.BROWSE_TALENT)} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.bestScore != null && (
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-sm font-semibold ${
                      profile.bestScore >= 80
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : profile.bestScore >= 60
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    {profile.bestScore}%
                  </div>
                )}
              </div>

              <p className="text-gray-500 mt-0.5">
                {profile.professionalRole || profile.profession}
              </p>

              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
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
                    className="flex items-center gap-1 hover:text-gray-700"
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
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate(ROUTES.CREATE_CONTRACT, { state: { freelancerEmail: profile.email } })}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Contract
            </Button>
            <Button
              onClick={() =>
                navigate(ROUTES.EMPLOYER_ASSESSMENTS, {
                  state: { inviteEmail: profile.email },
                })
              }
              className="w-full sm:w-auto bg-green-400 hover:bg-green-500 text-black font-bold shadow-sm active:scale-[0.97] transition-all"
            >
              <Send className="w-4 h-4 mr-2" />
              Invite to Assessment
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Bio */}
        {profile.bio && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {profile.assessmentCount > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Best Score</p>
              <p className={`text-2xl font-bold ${scoreColor(profile.bestScore ?? 0)}`}>
                {profile.bestScore ?? '—'}%
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile.avgScore ?? '—'}%
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{profile.assessmentCount}</p>
            </div>
          </div>
        )}

        {/* Assessment results */}
        {assessments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Assessment Results
            </h3>
            <div className="space-y-4">
              {assessments.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{a.assessment.title}</h4>
                        <Badge className={diffBadge[a.assessment.difficulty] || ''}>
                          {a.assessment.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
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
              ))}
            </div>
          </div>
        )}

        {assessments.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              This freelancer hasn't completed any assessments yet.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                navigate(ROUTES.EMPLOYER_ASSESSMENTS, { state: { inviteEmail: profile.email } })
              }
            >
              <Send className="w-4 h-4 mr-2" />
              Invite to Assessment
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
