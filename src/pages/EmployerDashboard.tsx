import { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoTests } from '../data/demoTests';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Clock, FileQuestion, Send, Copy, CheckCircle, BarChart3, Users, ClipboardList, Home } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const EmployerDashboard = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = (testId: string) => {
    setSelectedTest(testId);
    setGeneratedLink('');
    setCandidateEmail('');
    setCandidateName('');
  };

  const handleCreateInvitation = () => {
    if (!candidateEmail || !selectedTest) return;

    // Generate unique token (demo - just random string)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const inviteLink = `${window.location.origin}/take-test/${token}`;
    
    setGeneratedLink(inviteLink);
    setShowLinkDialog(true);

    // Store mock invitation in localStorage for demo
    const invitations = JSON.parse(localStorage.getItem('test_invitations') || '[]');
    invitations.push({
      id: token,
      testId: selectedTest,
      candidateName,
      candidateEmail,
      status: 'pending',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });
    localStorage.setItem('test_invitations', JSON.stringify(invitations));

    toast({
      title: 'Test Invitation Created',
      description: `Link generated for ${candidateEmail}`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Link Copied!',
      description: 'Test invitation link copied to clipboard',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Mock data for sent invitations
  const sentInvitations = JSON.parse(localStorage.getItem('test_invitations') || '[]');
  const completedTests = JSON.parse(localStorage.getItem('completed_tests') || '[]');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-gray-600 hover:text-black transition-colors text-sm mb-2 inline-flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-black">Employer Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage tests and track candidate assessments</p>
            </div>
            <div className="flex gap-3">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{sentInvitations.length}</p>
                      <p className="text-xs text-blue-700">Invitations Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-900">{completedTests.length}</p>
                      <p className="text-xs text-green-700">Tests Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tests" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Test Library
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2">
              <Send className="h-4 w-4" />
              Sent Invitations
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Test Library Tab */}
          <TabsContent value="tests">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoTests.map(test => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${getDifficultyColor(test.difficulty)} border-2`}>
                        {test.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{test.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileQuestion className="w-4 h-4" />
                        <span>{test.questions.length} questions</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {test.skillsCovered.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {test.skillsCovered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{test.skillsCovered.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleGenerateLink(test.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send to Candidate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Send Test Invitation</DialogTitle>
                          <DialogDescription>
                            Generate a unique link for {test.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="candidate-name">Candidate Name</Label>
                            <Input
                              id="candidate-name"
                              placeholder="John Doe"
                              value={candidateName}
                              onChange={(e) => setCandidateName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="candidate-email">Candidate Email *</Label>
                            <Input
                              id="candidate-email"
                              type="email"
                              placeholder="candidate@example.com"
                              value={candidateEmail}
                              onChange={(e) => setCandidateEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={handleCreateInvitation}
                            disabled={!candidateEmail}
                            className="w-full"
                          >
                            Generate Invitation Link
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sent Invitations Tab */}
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Sent Test Invitations</CardTitle>
                <CardDescription>Track all test invitations sent to candidates</CardDescription>
              </CardHeader>
              <CardContent>
                {sentInvitations.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No invitations sent yet</p>
                    <p className="text-sm text-gray-500 mt-2">Send your first test invitation from the Test Library</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentInvitations.map((invitation: any) => {
                      const test = demoTests.find(t => t.id === invitation.testId);
                      const inviteLink = `${window.location.origin}/take-test/${invitation.id}`;
                      
                      return (
                        <Card key={invitation.id} className="border-2">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <Badge variant={invitation.status === 'completed' ? 'default' : 'secondary'}>
                                    {invitation.status === 'completed' ? (
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                    ) : null}
                                    {invitation.status}
                                  </Badge>
                                  <h3 className="font-semibold text-lg">{test?.title}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <p className="font-medium text-gray-900">{invitation.candidateName || 'N/A'}</p>
                                    <p>{invitation.candidateEmail}</p>
                                  </div>
                                  <div>
                                    <p>Sent: {new Date(invitation.sentAt).toLocaleDateString()}</p>
                                    <p>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                  <Input 
                                    value={inviteLink} 
                                    readOnly 
                                    className="text-xs font-mono bg-gray-50"
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText(inviteLink);
                                      toast({ title: 'Link Copied!' });
                                    }}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Results</CardTitle>
                <CardDescription>View all completed test results</CardDescription>
              </CardHeader>
              <CardContent>
                {completedTests.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No completed tests yet</p>
                    <p className="text-sm text-gray-500 mt-2">Results will appear here once candidates complete their tests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedTests.map((result: any, idx: number) => (
                      <Card key={idx} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{result.candidateName || 'Anonymous'}</h3>
                              <p className="text-sm text-gray-600">{result.testTitle}</p>
                              <p className="text-xs text-gray-500">
                                Completed: {new Date(result.completedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right space-y-2">
                              <div>
                                <p className={`text-3xl font-bold ${result.passed ? 'text-green-600' : 'text-amber-600'}`}>
                                  {result.score}%
                                </p>
                                <p className="text-sm text-gray-600">
                                  {result.earnedPoints}/{result.totalPoints} points
                                </p>
                              </div>
                              <Badge variant={result.passed ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                                {result.passed ? 'Passed' : 'Needs Review'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Link Generated Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Test Invitation Link Generated
            </DialogTitle>
            <DialogDescription>
              Share this link with {candidateEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invitation Link</Label>
              <div className="flex gap-2">
                <Input 
                  value={generatedLink} 
                  readOnly 
                  className="font-mono text-sm bg-gray-50"
                />
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This link is valid for 7 days and can only be used once.
                The candidate will have {demoTests.find(t => t.id === selectedTest)?.duration} minutes to complete the test.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLinkDialog(false)} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerDashboard;
