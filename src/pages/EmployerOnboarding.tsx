import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import BackToDashboard from '../components/BackToDashboard';
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from 'lucide-react';

const EmployerOnboarding = () => {
  const navigate = useNavigate();
  const [onboardingMode, setOnboardingMode] = useState<'choose' | 'manual' | 'ai'>('choose');
  const [step, setStep] = useState(1);
  const [roleType, setRoleType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<string[]>([]);
  const [assessmentAreas, setAssessmentAreas] = useState<string[]>([]);
  
  // AI Mode states
  const [productDescription, setProductDescription] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);

  // Check if onboarding already completed
  useEffect(() => {
    const existingRequirements = localStorage.getItem('employer_requirements');
    if (existingRequirements) {
      try {
        const { createdAt } = JSON.parse(existingRequirements);
        const daysSinceOnboarding = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
        
        // If onboarding was completed within last 30 days, redirect to dashboard
        if (daysSinceOnboarding < 30) {
          navigate('/employer/dashboard');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    }
  }, [navigate]);

  const roleTypes = [
    { id: 'frontend', label: 'Frontend Developer', skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'] },
    { id: 'backend', label: 'Backend Developer', skills: ['Node.js', 'Python', 'Java', 'Databases', 'APIs'] },
    { id: 'fullstack', label: 'Full-Stack Developer', skills: ['React', 'Node.js', 'Databases', 'APIs', 'DevOps'] },
    { id: 'mobile', label: 'Mobile Developer', skills: ['React Native', 'Flutter', 'iOS', 'Android'] },
    { id: 'devops', label: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'] },
    { id: 'dataeng', label: 'Data Engineer', skills: ['Python', 'SQL', 'ETL', 'Big Data', 'Cloud'] },
  ];

  const techStacks = {
    frontend: ['React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'CSS/Tailwind', 'HTML5'],
    backend: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', '.NET'],
    database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'],
    cloud: ['AWS', 'Azure', 'Google Cloud', 'Heroku', 'Vercel'],
  };

  const projectTypes = [
    'Web Application', 'Mobile App', 'API Development', 'E-commerce', 
    'SaaS Product', 'Enterprise Software', 'Microservices', 'Real-time Systems'
  ];

  const assessmentOptions = [
    { id: 'coding', label: 'Coding Challenges', desc: 'Algorithmic problem solving' },
    { id: 'system-design', label: 'System Design', desc: 'Architecture and scalability' },
    { id: 'debugging', label: 'Debugging', desc: 'Find and fix bugs' },
    { id: 'code-review', label: 'Code Review', desc: 'Assess code quality' },
    { id: 'behavioral', label: 'Behavioral', desc: 'Soft skills assessment' },
    { id: 'live-coding', label: 'Live Coding', desc: 'Real-time problem solving' },
  ];

  const toggleTechStack = (tech: string) => {
    setTechStack(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleProjectType = (type: string) => {
    setProjectType(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAssessment = (area: string) => {
    setAssessmentAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleComplete = () => {
    // Store requirements
    const requirements = {
      mode: onboardingMode,
      roleType,
      experienceLevel,
      techStack,
      projectType,
      assessmentAreas,
      aiRecommendations,
      productDescription,
      companyInfo,
      teamSize,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem('employer_requirements', JSON.stringify(requirements));
    navigate('/employer/getting-started');
  };

  const handleAiAnalysis = async () => {
    if (!productDescription) return;

    setIsAnalyzing(true);
    
    // TODO: Wire to real AI assessment generation endpoint (Milestone 2)
    // For now, redirect to manual flow with a note
    setTimeout(() => {
      setIsAnalyzing(false);
      setOnboardingMode('manual');
      setStep(1);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Mode Selection (Initial Step) */}
        {onboardingMode === 'choose' && (
          <div>
            <div className="mb-6">
              <BackToDashboard label="Back to Getting Started" />
            </div>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                How would you like to proceed?
              </h1>
              <p className="text-gray-600">Choose the best way to identify your hiring needs</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => { setOnboardingMode('ai'); setStep(1); }}
                className="w-full text-left border-2 border-gray-200 rounded-xl p-8 hover:border-black transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">Let AI Recommend</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Describe your product or company, and our AI will analyze your requirements 
                      and suggest the perfect skills, tech stack, and assessment tests.
                    </p>
                    <span className="inline-block text-xs font-medium text-black">
                      Recommended →
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setOnboardingMode('manual'); setStep(1); }}
                className="w-full text-left border-2 border-gray-200 rounded-xl p-8 hover:border-black transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">Manual Selection</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose the role, tech stack, experience level, and assessment areas yourself.
                    </p>
                    <span className="inline-block text-xs font-medium text-black">
                      Full control →
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/employer/getting-started')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Skip setup, choose what to do next →
              </button>
            </div>
          </div>
        )}

        {/* AI Mode - Product Description */}
        {onboardingMode === 'ai' && step === 1 && (
          <div className="border border-gray-200 rounded-xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-black" />
                <h2 className="text-2xl font-bold text-black">Tell Us About Your Needs</h2>
              </div>
              <p className="text-gray-600">
                Describe your product, company, or project. Our AI will analyze and recommend the best assessment approach.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product-desc" className="text-base font-semibold">
                  Product/Project Description *
                </Label>
                <Textarea
                  id="product-desc"
                  placeholder="Example: We're building a real-time collaboration platform for remote teams, similar to Slack but with integrated video conferencing and project management. The app needs to handle thousands of concurrent users, support file sharing, and integrate with third-party tools like GitHub and Jira..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="min-h-[150px] text-base"
                />
                <p className="text-xs text-gray-500">
                  The more detail you provide, the better our recommendations will be.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-info">Company/Industry (Optional)</Label>
                  <Textarea
                    id="company-info"
                    placeholder="e.g., Early-stage SaaS startup in fintech"
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-size">Team Size & Structure (Optional)</Label>
                  <Textarea
                    id="team-size"
                    placeholder="e.g., 5-person team, 2 frontend, 1 backend, 2 full-stack"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Include information about your tech stack preferences, 
                  scalability needs, user base, integrations, and any specific challenges you're facing.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setOnboardingMode('choose')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button 
                  onClick={handleAiAnalysis}
                  disabled={!productDescription || isAnalyzing}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AI Mode - Review Recommendations */}
        {onboardingMode === 'ai' && step === 2 && aiRecommendations && (
          <div className="border border-gray-200 rounded-xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-6 h-6 text-black" />
                <h2 className="text-2xl font-bold text-black">AI Recommendations</h2>
              </div>
              <p className="text-gray-600">
                Review and adjust the AI-generated recommendations below
              </p>
            </div>

            <div className="space-y-6">
              {/* AI Reasoning */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Analysis
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {aiRecommendations.reasoning}
                </p>
              </div>

              {/* Recommended Role */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Recommended Role Type</Label>
                <div className="flex flex-wrap gap-2">
                  {roleTypes.map((role) => (
                    <Badge
                      key={role.id}
                      variant={roleType === role.id ? 'default' : 'outline'}
                      className={`cursor-pointer py-2 px-4 ${
                        roleType === role.id ? 'bg-black text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setRoleType(role.id)}
                    >
                      {role.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommended Tech Stack */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Recommended Tech Stack</Label>
                <div className="flex flex-wrap gap-2">
                  {aiRecommendations.suggestedTechStack.map((tech: string) => (
                    <Badge key={tech} className="bg-gray-100 text-gray-800 py-2 px-3">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  You can add more technologies in the dashboard later
                </p>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Experience Level</Label>
                <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel} className="space-y-2">
                  {[
                    { id: 'junior', label: 'Junior (0-2 years)' },
                    { id: 'mid', label: 'Mid-Level (2-5 years)' },
                    { id: 'senior', label: 'Senior (5+ years)' },
                    { id: 'lead', label: 'Lead/Architect (8+ years)' },
                  ].map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.id} id={level.id} />
                      <Label htmlFor={level.id} className="cursor-pointer">{level.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Assessment Areas */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Assessment Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {assessmentOptions.map((option) => (
                    <Badge
                      key={option.id}
                      variant={assessmentAreas.includes(option.id) ? 'default' : 'outline'}
                      className={`cursor-pointer py-2 px-3 ${
                        assessmentAreas.includes(option.id) ? 'bg-black text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleAssessment(option.id)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Modify Description
                </Button>

                <Button 
                  onClick={handleComplete}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Mode - Progress Indicator */}
        {onboardingMode === 'manual' && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 5 && (
                  <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-black' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 5</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">
              {step === 1 && 'What role are you hiring for?'}
              {step === 2 && 'Experience Level'}
              {step === 3 && 'Tech Stack & Tools'}
              {step === 4 && 'Project Type'}
              {step === 5 && 'Assessment Areas'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'Select the primary role you want to assess'}
              {step === 2 && 'Choose the candidate experience level'}
              {step === 3 && 'Select the technologies they should know'}
              {step === 4 && 'What type of project will they work on?'}
              {step === 5 && 'What areas do you want to assess?'}
            </p>
          </div>

          <div>
            {/* Step 1: Role Type */}
            {step === 1 && (
              <RadioGroup value={roleType} onValueChange={setRoleType} className="space-y-3">
                {roleTypes.map((role) => (
                  <div key={role.id} className="flex items-start space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-black cursor-pointer">
                    <RadioGroupItem value={role.id} id={role.id} className="mt-1" />
                    <Label htmlFor={role.id} className="flex-1 cursor-pointer">
                      <p className="font-semibold text-base mb-2">{role.label}</p>
                      <div className="flex flex-wrap gap-1">
                        {role.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 2: Experience Level */}
            {step === 2 && (
              <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel} className="space-y-3">
                {[
                  { id: 'junior', label: 'Junior (0-2 years)', desc: 'Entry-level developers, fresh graduates' },
                  { id: 'mid', label: 'Mid-Level (2-5 years)', desc: 'Developers with solid experience' },
                  { id: 'senior', label: 'Senior (5+ years)', desc: 'Experienced developers, tech leads' },
                  { id: 'lead', label: 'Lead/Architect (8+ years)', desc: 'Technical leadership, architecture design' },
                ].map((level) => (
                  <div key={level.id} className="flex items-start space-x-3 border-2 border-gray-200 rounded-lg p-4 hover:border-black cursor-pointer">
                    <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                    <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                      <p className="font-semibold">{level.label}</p>
                      <p className="text-sm text-gray-600">{level.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 3: Tech Stack */}
            {step === 3 && (
              <div className="space-y-6">
                {Object.entries(techStacks).map(([category, technologies]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3 capitalize">{category.replace('-', ' ')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant={techStack.includes(tech) ? 'default' : 'outline'}
                          className={`cursor-pointer text-sm py-2 px-4 ${
                            techStack.includes(tech) ? 'bg-black text-white' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleTechStack(tech)}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Project Type */}
            {step === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => toggleProjectType(type)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      projectType.includes(type)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={projectType.includes(type)} />
                      <Label className="cursor-pointer">{type}</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Assessment Areas */}
            {step === 5 && (
              <div className="space-y-3">
                {assessmentOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleAssessment(option.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      assessmentAreas.includes(option.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={assessmentAreas.includes(option.id)} className="mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-sm text-gray-600">{option.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => navigate('/test-candidate')}>
                  Cancel
                </Button>
              )}

              {step < 5 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !roleType) ||
                    (step === 2 && !experienceLevel)
                  }
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={assessmentAreas.length === 0}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Complete Setup
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerOnboarding;
