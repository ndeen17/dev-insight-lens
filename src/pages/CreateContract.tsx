import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CategoryDropdown from '@/components/CategoryDropdown';
import { Calendar, DollarSign, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';

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

  // Pre-fill email from location state (e.g., from Leaderboard hire button)
  useEffect(() => {
    if (location.state?.freelancerEmail) {
      setContributorEmail(location.state.freelancerEmail);
    }
  }, [location.state]);

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
        } else {
          localStorage.removeItem('contractDraft');
        }
      } catch (error) {
        console.error('Failed to restore draft:', error);
      }
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = () => {
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
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('contractDraft', JSON.stringify(draft));
  };

  // Calculate payment summary
  const calculatePayment = () => {
    const amount = parseFloat(contractType === 'fixed' ? budget : hourlyRate) || 0;
    const fee = (amount * PLATFORM_FEE_PERCENTAGE) / 100;
    const totalForClient = amount + fee;
    const payoutForFreelancer = amount - fee;
    
    return {
      amount,
      fee,
      totalForClient,
      payoutForFreelancer
    };
  };

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
      if (!budget || parseFloat(budget) <= 0) {
        newErrors.budget = 'Budget must be greater than 0';
      }
      
      if (splitMilestones) {
        const totalMilestoneBudget = milestones.reduce((sum, m) => sum + (parseFloat(m.budget) || 0), 0);
        const budgetNum = parseFloat(budget);
        
        if (Math.abs(totalMilestoneBudget - budgetNum) > 0.01) {
          newErrors.milestones = 'Total milestone budget must equal contract budget';
        }
        
        for (let i = 0; i < milestones.length; i++) {
          if (!milestones[i].name.trim()) {
            newErrors[`milestone_${i}_name`] = 'Milestone name is required';
          }
          if (!milestones[i].budget || parseFloat(milestones[i].budget) <= 0) {
            newErrors[`milestone_${i}_budget`] = 'Valid budget required';
          }
          if (!milestones[i].dueDate) {
            newErrors[`milestone_${i}_dueDate`] = 'Due date required';
          }
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
    }
    
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      saveDraft();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    alert('Draft saved successfully!');
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    try {
      const contractData = {
        name: contractName,
        freelancerEmail: contributorEmail,
        category,
        subcategory,
        description,
        type: contractType,
        ...(contractType === 'fixed' ? {
          budget: parseFloat(budget),
          currency,
          milestones: splitMilestones ? milestones.map(m => ({
            name: m.name,
            budget: parseFloat(m.budget),
            dueDate: new Date(m.dueDate)
          })) : []
        } : {
          hourlyRate: parseFloat(hourlyRate),
          currency,
          weeklyLimit: noLimit ? null : parseFloat(weeklyLimit)
        }),
        status: 'pending'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contractData)
      });

      if (!response.ok) {
        throw new Error('Failed to create contract');
      }

      localStorage.removeItem('contractDraft');
      navigate('/employer/dashboard', { state: { message: 'Contract created successfully!' } });
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    }
  };

  const payment = calculatePayment();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Contract</h1>
          <p className="mt-2 text-gray-600">Set up a contract with your freelancer</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 max-w-md mx-auto">
            <span className="text-sm font-medium">Set Up</span>
            <span className="text-sm font-medium">Description</span>
            <span className="text-sm font-medium">Budget & Terms</span>
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
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Enter basic contract information'}
                  {currentStep === 2 && 'Describe the project scope and requirements'}
                  {currentStep === 3 && 'Set payment terms and milestones'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Setup */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <Label htmlFor="contractName">Contract Name *</Label>
                      <Input
                        id="contractName"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                        placeholder="e.g., Website Redesign Project"
                        maxLength={70}
                        className={errors.contractName ? 'border-red-500' : ''}
                      />
                      {errors.contractName && (
                        <p className="text-sm text-red-500 mt-1">{errors.contractName}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{contractName.length}/70</p>
                    </div>

                    <div>
                      <Label htmlFor="contributorEmail">Freelancer Email *</Label>
                      <Input
                        id="contributorEmail"
                        type="email"
                        value={contributorEmail}
                        onChange={(e) => setContributorEmail(e.target.value)}
                        placeholder="freelancer@example.com"
                        className={errors.contributorEmail ? 'border-red-500' : ''}
                      />
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
                      <Label>Category & Subcategory *</Label>
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
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the project scope, requirements, deliverables, and any specific instructions..."
                        rows={8}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{description.length} characters (minimum 50)</p>
                    </div>
                  </>
                )}

                {/* Step 3: Budget & Terms */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <Label>Contract Type</Label>
                      <RadioGroup value={contractType} onValueChange={(value: 'fixed' | 'hourly') => setContractType(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed" className="font-normal cursor-pointer">
                            <DollarSign className="inline w-4 h-4 mr-1" />
                            Fixed Price
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hourly" id="hourly" />
                          <Label htmlFor="hourly" className="font-normal cursor-pointer">
                            <Clock className="inline w-4 h-4 mr-1" />
                            Hourly Rate
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {contractType === 'fixed' ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="budget">Budget *</Label>
                            <Input
                              id="budget"
                              type="number"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              placeholder="5000"
                              min="0"
                              step="0.01"
                              className={errors.budget ? 'border-red-500' : ''}
                            />
                            {errors.budget && (
                              <p className="text-sm text-red-500 mt-1">{errors.budget}</p>
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
                                <SelectItem value="USDT">USDT</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="splitMilestones"
                            checked={splitMilestones}
                            onCheckedChange={(checked) => setSplitMilestones(checked as boolean)}
                          />
                          <Label htmlFor="splitMilestones" className="font-normal cursor-pointer">
                            Split into milestones
                          </Label>
                        </div>

                        {splitMilestones && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Milestones ({milestones.length}/10)</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addMilestone}
                                disabled={milestones.length >= 10}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Milestone
                              </Button>
                            </div>
                            {errors.milestones && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.milestones}</AlertDescription>
                              </Alert>
                            )}
                            <div className="space-y-3">
                              {milestones.map((milestone, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start border p-3 rounded-lg">
                                  <div className="col-span-5">
                                    <Input
                                      placeholder="Milestone name"
                                      value={milestone.name}
                                      onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                                      className={errors[`milestone_${index}_name`] ? 'border-red-500' : ''}
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      type="number"
                                      placeholder="Budget"
                                      value={milestone.budget}
                                      onChange={(e) => updateMilestone(index, 'budget', e.target.value)}
                                      min="0"
                                      step="0.01"
                                      className={errors[`milestone_${index}_budget`] ? 'border-red-500' : ''}
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      type="date"
                                      value={milestone.dueDate}
                                      onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                                      min={new Date().toISOString().split('T')[0]}
                                      className={errors[`milestone_${index}_dueDate`] ? 'border-red-500' : ''}
                                    />
                                  </div>
                                  <div className="col-span-1 flex justify-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeMilestone(index)}
                                      disabled={milestones.length === 1}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
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

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                    >
                      Save Draft
                    </Button>
                    {currentStep < 3 ? (
                      <Button onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit}>
                        Submit Contract
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {contractType === 'fixed' ? 'Contract Amount' : 'Hourly Rate'}
                    </span>
                    <span className="font-medium">
                      {currency} {payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                    <span className="font-medium">
                      {currency} {payment.fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>You Pay</span>
                      <span>{currency} {payment.totalForClient.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Freelancer Receives</span>
                    <span className="font-medium">
                      {currency} {payment.payoutForFreelancer.toFixed(2)}
                    </span>
                  </div>
                </div>

                {contractType === 'hourly' && !noLimit && weeklyLimit && (
                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      Estimated weekly cost: {currency} {(parseFloat(hourlyRate || '0') * parseFloat(weeklyLimit)).toFixed(2)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-gray-500 pt-4 border-t">
                  Payment will be held in escrow until milestones are approved. Funds are released to the freelancer upon your approval.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
