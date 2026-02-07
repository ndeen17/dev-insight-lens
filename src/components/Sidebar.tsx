import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { useUser, UserButton } from '@clerk/clerk-react';
import NotificationBell from '@/components/NotificationBell';
import { 
  Clock, 
  CheckCircle2, 
  Archive, 
  DollarSign, 
  ShieldCheck,
  Plus,
  Menu,
  X,
  FileText,
  Inbox,
  Users,
  Bookmark,
  Trophy,
  ChevronDown,
  ChevronRight,
  Wallet,
  ClipboardList,
  Settings
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'BusinessOwner' | 'Freelancer';
}

export default function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [talentSectionOpen, setTalentSectionOpen] = useState(true);

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (userRole === 'BusinessOwner') {
      return {
        contracts: [
          { 
            name: 'Pending', 
            path: '/employer/dashboard?filter=pending', 
            icon: Clock,
            count: 0 // Will be populated dynamically
          },
          { 
            name: 'Active', 
            path: '/employer/dashboard?filter=active', 
            icon: CheckCircle2,
            count: 0 
          },
          { 
            name: 'Archived', 
            path: '/employer/dashboard?filter=archived', 
            icon: Archive,
            count: 0 
          },
          { 
            name: 'Payments', 
            path: '/employer/dashboard?filter=payments', 
            icon: ShieldCheck 
          },
        ],
        talent: [
          { name: 'Browse Talent', icon: Users, path: ROUTES.BROWSE_TALENT },
          { name: 'GitHub Leaderboard', icon: Trophy, path: ROUTES.LEADERBOARD },
          { name: 'Saved Developers', icon: Bookmark, path: ROUTES.SAVED_DEVELOPERS },
        ],
        assessments: [
          { name: 'All Assessments', icon: ClipboardList, path: ROUTES.EMPLOYER_ASSESSMENTS },
        ],
      };
    } else {
      // Freelancer navigation
      return {
        contracts: [
          { 
            name: 'Pending Offers', 
            path: '/freelancer/dashboard?filter=pending', 
            icon: Inbox,
            count: 0 
          },
          { 
            name: 'Active', 
            path: '/freelancer/dashboard?filter=active', 
            icon: CheckCircle2,
            count: 0 
          },
          { 
            name: 'Completed', 
            path: '/freelancer/dashboard?filter=completed', 
            icon: FileText,
          count: 0 
        },
        { 
          name: 'Payments', 
          path: '/freelancer/dashboard?filter=payments', 
          icon: ShieldCheck 
        },
        {
          name: 'Withdrawals',
          path: ROUTES.WITHDRAWALS,
          icon: Wallet
        },
      ]
      };
    }
  };

  const navItems = getNavigationItems();

  const isActive = (path: string) => {
    const currentPath = location.pathname + location.search;
    return currentPath === path || location.search.includes(path.split('?')[1]);
  };

  const handleCreateContract = () => {
    if (userRole === 'BusinessOwner') {
      navigate(ROUTES.CREATE_CONTRACT);
    } else {
      navigate(ROUTES.CREATE_CONTRACT_FREELANCER);
    }
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo + Notifications */}
      <div className="px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">Artemis</span>
        </Link>
        <NotificationBell />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {/* Contracts Section */}
        <div className="mb-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Contracts
          </h3>
          {navItems.contracts?.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  active
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
        </div>

        {/* Find Talent Section (only for Business Owners) */}
        {userRole === 'BusinessOwner' && navItems.talent && (
          <div className="mb-6">
            <button
              onClick={() => setTalentSectionOpen(!talentSectionOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
            >
              <span>Find Talent</span>
              {talentSectionOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {talentSectionOpen && (
              <div className="mt-1 space-y-1">
                {navItems.talent.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Assessments Section (Employer) */}
        {userRole === 'BusinessOwner' && navItems.assessments && (
          <div className="mb-6">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Assessments
            </h3>
            <div className="space-y-1">
              {navItems.assessments.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Assessments Section (Freelancer) */}
        {userRole === 'Freelancer' && (
          <div className="mb-6">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Assessments
            </h3>
            <Link
              to={ROUTES.ASSESSMENT_INVITATIONS}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                location.pathname === ROUTES.ASSESSMENT_INVITATIONS
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span>My Assessments</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Create Contract Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleCreateContract}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-black font-bold bg-green-400 hover:bg-green-500 active:scale-[0.97] rounded-lg transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Contract</span>
        </button>
      </div>

      {/* Settings Link */}
      <div className="px-4 pb-4">
        <Link
          to={ROUTES.SETTINGS}
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
            location.pathname === ROUTES.SETTINGS
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userRole === 'BusinessOwner' ? 'Business Owner' : 'Freelancer'}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-900" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {/* Mobile Sidebar - Slide-in overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Slide-in menu */}
          <aside className="md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-2xl animate-slide-in-left">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
