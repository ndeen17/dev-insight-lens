import { Badge } from '@/components/ui/badge';
import { MapPin, ClipboardCheck, User } from 'lucide-react';
import type { BrowseCandidate } from '@/types/talent';

/* ── Profession → gradient colour map ── */
const professionGradients: Record<string, string> = {
  'Software Engineering': 'from-blue-600 to-blue-700',
  Marketing: 'from-purple-600 to-fuchsia-700',
  Design: 'from-pink-500 to-rose-600',
  Finance: 'from-emerald-600 to-teal-700',
  Writing: 'from-amber-500 to-orange-600',
  'Project Management': 'from-indigo-600 to-violet-700',
  'Data Analysis': 'from-cyan-600 to-blue-700',
  'Customer Service': 'from-orange-500 to-red-600',
};

/* ── Score-colour helpers (assessment 0-100 scale) ── */
const scoreColor = (s: number) =>
  s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';
const scoreBg = (s: number) =>
  s >= 80
    ? 'bg-green-50 border-green-200'
    : s >= 60
      ? 'bg-amber-50 border-amber-200'
      : 'bg-red-50 border-red-200';

interface TalentSwipeCardProps {
  candidate: BrowseCandidate;
}

/* ─── GitHub icon SVG (same as BrowseDevelopers) ─── */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default function TalentSwipeCard({ candidate }: TalentSwipeCardProps) {
  const gradient =
    professionGradients[candidate.profession] || 'from-gray-600 to-gray-700';

  /* ═══════════════ Developer card (BrowseDevelopers style) ═══════════════ */
  if (candidate.type === 'developer') {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden select-none">
        {/* Avatar & Header — matches BrowseDevelopers exactly */}
        <div className={`bg-gradient-to-br ${gradient} p-6 sm:p-8 md:p-10 text-white`}>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {candidate.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.username}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-white shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-white shadow-lg flex-shrink-0 bg-white/10 flex items-center justify-center">
                <User className="w-10 h-10 text-white/70" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
                {candidate.name}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base truncate">
                @{candidate.username}
              </p>
              {candidate.location && (
                <p className="text-blue-100 text-xs sm:text-sm mt-1 truncate">
                  📍 {candidate.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats — matches BrowseDevelopers exactly */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-100">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                {candidate.githubLevel}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Skill Level
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-100">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                {candidate.githubScore}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Overall Score
              </div>
            </div>
          </div>

          {/* Languages */}
          {candidate.primaryLanguages && candidate.primaryLanguages.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-3">
                Primary Languages
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {candidate.primaryLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 sm:px-3 py-1 bg-blue-600 text-white rounded-full text-xs sm:text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Link */}
          {candidate.githubUrl && (
            <a
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
            >
              <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">View GitHub Profile</span>
              <span className="sm:hidden">GitHub</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════ Talent card (assessment-based freelancers) ═══════════════ */
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden select-none">
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${gradient} p-6 sm:p-8 md:p-10 text-white relative`}>
        {/* Verified badge */}
        {candidate.assessmentCount != null && candidate.assessmentCount > 0 && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Assessment Verified
            </span>
          </div>
        )}

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Avatar */}
          {candidate.avatar ? (
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-white shadow-lg flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-white shadow-lg flex-shrink-0 bg-white/10 flex items-center justify-center">
              <User className="w-10 h-10 text-white/70" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {candidate.name}
            </h2>
            <p className="text-white/80 text-sm sm:text-base truncate">
              {candidate.role}
            </p>
            {candidate.location && (
              <p className="text-white/80 text-xs sm:text-sm mt-1 truncate">
                📍 {candidate.location}
              </p>
            )}
            {candidate.username && (
              <p className="text-white/60 text-xs mt-0.5 truncate">
                @{candidate.username}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 md:p-10">
        {/* Assessment stats */}
        {candidate.assessmentCount != null && candidate.assessmentCount > 0 ? (
          <div className="grid grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {candidate.bestScore != null && (
              <div className={`rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 ${scoreBg(candidate.bestScore)}`}>
                <div className={`text-2xl sm:text-3xl font-bold ${scoreColor(candidate.bestScore)}`}>
                  {candidate.bestScore}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Best Score</div>
              </div>
            )}
            {candidate.avgScore != null && (
              <div className="rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-gray-100 bg-gray-50">
                <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {candidate.avgScore}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg Score</div>
              </div>
            )}
            <div className="rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-gray-100 bg-gray-50">
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                {candidate.assessmentCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Assessments</div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-5 border-2 border-dashed border-gray-200 bg-gray-50 text-center mb-6 sm:mb-8">
            <p className="text-sm text-gray-400">No assessment data yet</p>
          </div>
        )}

        {/* Skills */}
        {candidate.skills.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {candidate.skills.slice(0, 8).map((s) => (
                <Badge key={s} variant="outline" className="text-xs sm:text-sm">
                  {s}
                </Badge>
              ))}
              {candidate.skills.length > 8 && (
                <span className="text-xs text-gray-400 self-center">
                  +{candidate.skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {candidate.bio && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-6">
            {candidate.bio}
          </p>
        )}

        {/* GitHub link if available */}
        {candidate.githubUrl && (
          <a
            href={candidate.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
          >
            <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">View GitHub Profile</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        )}
      </div>
    </div>
  );
}
