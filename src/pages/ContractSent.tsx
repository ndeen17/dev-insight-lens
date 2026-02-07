import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Clock, 
  FileText, 
  Copy, 
  Check,
  PartyPopper
} from 'lucide-react';

interface ContractSentState {
  contractId: string;
  contractName: string;
  recipientEmail: string;
  contractType: 'fixed' | 'hourly';
  amount: string;
  currency: string;
  milestoneCount?: number;
}

export default function ContractSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const state = location.state as ContractSentState | null;

  // Redirect if no state (direct URL access)
  useEffect(() => {
    if (!state?.contractId) {
      const dashboardPath = user?.role === 'BusinessOwner' 
        ? '/employer/dashboard' 
        : '/freelancer/dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [state, navigate, user]);

  if (!state?.contractId) return null;

  const dashboardPath = user?.role === 'BusinessOwner' 
    ? '/employer/dashboard' 
    : '/freelancer/dashboard';

  const contractUrl = `${window.location.origin}/contracts/${state.contractId}/respond`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(contractUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = contractUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Success animation area */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-[#84cc16]/10 rounded-full flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
              <CheckCircle2 className="w-12 h-12 text-[#84cc16]" />
            </div>
            <PartyPopper className="absolute -top-1 -right-2 w-6 h-6 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contract Sent!</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Your contract has been sent to <span className="font-medium text-gray-700">{state.recipientEmail}</span>. 
            They'll receive an email notification shortly.
          </p>
        </div>

        {/* Contract summary card */}
        <Card className="border border-gray-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{state.contractName}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Sent to
                </span>
                <span className="font-medium text-gray-700">{state.recipientEmail}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Type
                </span>
                <span className="font-medium text-gray-700">
                  {state.contractType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Amount
                </span>
                <span className="font-semibold text-gray-900">{state.currency} {state.amount}</span>
              </div>

              {state.milestoneCount && state.milestoneCount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Milestones</span>
                  <span className="font-medium text-gray-700">{state.milestoneCount}</span>
                </div>
              )}
            </div>

            {/* Status indicator */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
                </span>
                <span className="text-gray-600">Waiting for <span className="font-medium">{state.recipientEmail}</span> to respond</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share link */}
        <Card className="border border-gray-200 shadow-sm mb-6">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-2">Share contract link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 truncate font-mono">
                {contractUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 mr-1 text-green-600" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What happens next */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">What happens next?</h4>
          <div className="space-y-3">
            {[
              { step: '1', text: 'An email invitation has been sent to the recipient' },
              { step: '2', text: 'They can review the contract details and your message' },
              { step: '3', text: 'They\'ll accept or decline — you\'ll be notified instantly' },
              { step: '4', text: 'Once accepted, the contract becomes active and work can begin' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center text-xs font-bold">
                  {item.step}
                </span>
                <p className="text-sm text-gray-600 pt-0.5">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate(dashboardPath)}
            className="w-full bg-[#84cc16] hover:bg-[#65a30d] text-white h-11 font-semibold"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(
              user?.role === 'BusinessOwner' 
                ? '/employer/contracts/create' 
                : '/freelancer/contracts/create'
            )}
            className="w-full h-11"
          >
            Create Another Contract
          </Button>
        </div>
      </div>
    </div>
  );
}
