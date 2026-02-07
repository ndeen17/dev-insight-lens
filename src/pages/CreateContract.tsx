import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import CategoryDropdown from '@/components/CategoryDropdown';
import BackToDashboard from '@/components/BackToDashboard';
import { 
  Calendar, DollarSign, Clock, Plus, X, AlertCircle, ArrowLeft, Check, 
  FileText, Info, Briefcase, Target, ChevronRight, Edit2, Send, CreditCard, ShieldCheck, Loader2
} from 'lucide-react';

interface Milestone {
  name: string;
  budget: string;
  dueDate: string;
}

interface ContractDraft {
  contractName: string;
  contributorEmail: string;
  category: string;
  subcategory: string;
  description: string;
  contractType: 'fixed' | 'hourly';
  budget: string;
  currency: string;
  milestones: Milestone[];
  splitMilestones: boolean;
  hourlyRate: string;
  weeklyLimit: string;
  noLimit: boolean;
  recipientMessage: string;
  agreedToTerms: boolean;
  savedAt: string;
}

const PLATFORM_FEE_PERCENTAGE = 3.6;

export default function CreateContract() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [contractName, setContractName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState<'fixed' | 'hourly'>('fixed');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [splitMilestones, setSplitMilestones] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: '', budget: '', dueDate: '' }
  ]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [weeklyLimit, setWeeklyLimit] = useState('');
  const [noLimit, setNoLimit] = useState(false);
  const [draftContractId, setDraftContractId] = useState<string | null>(null);
  
  // Review step state
  const [recipientMessage, setRecipientMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Pre-fill email from location state (e.g., from Leaderboard hire button)
  useEffect(() => {
    if (location.state?.freelancerEmail) {
      setContributorEmail(location.state.freelancerEmail);
    }
  }, [location.state]);

  const [showDraftToast, setShowDraftToast] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('contractDraft');
    if (savedDraft) {
      try {
        const draft: ContractDraft = JSON.parse(savedDraft);
        const savedAt = new Date(draft.savedAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);
        
        // Only restore draft if saved within 48 hours
        if (hoursDiff < 48) {
          setContractName(draft.contractName);
          setContributorEmail(draft.contributorEmail);
          setCategory(draft.category);
          setSubcategory(draft.subcategory);
          setDescription(draft.description);
          setContractType(draft.contractType);
          setBudget(draft.budget);
          setCurrency(draft.currency);
          setMilestones(draft.milestones);
          setSplitMilestones(draft.splitMilestones);
          setHourlyRate(draft.hourlyRate);
          setWeeklyLimit(draft.weeklyLimit);
          setNoLimit(draft.noLimit);
          setRecipientMessage(draft.recipientMessage || '');
          setAgreedToTerms(draft.agreedToTerms || false);
          setShowDraftToast(true);
          setTimeout(() => setShowDraftToast(false), 5000);
        } else {
          localStorage.removeItem('contractDraft');
        }
      } catch (error) {
        console.error('Failed to restore draft:', error);
      }
    }
  }, []);

  // Auto-save draft whenever form data changes
  useEffect(() => {
    if (contractName || contributorEmail) {
      const draft: ContractDraft = {
        contractName,
        contributorEmail,
        category,
        subcategory,
        description,
        contractType,
        budget,
        currency,
        milestones,
        splitMilestones,
        hourlyRate,
        weeklyLimit,
        noLimit,
        recipientMessage,
        agreedToTerms,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('contractDraft', JSON.stringify(draft));
    }
  }, [contractName, contributorEmail, category, subcategory, description, contractType, budget, currency, milestones, splitMilestones, hourlyRate, weeklyLimit, noLimit, recipientMessage, agreedToTerms]);

  // Save draft to localStorage and backend
  const saveDraft = useCallback(async () => {
    const draft: ContractDraft = {
      contractName,
      contributorEmail,
      category,
      subcategory,
      description,
      contractType,
      budget,
      currency,
      milestones,
      splitMilestones,
      hourlyRate,
      weeklyLimit,
      noLimit,
      recipientMessage,
      agreedToTerms,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('contractDraft', JSON.stringify(draft));

    // Save to backend if there's enough data
    if (contractName && contributorEmail) {
      try {
        const contractData = {
          contractName,
          contributorEmail,
          category: category || undefined,
          subcategory: subcategory || undefined,
          description: description || undefined,
          contractType,
          ...(contractType === 'fixed' ? {
            budget: budget ? parseFloat(budget) : undefined,
            currency,
            splitMilestones,
            milestones: splitMilestones ? milestones
              .filter(m => m.name || m.budget)
              .map(m => ({
                name: m.name,
                budget: m.budget ? parseFloat(m.budget) : 0,
                ...(m.dueDate && { dueDate: new Date(m.dueDate) })
              })) : []
          } : {
            hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
            currency,
            weeklyLimit: noLimit ? null : (weeklyLimit ? parseFloat(weeklyLimit) : undefined)
          }),
          status: 'draft'
        };

        if (draftContractId) {
          const response = await apiClient.put(`/api/contracts/${draftContractId}`, contractData);
          // Draft already tracked
        } else {
          const response = await apiClient.post('/api/contracts', contractData);
          if (response.data.contract?._id) {
            setDraftContractId(response.data.contract._id);
          }
        }
      } catch (error) {
        console.error('Error saving draft to backend:', error);
        // Continue silently - localStorage backup is available
      }
    }
  }, [contractName, contributorEmail, category, subcategory, description, contractType, budget, currency, milestones, splitMilestones, hourlyRate, weeklyLimit, noLimit, recipientMessage, agreedToTerms, draftContractId]);

  // Auto-save to backend (debounced) - saves as draft in pending contracts
  useEffect(() => {
    if (contractName && contributorEmail) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 5000); // Save 5 seconds after user stops typing

      return () => clearTimeout(timer);
    }
  }, [contractName, contributorEmail, category, subcategory, description, contractType, budget, currency, milestones, splitMilestones, hourlyRate, weeklyLimit, noLimit, recipientMessage, agreedToTerms, saveDraft]);

  // Calculate payment summary — uses milestone total when milestones active
  const milestoneTotalBudget = useMemo(
    () => milestones.reduce((sum, m) => sum + (parseFloat(m.budget) || 0), 0),
    [milestones]
  );

  const calculatePayment = () => {
    let amount: number;
    if (contractType === 'fixed') {
      amount = splitMilestones ? milestoneTotalBudget : (parseFloat(budget) || 0);
    } else {
      amount = parseFloat(hourlyRate) || 0;
    }
    const fee = (amount * PLATFORM_FEE_PERCENTAGE) / 100;
    const totalForClient = amount + fee;
    const payoutForFreelancer = amount - fee;

    return { amount, fee, totalForClient, payoutForFreelancer };
  };

  // Keep the top-level budget field in sync when milestones are active
  useEffect(() => {
    if (splitMilestones && contractType === 'fixed') {
      setBudget(milestoneTotalBudget > 0 ? milestoneTotalBudget.toFixed(2) : '');
    }
  }, [milestoneTotalBudget, splitMilestones, contractType]);

  // Budget mismatch detection (for when user manually edits top budget while milestones exist)
  const budgetMismatch = useMemo(() => {
    if (!splitMilestones || contractType !== 'fixed') return false;
    const topBudget = parseFloat(budget) || 0;
    return topBudget > 0 && Math.abs(milestoneTotalBudget - topBudget) > 0.01;
  }, [splitMilestones, contractType, budget, milestoneTotalBudget]);

  // Validation functions
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!contractName.trim()) {
      newErrors.contractName = 'Contract name is required';
    } else if (contractName.length > 70) {
      newErrors.contractName = 'Contract name must be 70 characters or less';
    }
    
    if (!contributorEmail.trim()) {
      newErrors.contributorEmail = 'Contributor email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contributorEmail)) {
      newErrors.contributorEmail = 'Invalid email address';
    } else if (contributorEmail.toLowerCase() === user?.email?.toLowerCase()) {
      newErrors.contributorEmail = "You can't send the contract to yourself";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!category || !subcategory) {
      newErrors.category = 'Please select a category and subcategory';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (contractType === 'fixed') {
      if (splitMilestones) {
        // When milestones are active, budget is derived from them
        if (milestoneTotalBudget <= 0) {
          newErrors.milestones = 'Add at least one milestone with a budget';
        }

        for (let i = 0; i < milestones.length; i++) {
          if (!milestones[i].name.trim()) {
            newErrors[`milestone_${i}_name`] = 'Milestone name is required';
          }
          if (!milestones[i].budget || parseFloat(milestones[i].budget) <= 0) {
            newErrors[`milestone_${i}_budget`] = 'Valid budget required';
          }
          // Due date is optional per-milestone
        }
      } else {
        if (!budget || parseFloat(budget) <= 0) {
          newErrors.budget = 'Budget must be greater than 0';
        }
      }
    } else {
      if (!hourlyRate || parseFloat(hourlyRate) <= 0) {
        newErrors.hourlyRate = 'Hourly rate must be greater than 0';
      }
      
      if (!noLimit && (!weeklyLimit || parseFloat(weeklyLimit) <= 0)) {
        newErrors.weeklyLimit = 'Weekly limit must be greater than 0 or select no limit';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Milestone management
  const handleToggleMilestones = (checked: boolean) => {
    setSplitMilestones(checked);
    if (checked && milestones.length === 0) {
      // Auto-populate first milestone when toggled on
      setMilestones([{ name: '', budget: '', dueDate: '' }]);
    }
  };

  const addMilestone = () => {
    if (milestones.length < 10) {
      setMilestones([...milestones, { name: '', budget: '', dueDate: '' }]);
    }
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  // Navigation handlers
  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      saveDraft();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    await saveDraft();
    alert('Draft saved successfully!');
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      setSendError('Please agree to the terms and conditions to proceed');
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      const contractData = {
        contractName,
        contributorEmail,
        category,
        subcategory,
        description,
        recipientMessage: recipientMessage || undefined,
        contractType,
        ...(contractType === 'fixed' ? {
          budget: parseFloat(budget),
          currency,
          splitMilestones,
          milestones: splitMilestones ? milestones.map(m => ({
            name: m.name,
            budget: parseFloat(m.budget),
            ...(m.dueDate && { dueDate: new Date(m.dueDate) })
          })) : []
        } : {
          hourlyRate: parseFloat(hourlyRate),
          currency,
          weeklyLimit: noLimit ? null : parseFloat(weeklyLimit)
        }),
        status: 'pending'
      };

      let contractId: string;

      if (draftContractId) {
        // Update existing draft to pending
        await apiClient.put(`/api/contracts/${draftContractId}`, contractData);
        await apiClient.patch(`/api/contracts/${draftContractId}/status`, { status: 'pending' });
        contractId = draftContractId;
      } else {
        const response = await apiClient.post('/api/contracts', contractData);
        contractId = response.data.contract._id;
      }

      localStorage.removeItem('contractDraft');
      setDraftContractId(null);

      // Navigate to success page with contract summary
      const amount = contractType === 'fixed'
        ? parseFloat(budget).toFixed(2)
        : `${parseFloat(hourlyRate).toFixed(2)}/hr`;

      navigate('/contract-sent', {
        replace: true,
        state: {
          contractId,
          contractName,
          recipientEmail: contributorEmail,
          contractType,
          amount,
          currency,
          milestoneCount: splitMilestones ? milestones.length : 0,
        },
      });
    } catch (error: any) {
      console.error('Error creating contract:', error);
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to send contract. Please try again.';
      setSendError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const payment = calculatePayment();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <BackToDashboard />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Create New Contract</h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">Set up a contract with your freelancer</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step 
                    ? 'border-[#84cc16] bg-[#84cc16] text-white shadow-sm' 
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-10 sm:w-24 h-1 mx-1 sm:mx-2 transition-all ${
                    currentStep > step ? 'bg-[#84cc16]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 max-w-2xl mx-auto">
            <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-[#84cc16]' : 'text-gray-400'}`}>
              Set Up
            </span>
            <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[#84cc16]' : 'text-gray-400'}`}>
              Description
            </span>
            <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-[#84cc16]' : 'text-gray-400'}`}>
              Budget
            </span>
            <span className={`text-sm font-medium ${currentStep >= 4 ? 'text-[#84cc16]' : 'text-gray-400'}`}>
              Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Contract Setup'}
                  {currentStep === 2 && 'Project Description'}
                  {currentStep === 3 && 'Budget & Terms'}
                  {currentStep === 4 && 'Review Contract'}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Enter basic contract information'}
                  {currentStep === 2 && 'Describe the project scope and requirements'}
                  {currentStep === 3 && 'Set payment terms and milestones'}
                  {currentStep === 4 && 'Review and send your contract'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Setup */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <Label htmlFor="contractName" className="text-base font-semibold">Contract Name *</Label>
                      <Input
                        id="contractName"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                        placeholder="e.g., Website Redesign Project"
                        maxLength={70}
                        className={`mt-2 ${errors.contractName ? 'border-red-500' : ''}`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.contractName && (
                          <p className="text-sm text-red-500">{errors.contractName}</p>
                        )}
                        <p className={`text-xs ml-auto ${contractName.length > 65 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                          {contractName.length}/70
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contributorEmail" className="text-base font-semibold">Freelancer Email *</Label>
                      <div className="relative mt-2">
                        <Input
                          id="contributorEmail"
                          type="email"
                          value={contributorEmail}
                          onChange={(e) => setContributorEmail(e.target.value)}
                          placeholder="freelancer@example.com"
                          className={`pr-10 ${
                            errors.contributorEmail 
                              ? 'border-red-500' 
                              : contributorEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contributorEmail)
                              ? 'border-green-400'
                              : ''
                          }`}
                        />
                        {contributorEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contributorEmail) && !errors.contributorEmail && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      {errors.contributorEmail && (
                        <p className="text-sm text-red-500 mt-1">{errors.contributorEmail}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Step 2: Description */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <Label className="text-base font-semibold">Category & Subcategory *</Label>
                      <CategoryDropdown
                        value={subcategory ? `${category} > ${subcategory}` : category}
                        onChange={(cat, subcat) => {
                          setCategory(cat);
                          setSubcategory(subcat || '');
                        }}
                        error={errors.category}
                      />
                      {errors.category && (
                        <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-semibold">What needs to be done? *</Label>
                      <p className="text-sm text-gray-500 mt-1 mb-2">Describe the project scope, requirements, deliverables, and any specific instructions</p>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Example: I need a complete redesign of my e-commerce website. The project includes updating the homepage, product pages, and checkout flow. All pages should be mobile-responsive and follow our brand guidelines..."
                        rows={10}
                        className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.description && (
                          <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                        <p className={`text-xs ml-auto ${description.length < 50 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                          {description.length} characters {description.length < 50 && `(${50 - description.length} more needed)`}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Budget & Terms */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <Label className="text-base font-semibold">Contract Type *</Label>
                      <p className="text-sm text-gray-500 mt-1 mb-3">Select the payment structure that works best for your project</p>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {/* Fixed Price Card */}
                        <div 
                          onClick={() => setContractType('fixed')}
                          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            contractType === 'fixed' 
                              ? 'border-[#84cc16] bg-[#84cc16]/5 shadow-sm' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              contractType === 'fixed' ? 'bg-[#84cc16] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Target className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Fixed Price</h3>
                                {contractType === 'fixed' && (
                                  <Check className="w-5 h-5 text-[#84cc16]" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Ideal for one-time projects with clear deliverables and defined scope
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Hourly Rate Card */}
                        <div 
                          onClick={() => setContractType('hourly')}
                          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            contractType === 'hourly' 
                              ? 'border-[#84cc16] bg-[#84cc16]/5 shadow-sm' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              contractType === 'hourly' ? 'bg-[#84cc16] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Clock className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Hourly Rate</h3>
                                {contractType === 'hourly' && (
                                  <Check className="w-5 h-5 text-[#84cc16]" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Payments are based on hours worked each week. Perfect for ongoing work
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {contractType === 'fixed' ? (
                      <>
                        {/* Budget & Currency row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="budget">
                              {splitMilestones ? 'Total Budget' : 'Budget'} *
                            </Label>
                            <Input
                              id="budget"
                              type="number"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              placeholder="5000"
                              min="0"
                              step="0.01"
                              readOnly={splitMilestones}
                              className={`${errors.budget ? 'border-red-500' : ''} ${splitMilestones ? 'bg-gray-50 text-gray-600 cursor-default' : ''}`}
                            />
                            {errors.budget && (
                              <p className="text-sm text-red-500 mt-1">{errors.budget}</p>
                            )}
                            {splitMilestones && (
                              <p className="text-xs text-gray-400 mt-1">Auto-calculated from milestones</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Split into milestones toggle */}
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="splitMilestones" className="text-sm font-medium cursor-pointer">
                              Split into milestones
                            </Label>
                            <p className="text-xs text-gray-500">
                              Break the project into funded phases
                            </p>
                          </div>
                          <Switch
                            id="splitMilestones"
                            checked={splitMilestones}
                            onCheckedChange={handleToggleMilestones}
                          />
                        </div>

                        {/* Due Date — only shown when milestones are OFF */}
                        {!splitMilestones && (
                          <div>
                            <Label htmlFor="dueDate">Due Date (optional)</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full"
                            />
                          </div>
                        )}

                        {/* Milestone List — shown when milestones are ON */}
                        {splitMilestones && (
                          <div className="space-y-3">
                            {/* Budget mismatch warning */}
                            {budgetMismatch && (
                              <Alert variant="destructive" className="border-red-300 bg-red-50">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  Milestone total ({currency}&nbsp;{milestoneTotalBudget.toFixed(2)}) doesn't match the
                                  budget above ({currency}&nbsp;{parseFloat(budget || '0').toFixed(2)}).
                                </AlertDescription>
                              </Alert>
                            )}
                            {errors.milestones && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.milestones}</AlertDescription>
                              </Alert>
                            )}

                            {/* Column headers */}
                            <div className="hidden sm:grid grid-cols-[32px_1fr_120px_130px_32px] gap-2 px-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                              <span></span>
                              <span>Milestone</span>
                              <span>Budget ({currency})</span>
                              <span>Due Date (optional)</span>
                              <span></span>
                            </div>

                            {/* Milestone rows */}
                            {milestones.map((milestone, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-[32px_1fr_120px_130px_32px] gap-2 items-center bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-3 sm:p-0"
                              >
                                {/* Index circle */}
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 sm:bg-gray-100 text-xs font-semibold text-gray-500 shrink-0">
                                  {index + 1}
                                </div>

                                {/* Name */}
                                <div className="w-full">
                                  <label className="text-xs text-gray-500 sm:hidden mb-1 block">Milestone Name</label>
                                  <Input
                                  placeholder={`e.g. Phase ${index + 1}`}
                                  value={milestone.name}
                                  onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                                  className={`h-9 text-sm ${errors[`milestone_${index}_name`] ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                                />
                                </div>

                                {/* Budget */}
                                <div className="w-full">
                                  <label className="text-xs text-gray-500 sm:hidden mb-1 block">Budget ({currency})</label>
                                  <Input
                                  type="number"
                                  placeholder="0.00"
                                  value={milestone.budget}
                                  onChange={(e) => updateMilestone(index, 'budget', e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className={`h-9 text-sm ${errors[`milestone_${index}_budget`] ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                                />
                                </div>

                                {/* Due Date */}
                                <div className="w-full">
                                  <label className="text-xs text-gray-500 sm:hidden mb-1 block">Due Date</label>
                                  <Input
                                  type="date"
                                  value={milestone.dueDate}
                                  onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className={`h-9 text-sm ${errors[`milestone_${index}_dueDate`] ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                                />
                                </div>

                                {/* Remove */}
                                <button
                                  type="button"
                                  onClick={() => removeMilestone(index)}
                                  disabled={milestones.length === 1}
                                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
                                  aria-label={`Remove milestone ${index + 1}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}

                            {/* Add milestone button */}
                            {milestones.length < 10 && (
                              <button
                                type="button"
                                onClick={addMilestone}
                                className="flex items-center gap-1.5 text-sm font-medium text-[#84cc16] hover:text-[#65a30d] transition-colors pt-1"
                              >
                                <Plus className="w-4 h-4" />
                                Add milestone
                              </button>
                            )}

                            {/* "You'll receive" summary box */}
                            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Budget</span>
                                <span className="font-semibold text-gray-900">
                                  {currency} {milestoneTotalBudget.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                                <span className="text-red-500">
                                  − {currency} {((milestoneTotalBudget * PLATFORM_FEE_PERCENTAGE) / 100).toFixed(2)}
                                </span>
                              </div>
                              <div className="border-t pt-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Freelancer receives</span>
                                <span className="font-bold text-green-600">
                                  {currency} {(milestoneTotalBudget - (milestoneTotalBudget * PLATFORM_FEE_PERCENTAGE) / 100).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="hourlyRate">Hourly Rate *</Label>
                            <Input
                              id="hourlyRate"
                              type="number"
                              value={hourlyRate}
                              onChange={(e) => setHourlyRate(e.target.value)}
                              placeholder="50"
                              min="0"
                              step="0.01"
                              className={errors.hourlyRate ? 'border-red-500' : ''}
                            />
                            {errors.hourlyRate && (
                              <p className="text-sm text-red-500 mt-1">{errors.hourlyRate}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="weeklyLimit">Weekly Hour Limit</Label>
                          <Input
                            id="weeklyLimit"
                            type="number"
                            value={weeklyLimit}
                            onChange={(e) => setWeeklyLimit(e.target.value)}
                            placeholder="40"
                            min="0"
                            disabled={noLimit}
                            className={errors.weeklyLimit ? 'border-red-500' : ''}
                          />
                          {errors.weeklyLimit && (
                            <p className="text-sm text-red-500 mt-1">{errors.weeklyLimit}</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="noLimit"
                            checked={noLimit}
                            onCheckedChange={(checked) => {
                              setNoLimit(checked as boolean);
                              if (checked) setWeeklyLimit('');
                            }}
                          />
                          <Label htmlFor="noLimit" className="font-normal cursor-pointer">
                            No weekly limit
                          </Label>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Step 4: Review Contract */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Contract Name Card */}
                    <div className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Contract Name</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(1)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-[#84cc16]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{contractName}</h2>
                    </div>

                    {/* Project Description Card */}
                    <div className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Project Description</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(2)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-[#84cc16]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#84cc16]/10 text-[#84cc16]">
                          {category}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {subcategory}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(3)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-[#84cc16]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#84cc16]/10 flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-[#84cc16]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Escrow Payment</p>
                          <p className="text-sm text-gray-600">Secure payment through platform</p>
                        </div>
                      </div>
                    </div>

                    {/* Budget & Terms Card */}
                    <div className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Budget & Terms</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(3)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-[#84cc16]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Type</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            {contractType === 'fixed' ? (
                              <>
                                <Target className="w-4 h-4 text-[#84cc16]" />
                                Fixed Price
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-[#84cc16]" />
                                Hourly Rate
                              </>
                            )}
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {contractType === 'fixed'
                              ? `${currency} ${splitMilestones ? milestoneTotalBudget.toFixed(2) : (parseFloat(budget) || 0).toFixed(2)}`
                              : `${currency} ${(parseFloat(hourlyRate) || 0).toFixed(2)}/hr`}
                          </p>
                        </div>
                      </div>
                      
                      {contractType === 'fixed' && splitMilestones && milestones.some(m => m.name || m.budget) && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-3">Milestones</p>
                          <div className="space-y-2">
                            {milestones.filter(m => m.name || m.budget).map((milestone, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-[#84cc16] text-white flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{milestone.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {currency} {(parseFloat(milestone.budget) || 0).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {contractType === 'hourly' && !noLimit && weeklyLimit && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-1">Weekly Hour Limit</p>
                          <p className="text-sm font-medium text-gray-700">{weeklyLimit} hours/week</p>
                        </div>
                      )}
                    </div>

                    {/* Financial Summary Card */}
                    <div className="border-2 border-[#84cc16]/20 rounded-lg p-6 bg-[#84cc16]/5">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">You'll pay</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {contractType === 'fixed'
                              ? (splitMilestones ? 'Total Budget' : 'Contract Amount')
                              : 'Estimated Amount'}
                          </span>
                          <span className="font-medium text-gray-900">
                            {currency} {payment.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                          <span className="font-medium text-red-600">
                            + {currency} {payment.fee.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t-2 border-[#84cc16]/20 pt-3">
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-xl text-[#84cc16]">
                              {currency} {payment.totalForClient.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  {currentStep < 4 && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        className="hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-green-400 hover:bg-green-500 text-black font-bold active:scale-[0.97] transition-all flex items-center gap-2"
                      >
                        {currentStep === 3 ? 'Review Contract' : 'Next'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Sidebar - Steps 1-3 */}
          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-[#84cc16]/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#84cc16]" />
                  You'll receive
                </CardTitle>
                <CardDescription>Payment breakdown after platform fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {contractType === 'fixed'
                        ? (splitMilestones ? `Total (${milestones.length} milestone${milestones.length > 1 ? 's' : ''})` : 'Contract Amount')
                        : 'Hourly Rate'}
                    </span>
                    <span className="font-medium">
                      {currency} {payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                    <span className="font-medium text-red-500">
                      − {currency} {payment.fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>You Pay</span>
                      <span>{currency} {payment.totalForClient.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-[#84cc16]/10 rounded-lg p-3 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#65a30d]">Freelancer Receives</span>
                      <span className="font-bold text-[#65a30d]">
                        {currency} {payment.payoutForFreelancer.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Per-milestone breakdown when milestones active */}
                {splitMilestones && contractType === 'fixed' && milestones.some(m => parseFloat(m.budget) > 0) && (
                  <div className="border-t pt-3 space-y-1.5">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Milestone Breakdown</p>
                    {milestones.map((m, i) => {
                      const mBudget = parseFloat(m.budget) || 0;
                      return mBudget > 0 ? (
                        <div key={i} className="flex justify-between text-xs text-gray-500">
                          <span className="truncate max-w-[140px]">{m.name || `Milestone ${i + 1}`}</span>
                          <span>{currency} {mBudget.toFixed(2)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {contractType === 'hourly' && !noLimit && weeklyLimit && (
                  <Alert className="border-[#84cc16]/30 bg-[#84cc16]/5">
                    <Calendar className="h-4 w-4 text-[#65a30d]" />
                    <AlertDescription className="text-sm text-[#65a30d]">
                      Estimated weekly cost: {currency} {(parseFloat(hourlyRate || '0') * parseFloat(weeklyLimit)).toFixed(2)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-gray-500 pt-4 border-t">
                  💰 Payment will be held in escrow until milestones are approved. Funds are released to the freelancer upon your approval.
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Action Sidebar - Step 4 (Review) */}
          {currentStep === 4 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-[#84cc16]/20">
                <CardHeader>
                  <CardTitle className="text-lg">Send Contract</CardTitle>
                  <CardDescription>Review recipient and finalize</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recipient Summary */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-semibold text-gray-700">Recipient</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-[#84cc16]"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm font-medium text-gray-900">{contributorEmail}</p>
                    </div>
                  </div>

                  {/* Message to Recipient */}
                  <div>
                    <Label htmlFor="recipientMessage" className="text-sm font-semibold text-gray-700">
                      Message to Recipient <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="recipientMessage"
                      value={recipientMessage}
                      onChange={(e) => setRecipientMessage(e.target.value)}
                      placeholder="Add a personal note or greeting..."
                      rows={4}
                      className="mt-2 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message will be included in the contract invitation email
                    </p>
                  </div>

                  {/* Legal Compliance */}
                  <div className="pt-4 border-t">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreedToTerms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreedToTerms" className="text-sm leading-relaxed cursor-pointer font-normal">
                        Yes, I understand and agree to the{' '}
                        <a href="/terms" target="_blank" className="text-[#84cc16] hover:underline font-medium">
                          Terms of Service
                        </a>
                        , including the{' '}
                        <a href="/payment-terms" target="_blank" className="text-[#84cc16] hover:underline font-medium">
                          Payment Terms
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" target="_blank" className="text-[#84cc16] hover:underline font-medium">
                          Privacy Policy
                        </a>
                        .
                      </Label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {sendError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700">{sendError}</p>
                    </div>
                  )}

                  {/* Send Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!agreedToTerms || isSending}
                    className="w-full bg-green-400 hover:bg-green-500 text-black font-bold active:scale-[0.97] transition-all h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-5 h-5 mr-2" /> Send Contract</>
                    )}
                  </Button>

                  {/* Save as Draft */}
                  <Button
                    variant="ghost"
                    onClick={handleSaveDraft}
                    className="w-full text-gray-600 hover:text-gray-900"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as draft
                  </Button>

                  <div className="text-xs text-gray-500 pt-4 border-t">
                    🔒 Your payment details are secure. Funds will be held in escrow until work is approved.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
