import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import TalentSwipeCard from '@/components/TalentSwipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Loader2,
  Users,
  Heart,
  X,
  RotateCcw,
  Eye,
  Bookmark,
  Github,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as talentService from '@/services/talentService';
import { getLeaderboard } from '@/services/api';
import { saveDeveloper, getSavedCount as fetchSavedCount } from '@/services/savedDevsApi';
import type { TalentProfile, BrowseCandidate } from '@/types/talent';
import { ROUTES } from '@/config/constants';

/* ───────────────────── Constants ───────────────────── */

const PROFESSIONS = [
  'All',
  'GitHub Vetted',
  'Software Engineering',
  'Marketing',
  'Design',
  'Finance',
  'Writing',
  'Project Management',
  'Data Analysis',
  'Customer Service',
];

const MIN_SWIPE_DISTANCE = 50; // px

/* ───────────────── Data normalizers ───────────────── */

function normalizeTalent(t: TalentProfile): BrowseCandidate {
  return {
    id: t._id,
    type: 'talent',
    name: `${t.firstName} ${t.lastName}`.trim(),
    avatar: t.profilePicture,
    role: t.professionalRole || t.profession,
    profession: t.profession,
    location: t.country,
    bio: t.bio,
    skills: t.skills || [],
    bestScore: t.bestScore,
    avgScore: t.avgScore,
    assessmentCount: t.assessmentCount,
    profileId: t._id,
    email: t.email,
    username: t.githubUsername,
    githubUrl: t.githubUsername
      ? `https://github.com/${t.githubUsername}`
      : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDeveloper(d: any): BrowseCandidate {
  return {
    id: `lb_${d.username}`,
    type: 'developer',
    name: d.name || d.username,
    username: d.username,
    avatar: d.avatar,
    role: d.overall_level
      ? `${d.overall_level} Developer`
      : 'Software Developer',
    profession: 'Software Engineering',
    location: d.location || d.country,
    bio: undefined,
    skills: [],
    githubScore: d.overall_score,
    githubLevel: d.overall_level,
    primaryLanguages: d.primary_languages || [],
    githubUrl: d.github_url || `https://github.com/${d.username}`,
  };
}

/* ═══════════════════ Component ═══════════════════ */

export default function BrowseTalent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ── Candidates state ── */
  const [candidates, setCandidates] = useState<BrowseCandidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  /* ── Fetch saved count from backend on mount ── */
  useEffect(() => {
    fetchSavedCount()
      .then(setSavedCount)
      .catch(() => { /* ignore — count stays 0 until next save */ });
  }, []);

  /* ── Touch / drag state ── */
  const touchStartRef = useRef<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  /* ── Filter state ── */
  const activeProfession = searchParams.get('profession') || 'All';
  const activeSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(activeSearch);

  /* ── Refs for keyboard handler (avoids stale closures) ── */
  const indexRef = useRef(currentIndex);
  const candidatesRef = useRef(candidates);
  indexRef.current = currentIndex;
  candidatesRef.current = candidates;

  /* ───────────── Fetch & merge candidates ───────────── */

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setCurrentIndex(0);

      const merged: BrowseCandidate[] = [];

      if (activeProfession === 'GitHub Vetted') {
        // ── GitHub Vetted tab: only leaderboard developers ──
        try {
          const lbData = await getLeaderboard({ limit: 100 });
          const devs = (lbData?.data || []).map(normalizeDeveloper);
          // Filter by search if provided
          if (activeSearch) {
            const q = activeSearch.toLowerCase();
            merged.push(
              ...devs.filter(
                (d) =>
                  d.name.toLowerCase().includes(q) ||
                  (d.username && d.username.toLowerCase().includes(q)) ||
                  (d.primaryLanguages || []).some((l) => l.toLowerCase().includes(q)),
              ),
            );
          } else {
            merged.push(...devs);
          }
        } catch {
          // Leaderboard unavailable
        }
      } else {
        // ── All other tabs: only registered talent (no GitHub-only devs) ──
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = { limit: 100, sort: 'score' };
        if (activeProfession !== 'All') params.profession = activeProfession;
        if (activeSearch) params.search = activeSearch;

        const talentData = await talentService.browseTalent(params);
        merged.push(...talentData.talent.map(normalizeTalent));
      }

      // Sort: highest score first (GitHub score or best assessment score)
      merged.sort((a, b) => {
        const sa =
          a.type === 'developer' ? (a.githubScore ?? 0) : (a.bestScore ?? 0);
        const sb =
          b.type === 'developer' ? (b.githubScore ?? 0) : (b.bestScore ?? 0);
        return sb - sa;
      });

      setCandidates(merged);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [activeProfession, activeSearch, toast]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  /* ───────────── Filter helpers ───────────── */

  const updateProfession = (prof: string) => {
    const next = new URLSearchParams();
    if (prof !== 'All') next.set('profession', prof);
    if (activeSearch) next.set('search', activeSearch);
    setSearchParams(next);
  };

  const handleSearch = () => {
    const next = new URLSearchParams(searchParams);
    const trimmed = searchInput.trim();
    if (trimmed) next.set('search', trimmed);
    else next.delete('search');
    setSearchParams(next);
  };

  const clearSearch = () => {
    setSearchInput('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  /* ───────────── Swipe logic ───────────── */

  const doSwipe = useCallback(
    (direction: 'left' | 'right') => {
      const idx = indexRef.current;
      const cands = candidatesRef.current;
      if (idx >= cands.length) return;

      setSwipeDirection(direction);

      if (direction === 'right') {
        const candidate = cands[idx];
        const identifier = candidate.username || candidate.profileId || candidate.id;

        // Optimistic count bump
        setSavedCount((prev) => prev + 1);

        saveDeveloper(identifier)
          .then(() => {
            toast({ title: `${candidate.name} saved!`, description: 'Added to your saved list' });
          })
          .catch((err) => {
            // Roll back on failure
            setSavedCount((prev) => Math.max(0, prev - 1));
            const msg = err?.response?.data?.error || err?.message || '';
            if (msg === 'Already saved') {
              toast({ title: 'Already saved', description: `${candidate.name} is already in your list` });
            } else {
              toast({ title: 'Save failed', description: msg || 'Could not save developer', variant: 'destructive' });
            }
          });
      }

      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    },
    [toast],
  );

  const doViewProfile = useCallback(() => {
    const idx = indexRef.current;
    const cands = candidatesRef.current;
    if (idx >= cands.length) return;

    const candidate = cands[idx];
    if (candidate.type === 'talent' && candidate.profileId) {
      navigate(`/employer/talent/${candidate.profileId}`);
    } else if (candidate.githubUrl) {
      window.open(candidate.githubUrl, '_blank');
    }
  }, [navigate]);

  /* ───────────── Keyboard controls ───────────── */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') doSwipe('left');
      if (e.key === 'ArrowRight') doSwipe('right');
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        doViewProfile();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [doSwipe, doViewProfile]);

  /* ───────────── Touch / drag handlers ───────────── */

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    touchStartRef.current = e.targetTouches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current == null) return;
    const current = e.targetTouches[0].clientX;
    setTouchEnd(current);
    setDragOffset(current - touchStartRef.current);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (touchStartRef.current == null || touchEnd == null) {
      setDragOffset(0);
      return;
    }
    const distance = touchStartRef.current - touchEnd;
    if (distance > MIN_SWIPE_DISTANCE) doSwipe('left');
    else if (distance < -MIN_SWIPE_DISTANCE) doSwipe('right');
    setDragOffset(0);
  };

  /* ───────────── Restart ───────────── */
  const handleRestart = () => {
    setCurrentIndex(0);
    fetchCandidates();
  };

  /* ───────────── Derived state ───────────── */
  const current = candidates[currentIndex] ?? null;
  const isFinished = !loading && currentIndex >= candidates.length;

  /* ═══════════════════ Render ═══════════════════ */

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">Browse Talent</h1>
            <p className="text-body-sm text-gray-500 mt-0.5">
              Swipe through verified talent across all professions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.SAVED_DEVELOPERS)}
            className="flex items-center gap-2 w-full sm:w-auto justify-center hover:shadow-sm transition-all"
          >
            <Bookmark className="w-4 h-4" />
            Saved ({savedCount})
          </Button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* ── Profession pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin mb-2">
          {PROFESSIONS.map((prof) => (
            <button
              key={prof}
              onClick={() => updateProfession(prof)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                prof === 'GitHub Vetted'
                  ? activeProfession === prof
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-800/10 text-gray-800 border border-gray-300 hover:bg-gray-800/20'
                  : activeProfession === prof
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {prof === 'GitHub Vetted' && <Github className="w-3.5 h-3.5" />}
              {prof}
            </button>
          ))}
        </div>

        {/* ── Search bar ── */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name or skill…"
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
          {activeSearch && (
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* ────────── Main swipe area ────────── */}
        <div className="max-w-xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
              <div className="w-64 h-80 skeleton rounded-2xl mb-6" />
              <div className="flex gap-6">
                <div className="w-16 h-16 skeleton rounded-full" />
                <div className="w-12 h-12 skeleton rounded-full" />
                <div className="w-16 h-16 skeleton rounded-full" />
              </div>
            </div>
          ) : isFinished && candidates.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 animate-float">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No talent found
              </h3>
              <p className="text-gray-500 max-w-sm">
                {activeProfession === 'GitHub Vetted'
                  ? 'No GitHub-vetted engineers found. Engineers analyzed via GitHub will appear here.'
                  : activeProfession !== 'All' || activeSearch
                    ? 'Try a different profession or search query.'
                    : 'Registered talent will appear here once they create an account.'}
              </p>
            </div>
          ) : isFinished ? (
            /* ── All reviewed ── */
            <div className="text-center bg-white rounded-2xl shadow-xl p-8 sm:p-12 animate-scale-in">
              <div className="text-5xl sm:text-6xl mb-4">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                You've reviewed all candidates!
              </h2>
              <p className="text-gray-600 mb-8">
                {savedCount > 0
                  ? `You saved ${savedCount} candidate${savedCount !== 1 ? 's' : ''}.`
                  : 'Browse again or try a different profession.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate(ROUTES.SAVED_DEVELOPERS)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm active:scale-[0.97] transition-all"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  View Saved
                </Button>
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Browse Again
                </Button>
              </div>
            </div>
          ) : (
            /* ── Active swiping ── */
            <>
              {/* Progress bar */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Candidate {currentIndex + 1} of {candidates.length}
                  {activeProfession !== 'All' && (
                    <span className="text-gray-400"> · {activeProfession}</span>
                  )}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / candidates.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Swipe card wrapper — matches BrowseDevelopers animation */}
              <div
                className={`${
                  swipeDirection === 'left'
                    ? 'transition-all duration-300 -translate-x-full opacity-0'
                    : swipeDirection === 'right'
                      ? 'transition-all duration-300 translate-x-full opacity-0'
                      : isDragging
                        ? ''
                        : 'transition-all duration-200'
                }`}
                style={
                  isDragging
                    ? {
                        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                        opacity: Math.max(0.5, 1 - Math.abs(dragOffset) / 400),
                      }
                    : undefined
                }
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {current && <TalentSwipeCard candidate={current} />}
              </div>

              {/* Drag direction indicator */}
              {isDragging && Math.abs(dragOffset) > 30 && (
                <div className="flex justify-center mt-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      dragOffset > 0 ? 'text-blue-500' : 'text-red-400'
                    }`}
                  >
                    {dragOffset > 0 ? '→ Save' : '← Skip'}
                  </span>
                </div>
              )}

              {/* Action Buttons — matches BrowseDevelopers style */}
              <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 mt-6 sm:mt-8">
                {/* Skip */}
                <button
                  onClick={() => doSwipe('left')}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-[3px] sm:border-4 border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  title="Skip (←)"
                >
                  <X className="w-8 h-8 sm:w-10 sm:h-10" />
                </button>

                {/* View Profile */}
                <button
                  onClick={doViewProfile}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-[3px] sm:border-4 border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  title="View Profile (↑)"
                >
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                {/* Save */}
                <button
                  onClick={() => doSwipe('right')}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-[3px] sm:border-4 border-blue-600 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  title="Save (→)"
                >
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10" />
                </button>
              </div>

              {/* Keyboard hint */}
              <div className="text-center mt-4 text-xs text-gray-400">
                <span className="hidden sm:inline">
                  ← Skip · ↑ View Profile · → Save
                </span>
                <span className="sm:hidden">
                  Swipe left to skip · right to save
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
