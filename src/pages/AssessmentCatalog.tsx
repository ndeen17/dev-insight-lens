import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Code2,
  MessageSquare,
  Users,
  Clock,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Library,
  SlidersHorizontal,
  Award,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as talentService from '@/services/talentService';
import type { PublicAssessment } from '@/types/talent';
import { ROUTES } from '@/config/constants';

// ─── Helpers ──────────────────────────────────────────────────

const diffBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
};

const typeBadge: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
  coding: { bg: 'bg-lime-50 text-lime-700 border-lime-200', icon: <Code2 className="w-3.5 h-3.5" />, label: 'Coding' },
  ai_chat: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'AI Chat' },
};

const FILTERS = {
  difficulty: [
    { label: 'All Levels', value: '' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ],
  type: [
    { label: 'All Types', value: '' },
    { label: 'Coding', value: 'coding' },
    { label: 'AI Chat', value: 'ai_chat' },
  ],
  sort: [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'A–Z', value: 'title' },
  ],
};

export default function AssessmentCatalog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [assessments, setAssessments] = useState<PublicAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filter state from URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const assessmentType = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'recent';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await talentService.getPublicAssessments({
          page,
          limit: 12,
          search: search || undefined,
          profession: undefined,
          difficulty: difficulty || undefined,
          assessmentType: assessmentType || undefined,
          sort: sort || undefined,
        });
        setAssessments(data.assessments);
        setTotal(data.pagination.total);
        setPages(data.pagination.pages);
      } catch {
        toast({ title: 'Error', description: 'Failed to load assessments', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [page, search, difficulty, assessmentType, sort, toast]);

  const userRole = authUser?.role || 'Freelancer';

  return (
    <DashboardLayout userRole={userRole as 'Freelancer' | 'BusinessOwner'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Library className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessment Catalog</h1>
              <p className="text-sm text-gray-500">
                Browse and take public skill assessments to build your profile
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        {/* ─── Filters ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search assessments…"
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />
            {FILTERS.difficulty.map((f) => (
              <button
                key={f.value}
                onClick={() => updateParam('difficulty', f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  difficulty === f.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.type.map((f) => (
              <button
                key={f.value}
                onClick={() => updateParam('type', f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  assessmentType === f.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 cursor-pointer"
          >
            {FILTERS.sort.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* ─── Results ────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-16">
            <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No assessments found</h3>
            <p className="text-sm text-gray-500">
              {search || difficulty || assessmentType
                ? 'Try adjusting your filters or search query.'
                : 'No public assessments are available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {total} assessment{total !== 1 ? 's' : ''} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((a) => {
                const t = typeBadge[a.assessmentType];
                return (
                  <div
                    key={a._id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                  >
                    {/* Top badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {t && (
                        <Badge variant="outline" className={t.bg}>
                          <span className="flex items-center gap-1">
                            {t.icon}
                            {t.label}
                          </span>
                        </Badge>
                      )}
                      <Badge variant="outline" className={diffBadge[a.difficulty] || ''}>
                        {a.difficulty}
                      </Badge>
                    </div>

                    {/* Title + description */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{a.title}</h3>
                    {a.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{a.description}</p>
                    )}

                    {/* Skills */}
                    {a.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {a.skills.slice(0, 4).map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                        {a.skills.length > 4 && (
                          <span className="text-[10px] text-gray-400">+{a.skills.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {a.profession}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {a.timeLimitMinutes}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {a.completions}
                      </span>
                      {a.avgScore != null && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          avg {a.avgScore}%
                        </span>
                      )}
                    </div>

                    {/* Employer */}
                    {a.createdBy && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        {a.createdBy.profilePicture ? (
                          <img src={a.createdBy.profilePicture} className="w-4 h-4 rounded-full" alt="" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-200" />
                        )}
                        <span>
                          {a.createdBy.companyName || `${a.createdBy.firstName} ${a.createdBy.lastName}`}
                        </span>
                      </div>
                    )}

                    {/* CTA */}
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        // Navigate to join page using invite code if available
                        if (a.allowedLanguages) {
                          navigate(ROUTES.ASSESSMENT_INVITATIONS);
                        }
                      }}
                    >
                      Take Assessment
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pages}
                  onClick={() => updateParam('page', String(page + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
