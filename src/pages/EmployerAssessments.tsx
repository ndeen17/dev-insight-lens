import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Clock,
  HelpCircle,
  BarChart3,
  ClipboardList,
  Loader2,
  MoreVertical,
  Trash2,
  Eye,
  Send,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import { SkeletonList } from '@/components/Skeletons';
import type { Assessment } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

const EmployerAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessments();
      setAssessments(data.assessments);
    } catch {
      toast({ title: 'Error', description: 'Failed to load assessments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await assessmentService.deleteAssessment(id);
      setAssessments((prev) => prev.filter((a) => a._id !== id));
      toast({ title: 'Assessment archived' });
    } catch {
      toast({ title: 'Error', description: 'Failed to archive assessment', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Create skill assessments and invite freelancers to prove their expertise
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.CREATE_ASSESSMENT)}
            className="bg-green-400 hover:bg-green-500 text-black font-bold shadow-sm active:scale-[0.97] transition-all w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-8">
        {loading ? (
          <SkeletonList count={3} />
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 animate-float">
              <ClipboardList className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No assessments yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Create your first assessment template to start evaluating freelancer skills with AI.
            </p>
            <Button
              onClick={() => navigate(ROUTES.CREATE_ASSESSMENT)}
              className="bg-green-400 hover:bg-green-500 text-black font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {assessments.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/employer/assessments/${a._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{a.title}</h3>
                      <Badge className={`text-xs ${difficultyColors[a.difficulty] || ''}`}>
                        {a.difficulty}
                      </Badge>
                    </div>
                    {a.description && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{a.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {a.profession}
                        {a.role ? ` — ${a.role}` : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {a.questionCount} questions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {a.timeLimitMinutes} min
                      </span>
                    </div>
                    {a.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {a.skills.slice(0, 5).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs py-0">
                            {s}
                          </Badge>
                        ))}
                        {a.skills.length > 5 && (
                          <span className="text-xs text-gray-400">+{a.skills.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/employer/assessments/${a._id}`); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/employer/assessments/${a._id}?invite=true`); }}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Invitation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); handleDelete(a._id); }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployerAssessments;
