import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Loader2,
  Send,
  Clock,
  HelpCircle,
  BarChart3,
  Mail,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import { SkeletonProfile } from '@/components/Skeletons';
import type { Assessment, AssessmentInvitation, AssessmentSession } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

const diffBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

const statusBadge: Record<string, { cls: string; label: string }> = {
  pending: { cls: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  accepted: { cls: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  completed: { cls: 'bg-green-100 text-green-700', label: 'Completed' },
  expired: { cls: 'bg-gray-100 text-gray-500', label: 'Expired' },
  declined: { cls: 'bg-red-100 text-red-700', label: 'Declined' },
};

type Tab = 'details' | 'invitations' | 'results';

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [invitations, setInvitations] = useState<AssessmentInvitation[]>([]);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('details');

  // Invite dialog
  const [inviteOpen, setInviteOpen] = useState(searchParams.get('invite') === 'true');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSending, setInviteSending] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [a, invs, sess] = await Promise.all([
        assessmentService.getAssessment(id),
        assessmentService.getInvitations(),
        assessmentService.getSessions({ assessmentId: id }),
      ]);
      setAssessment(a);
      // Filter invitations that belong to this assessment
      setInvitations(
        invs.filter((inv) => {
          const aId = typeof inv.assessment === 'object' ? inv.assessment._id : inv.assessment;
          return aId === id;
        })
      );
      setSessions(sess);
    } catch {
      toast({ title: 'Error', description: 'Failed to load assessment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !id) return;
    setInviteSending(true);
    try {
      await assessmentService.sendInvitation({
        assessmentId: id,
        freelancerEmail: inviteEmail.trim(),
        message: inviteMessage.trim() || undefined,
      });
      toast({ title: 'Invitation sent!' });
      setInviteOpen(false);
      setInviteEmail('');
      setInviteMessage('');
      setSearchParams({});
      fetchAll();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send invitation';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setInviteSending(false);
    }
  };

  // ── Loading / not-found ────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout userRole="BusinessOwner">
        <SkeletonProfile />
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout userRole="BusinessOwner">
        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-600">Assessment not found</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)}>
            Back to Assessments
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{assessment.title}</h1>
                <Badge className={`${diffBadge[assessment.difficulty]}`}>
                  {assessment.difficulty}
                </Badge>
              </div>
              {assessment.description && (
                <p className="text-gray-500 mt-1 max-w-xl">{assessment.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {assessment.profession}{assessment.role ? ` — ${assessment.role}` : ''}
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
            </div>
          </div>
          <Button
            onClick={() => setInviteOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm active:scale-[0.97] transition-all w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Invitation
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 -mb-px">
          {([
            { key: 'details' as Tab, label: 'Details' },
            { key: 'invitations' as Tab, label: `Invitations (${invitations.length})` },
            { key: 'results' as Tab, label: `Results (${sessions.filter((s) => s.status === 'completed').length})` },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                tab === t.key
                  ? 'bg-white border border-b-white border-gray-200 text-gray-900 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-8">
        {/* ── Details Tab ──────────────────────────────────────── */}
        {tab === 'details' && (
          <div className="max-w-2xl space-y-6">
            {assessment.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Skills Tested</h3>
                <div className="flex flex-wrap gap-2">
                  {assessment.skills.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg border p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Invitations</p>
                <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter((s) => s.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const completed = sessions.filter((s) => s.status === 'completed' && s.score != null);
                    if (completed.length === 0) return '—';
                    const avg = completed.reduce((sum, s) => sum + (s.score || 0), 0) / completed.length;
                    return `${Math.round(avg)}%`;
                  })()}
                </p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invitations.filter((i) => i.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Invitations Tab ──────────────────────────────────── */}
        {tab === 'invitations' && (
          <div className="space-y-3">
            {invitations.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No invitations sent yet.</p>
                <Button
                  variant="outline"
                  onClick={() => setInviteOpen(true)}
                  className="mt-4"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send First Invitation
                </Button>
              </div>
            ) : (
              invitations.map((inv) => {
                const st = statusBadge[inv.status] || statusBadge.pending;
                const fl = typeof inv.freelancer === 'object' ? inv.freelancer : null;
                return (
                  <div
                    key={inv._id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {fl ? `${fl.firstName} ${fl.lastName}` : inv.freelancerEmail}
                        </p>
                        {fl && <p className="text-xs text-gray-500">{fl.email}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={st.cls}>{st.label}</Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Results Tab ──────────────────────────────────────── */}
        {tab === 'results' && (
          <div className="space-y-3">
            {sessions.filter((s) => s.status === 'completed').length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No results yet.</p>
              </div>
            ) : (
              sessions
                .filter((s) => s.status === 'completed')
                .map((s) => {
                  const fl = typeof s.freelancer === 'object' ? s.freelancer as any : null;
                  return (
                    <div
                      key={s._id}
                      className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate(`/employer/assessments/results/${s._id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {fl ? `${fl.firstName} ${fl.lastName}` : 'Freelancer'}
                          </p>
                          {fl?.email && <p className="text-xs text-gray-500">{fl.email}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{s.score ?? '—'}%</p>
                          <p className="text-xs text-gray-400">
                            {s.timeSpentSeconds
                              ? `${Math.round(s.timeSpentSeconds / 60)}m`
                              : '—'}
                          </p>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* ── Send Invitation Dialog ─────────────────────────────── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Assessment Invitation</DialogTitle>
            <DialogDescription>
              Invite a freelancer to take <span className="font-medium">{assessment.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="inviteEmail">Freelancer Email <span className="text-red-500">*</span></Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="freelancer@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inviteMsg">Personal Message (optional)</Label>
              <Textarea
                id="inviteMsg"
                placeholder="Hi! I'd love to see your skills…"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={3}
                maxLength={500}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendInvite}
              disabled={!inviteEmail.trim() || inviteSending}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {inviteSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
