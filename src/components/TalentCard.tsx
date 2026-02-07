import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award, ClipboardCheck, User } from 'lucide-react';
import type { TalentProfile } from '@/types/talent';

interface TalentCardProps {
  talent: TalentProfile;
}

const scoreColor = (s: number) =>
  s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

const scoreBg = (s: number) =>
  s >= 80 ? 'bg-green-50 border-green-200' : s >= 60 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

export default function TalentCard({ talent }: TalentCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/employer/talent/${talent._id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          {talent.profilePicture ? (
            <img
              src={talent.profilePicture}
              alt={`${talent.firstName} ${talent.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 group-hover:text-black truncate">
              {talent.firstName} {talent.lastName}
            </h3>
            {talent.bestScore != null && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${scoreBg(
                  talent.bestScore
                )} ${scoreColor(talent.bestScore)}`}
              >
                <Award className="w-3 h-3" />
                {talent.bestScore}%
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {talent.professionalRole || talent.profession}
            {talent.country && (
              <span className="inline-flex items-center gap-1 ml-2 text-gray-400">
                <MapPin className="w-3 h-3" />
                {talent.country}
              </span>
            )}
          </p>

          {talent.bio && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{talent.bio}</p>
          )}

          {/* Skills */}
          {talent.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {talent.skills.slice(0, 6).map((s) => (
                <Badge key={s} variant="outline" className="text-xs py-0">
                  {s}
                </Badge>
              ))}
              {talent.skills.length > 6 && (
                <span className="text-xs text-gray-400">+{talent.skills.length - 6}</span>
              )}
            </div>
          )}

          {/* Assessment stats */}
          {talent.assessmentCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ClipboardCheck className="w-3.5 h-3.5" />
              {talent.assessmentCount} assessment{talent.assessmentCount !== 1 ? 's' : ''} completed
              {talent.avgScore != null && ` · Avg ${talent.avgScore}%`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
