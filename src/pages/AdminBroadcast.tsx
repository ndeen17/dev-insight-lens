import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Megaphone, Send, Loader2, CheckCircle, Users } from 'lucide-react';

type TargetRole = 'all' | 'BusinessOwner' | 'Freelancer';

const AdminBroadcast = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<TargetRole>('all');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ count: number } | null>(null);
  const [error, setError] = useState('');

  const canSend = title.trim().length > 0 && message.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setSending(true);
      setError('');
      setSent(null);
      const res = await apiClient.post('/api/admin/broadcast', {
        title: title.trim(),
        message: message.trim(),
        targetRole,
      });
      setSent({ count: res.data.recipientCount });
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  const roleOptions: { value: TargetRole; label: string; desc: string }[] = [
    { value: 'all', label: 'All Users', desc: 'Send to every active user' },
    { value: 'BusinessOwner', label: 'Employers', desc: 'Business owners only' },
    { value: 'Freelancer', label: 'Freelancers', desc: 'Freelancers only' },
  ];

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">System Broadcast</h1>
            <p className="text-sm text-gray-500">Send an announcement to all users</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-2xl space-y-6">
        {/* Success message */}
        {sent && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in-up">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">
              Broadcast sent to <strong>{sent.count}</strong> user{sent.count !== 1 ? 's' : ''} successfully.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Target Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Target Audience</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTargetRole(opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  targetRole === opt.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className={`w-4 h-4 ${targetRole === opt.value ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${targetRole === opt.value ? 'text-blue-600' : 'text-gray-900'}`}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled Maintenance Tonight"
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">{title.length}/200</p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your announcement..."
            maxLength={2000}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">{message.length}/2000</p>
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
          ) : (
            <><Send className="w-5 h-5" /> Send Broadcast</>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminBroadcast;
