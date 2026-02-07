import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ClipboardList,
  Clock,
  HelpCircle,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import { SkeletonList } from '@/components/Skeletons';
import type { AssessmentInvitation, Assessment, AssessmentSession } from '@/types/assessment';

const statusConfig: Record<string, { cls: string; label: string; Icon: any }> = {
  pending: { cls: 'bg-yellow-100 text-yellow-700', label: 'Pending', Icon: Clock },
  accepted: { cls: 'bg-blue-100 text-blue-700', label: 'In Progress', Icon: ArrowRight },
  completed: { cls: 'bg-green-100 text-green-700', label: 'Completed', Icon: CheckCircle2 },
  expired: { cls: 'bg-gray-100 text-gray-500', label: 'Expired', Icon: AlertTriangle },
  declined: { cls: 'bg-red-100 text-red-700', label: 'Declined', Icon: XCircle },
};

type FilterKey = 'all' | 'pending' | 'completed' | 'declined';

const FreelancerAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<AssessmentInvitation[]>([]);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    (async () => {
      try {
        const [invs, sess] = await Promise.all([
          assessmentService.getInvitations(),
          assessmentService.getSessions(),
        ]);
        setInvitations(invs);
        setSessions(sess);
      } catch {
        toast({ title: 'Error', description: 'Failed to load assessments', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const filtered = filter === 'all'
    ? invitations
    : invitations.filter((i) => i.status === filter);

  // Map invitationId → session for quick lookup
  const sessionByInvitation = new Map(
    sessions.map((s) => [s.invitation, s])
  );

  const handleAction = (inv: AssessmentInvitation) => {
    if (inv.status === 'pending') {
      navigate(`/assessment/invite/${inv.inviteToken}`);
    } else if (inv.status === 'accepted') {
      // Find in-progress session
      const sess = sessionByInvitation.get(inv._id);
      if (sess) navigate(`/assessment/session/${sess._id}`);
    } else if (inv.status === 'completed') {
      const sess = sessionByInvitation.get(inv._id);
      if (sess) navigate(`/assessment/session/${sess._id}`);
    }
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'declined', label: 'Declined' },
  ];

  return (
    <DashboardLayout userRole="Freelancer">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-5 sm:py-6">
        <div>
          <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">My Assessments</h1>
          <p className="text-body-sm text-gray-500 mt-0.5">View invitations and track your assessment results</p>
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.key)}
              className={filter === f.key ? 'bg-black text-white' : ''}
            >
              {f.label}
              {f.key !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  {invitations.filter((i) => f.key === 'all' || i.status === f.key).length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-8">
        {loading ? (
          <SkeletonList count={3} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 animate-float">
              <ClipboardList className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No assessments</h3>
            <p className="text-gray-500 max-w-sm">
              When employers invite you to skill assessments, they'll show up here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((inv) => {
              const assessment = typeof inv.assessment === 'object' ? (inv.assessment as Assessment) : null;
              const employer = typeof inv.employer === 'object' ? inv.employer : null;
              const st = statusConfig[inv.status] || statusConfig.pending;
              const sess = sessionByInvitation.get(inv._id);

              return (
                <div
                  key={inv._id}
                  onClick={() => handleAction(inv)}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {assessment?.title || 'Assessment'}
                        </h3>
                        <Badge className={st.cls}>{st.label}</Badge>
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        From{' '}
                        {employer
                          ? `${employer.firstName} ${employer.lastName}${employer.companyName ? ` (${employer.companyName})` : ''}`
                          : 'an employer'}
                      </p>

                      {assessment && (
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {assessment.profession}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            {assessment.questionCount} questions
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {assessment.timeLimitMinutes} min
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {inv.status === 'completed' && sess?.score != null && (
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              sess.score >= 80
                                ? 'text-green-600'
                                : sess.score >= 60
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {sess.score}%
                          </p>
                        </div>
                      )}
                      {(inv.status === 'pending' || inv.status === 'accepted') && (
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      )}
                      {inv.status === 'completed' && (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FreelancerAssessments;
