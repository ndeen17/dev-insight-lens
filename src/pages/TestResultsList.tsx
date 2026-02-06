import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { BarChart3, Award, TrendingUp, User, Calendar, Code, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BackToDashboard from '../components/BackToDashboard';

interface TestResult {
  id: string;
  candidateName: string;
  candidateEmail: string;
  testType: string;
  completedDate: string;
  score: number;
  duration: string;
  passedTests: number;
  totalTests: number;
  technicalSkills: {
    name: string;
    score: number;
  }[];
  status: 'passed' | 'failed';
}

export default function TestResultsList() {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  useEffect(() => {
    // TODO: Fetch test results from backend
    // Mock data for now
    setTimeout(() => {
      setResults([
        {
          id: '1',
          candidateName: 'Jane Smith',
          candidateEmail: 'jane@example.com',
          testType: 'React Developer',
          completedDate: '2024-01-14',
          score: 85,
          duration: '45 minutes',
          passedTests: 17,
          totalTests: 20,
          technicalSkills: [
            { name: 'React Hooks', score: 90 },
            { name: 'State Management', score: 85 },
            { name: 'Component Design', score: 80 }
          ],
          status: 'passed'
        },
        {
          id: '2',
          candidateName: 'Mike Johnson',
          candidateEmail: 'mike@example.com',
          testType: 'Full Stack Developer',
          completedDate: '2024-01-13',
          score: 72,
          duration: '60 minutes',
          passedTests: 14,
          totalTests: 20,
          technicalSkills: [
            { name: 'Node.js', score: 75 },
            { name: 'Database Design', score: 70 },
            { name: 'API Development', score: 70 }
          ],
          status: 'passed'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else {
      return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
    }
  });

  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  const passRate = results.length > 0
    ? Math.round((results.filter(r => r.status === 'passed').length / results.length) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="BusinessOwner" />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <BackToDashboard />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
            <p className="mt-2 text-gray-600">
              Review and analyze developer test performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{results.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{averageScore}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{passRate}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Results</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  sortBy === 'date'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setSortBy('score')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  sortBy === 'score'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Score
              </button>
            </div>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No test results yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Results will appear here once candidates complete their tests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/test-candidate/${result.id}/results`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                          result.score >= 80 ? 'bg-green-100 text-green-700' :
                          result.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.score}%
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.candidateName}
                          </h3>
                          <p className="text-sm text-gray-600">{result.candidateEmail}</p>
                        </div>
                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === 'passed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Code className="w-4 h-4" />
                          <span>{result.testType}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(result.completedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{result.passedTests}/{result.totalTests} passed</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <BarChart3 className="w-4 h-4" />
                          <span>{result.duration}</span>
                        </div>
                      </div>

                      {/* Technical Skills */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.technicalSkills.map((skill, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                            >
                              <span className="text-sm text-gray-700">{skill.name}</span>
                              <span className="text-sm font-semibold text-gray-900">{skill.score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTES.CREATE_CONTRACT, { state: { candidateEmail: result.candidateEmail } });
                      }}
                      className="ml-6 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                    >
                      Create Contract
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
