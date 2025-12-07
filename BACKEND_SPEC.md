# Backend API Specification
## Dev-Insight-Lens - Dual-Mode GitHub Analysis System

**Version:** 2.0.0  
**Last Updated:** December 7, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Scoring Logic](#scoring-logic)
6. [Repository Filters](#repository-filters)
7. [Error Handling](#error-handling)
8. [Implementation Guide](#implementation-guide)

---

## 🎯 Overview

The backend must produce **ONE unified evaluation object** containing all data for both Recruiter Mode and Engineer Mode. The frontend filters and presents the relevant sections based on the selected mode.

### Key Principles

- Single evaluation endpoint returns complete data
- Frontend controls what to display (mode-based filtering)
- Backward compatible with legacy format
- Comprehensive scoring across 6 categories
- Repository quality filtering built-in

---

## 🏗️ Architecture

```
┌─────────────────┐
│  GitHub API     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Collection│
│  & Processing   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Analysis    │
│  Engine         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Score          │
│  Calculation    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Unified        │
│  Response       │
└─────────────────┘
```

---

## 📡 API Endpoints

### 1. Evaluate GitHub Profile

**Endpoint:** `POST /api/evaluate`

**Description:** Analyzes a GitHub profile and returns comprehensive insights for both recruiter and engineer modes.

#### Request

```json
{
  "github_url": "https://github.com/username"
}
```

**Validation Rules:**
- Must be a valid GitHub profile URL
- Pattern: `https://github.com/[username]`
- Username can contain alphanumeric, hyphens, and underscores

#### Response (Success - 200 OK)

```json
{
  "profile": {
    "username": "string",
    "name": "string",
    "bio": "string",
    "avatar": "string (URL)",
    "location": "string",
    "github_url": "string (URL)",
    "primary_languages": ["string"],
    "total_repositories": "number",
    "analyzed_repositories": "number",
    "activity_status": "Active | Semi-active | Inactive"
  },
  "scores": {
    "overall_level": "Beginner | Intermediate | Senior | Expert",
    "overall_score": "number (0-110)",
    "job_readiness_score": "number (0-100)",
    "tech_depth_score": "number (0-100)",
    "code_quality": "number (0-20)",
    "project_diversity": "number (0-20)",
    "activity": "number (0-20)",
    "architecture": "number (0-20)",
    "repo_quality": "number (0-20)",
    "professionalism": "number (0-10)"
  },
  "recruiter_summary": {
    "top_strengths": ["string"],
    "risks_or_weaknesses": ["string"],
    "recommended_role_level": "string",
    "hiring_recommendation": "Strong Yes | Yes | Maybe | No",
    "activity_flag": "Active | Semi-active | Inactive",
    "project_maturity_rating": "Low | Moderate | Good | Excellent",
    "tech_stack_summary": ["string"] (optional),
    "work_history_signals": ["string"] (optional)
  },
  "engineer_breakdown": {
    "code_patterns": ["string"],
    "architecture_analysis": ["string"],
    "testing_analysis": {
      "test_presence": "boolean",
      "test_libraries_seen": ["string"],
      "coverage_estimate": "string" (optional),
      "testing_patterns": ["string"] (optional)
    },
    "complexity_insights": ["string"],
    "commit_message_quality": "string",
    "language_breakdown": {
      "[language_name]": {
        "percentage": "number (0-100)",
        "repos_count": "number",
        "proficiency_level": "string" (optional)
      }
    },
    "repo_level_details": [
      {
        "repo_name": "string",
        "score": "number (0-100)",
        "notes": "string",
        "languages": ["string"] (optional),
        "complexity": "string" (optional),
        "stars": "number" (optional),
        "forks": "number" (optional)
      }
    ],
    "design_patterns_used": ["string"] (optional),
    "code_smells": ["string"] (optional),
    "best_practices": ["string"] (optional),
    "improvement_areas": ["string"] (optional)
  }
}
```

#### Error Responses

```json
// 400 Bad Request - Invalid URL
{
  "error": "Please enter a valid GitHub profile URL",
  "message": "Invalid GitHub URL format"
}

// 404 Not Found - User doesn't exist
{
  "error": "GitHub user not found or profile is private",
  "message": "User [username] not found"
}

// 429 Too Many Requests - Rate limit
{
  "error": "Rate limit exceeded. Please try again in 15 minutes",
  "retry_after": 900
}

// 500 Internal Server Error
{
  "error": "Analysis service temporarily unavailable",
  "message": "Internal server error details"
}
```

---

### 2. Health Check

**Endpoint:** `GET /health`

**Description:** Returns the health status of the backend service.

#### Response (200 OK)

```json
{
  "status": "online",
  "timestamp": "2025-12-07T10:30:00Z",
  "service": "AI Developer Evaluator API",
  "version": "2.0.0" (optional)
}
```

---

## 📊 Data Models

### Profile Object

Contains identity and metadata about the GitHub user.

```typescript
interface Profile {
  username: string;          // GitHub username
  name: string;              // Full name
  bio: string;               // Profile bio
  avatar: string;            // Avatar URL
  location: string;          // Location
  github_url: string;        // Full GitHub profile URL
  primary_languages: string[]; // Top 5 languages by usage
  total_repositories: number;  // All repos (including forks)
  analyzed_repositories: number; // Repos actually analyzed
  activity_status: ActivityFlag; // Activity level
}

type ActivityFlag = 'Active' | 'Semi-active' | 'Inactive';
```

**Activity Status Rules:**
- **Active**: Commits in last 30 days
- **Semi-active**: Commits in last 90 days
- **Inactive**: No commits in 90+ days

---

### Scores Object

Core metrics used for evaluation (Total: 110 points).

```typescript
interface Scores {
  overall_level: SkillLevel;     // Calculated from overall_score
  overall_score: number;         // 0-110 (sum of all categories)
  job_readiness_score: number;   // 0-100 percentage
  tech_depth_score: number;      // 0-100 percentage
  
  // Category scores
  code_quality: number;          // 0-20
  project_diversity: number;     // 0-20
  activity: number;              // 0-20
  architecture: number;          // 0-20
  repo_quality: number;          // 0-20
  professionalism: number;       // 0-10
}

type SkillLevel = 'Beginner' | 'Intermediate' | 'Senior' | 'Expert';
```

**Level Classification:**
- **Beginner**: 0-40 points
- **Intermediate**: 41-75 points
- **Senior**: 76-95 points
- **Expert**: 96-110 points

---

### Recruiter Summary Object

High-level insights for hiring decisions (non-technical audience).

```typescript
interface RecruiterSummary {
  top_strengths: string[];           // 3-5 key strengths
  risks_or_weaknesses: string[];     // 2-4 concerns/risks
  recommended_role_level: string;    // e.g., "Senior Full-Stack Engineer"
  hiring_recommendation: HiringRecommendation;
  activity_flag: ActivityFlag;
  project_maturity_rating: ProjectMaturityRating;
  tech_stack_summary?: string[];     // Optional: key technologies
  work_history_signals?: string[];   // Optional: work patterns
}

type HiringRecommendation = 'Strong Yes' | 'Yes' | 'Maybe' | 'No';
type ProjectMaturityRating = 'Low' | 'Moderate' | 'Good' | 'Excellent';
```

**Hiring Recommendation Logic:**
- **Strong Yes**: overall_score >= 85
- **Yes**: overall_score 70-84
- **Maybe**: overall_score 50-69
- **No**: overall_score < 50

---

### Engineer Breakdown Object

Deep technical analysis (technical audience).

```typescript
interface EngineerBreakdown {
  code_patterns: string[];              // Observed coding patterns
  architecture_analysis: string[];      // Architecture insights
  testing_analysis: TestingAnalysis;
  complexity_insights: string[];        // Code complexity observations
  commit_message_quality: string;       // Quality assessment
  language_breakdown: LanguageBreakdown;
  repo_level_details: RepoDetail[];
  
  // Optional fields
  design_patterns_used?: string[];      // Design patterns found
  code_smells?: string[];               // Issues detected
  best_practices?: string[];            // Good practices observed
  improvement_areas?: string[];         // Growth opportunities
}

interface TestingAnalysis {
  test_presence: boolean;
  test_libraries_seen: string[];        // e.g., ["Jest", "Pytest", "JUnit"]
  coverage_estimate?: string;           // e.g., "Moderate (40-60%)"
  testing_patterns?: string[];          // e.g., ["Unit tests", "Integration tests"]
}

interface LanguageBreakdown {
  [language: string]: {
    percentage: number;                 // Usage percentage
    repos_count: number;                // Number of repos using it
    proficiency_level?: string;         // e.g., "Advanced", "Intermediate"
  };
}

interface RepoDetail {
  repo_name: string;
  score: number;                        // 0-100
  notes: string;                        // Analysis summary
  languages?: string[];
  complexity?: string;                  // e.g., "High", "Medium", "Low"
  stars?: number;
  forks?: number;
}
```

---

## 🧮 Scoring Logic

### 1. Code Quality (0-20 points)

Evaluated from repository files, structure, and commits.

| Criteria | Points | How to Check |
|----------|--------|--------------|
| Tests exist | 4 | Look for test files, `__tests__`, `*.test.*`, `*.spec.*` |
| Readable folder structure | 4 | Check for organized folders: `src/`, `components/`, `utils/`, etc. |
| Meaningful commits | 3 | >40% of commits have descriptive messages (not "fix", "update") |
| Clean code style | 3 | Consistent formatting, proper indentation |
| Documentation exists | 3 | README, comments in code |
| Low code smells | 3 | No obvious anti-patterns, reasonable file sizes |

**Example Calculation:**
```python
code_quality_score = 0
if has_tests: code_quality_score += 4
if has_good_structure: code_quality_score += 4
if meaningful_commits_ratio > 0.4: code_quality_score += 3
if consistent_style: code_quality_score += 3
if has_documentation: code_quality_score += 3
if low_code_smells: code_quality_score += 3
```

---

### 2. Project Diversity (0-20 points)

Checks breadth of technical skills and project types.

#### Tech Stack Breadth (0-10 points)

| Technologies | Points |
|--------------|--------|
| Frontend (React, Vue, Angular) | +2 |
| Backend (Node, Python, Java, Go) | +2 |
| Database (SQL, NoSQL) | +2 |
| API Development (REST, GraphQL) | +2 |
| DevOps/Cloud (Docker, K8s, AWS) | +2 |

#### Project Type Variation (0-10 points)

| Project Types | Points |
|---------------|--------|
| Web applications | +2 |
| APIs/Services | +2 |
| CLI tools | +2 |
| Libraries/Packages | +2 |
| Mobile/Desktop apps | +2 |

---

### 3. Activity & Consistency (0-20 points)

Measures contribution patterns and regularity.

| Metric | Points | Criteria |
|--------|--------|----------|
| Recent activity | 10 | Active in last 30 days: 10pts<br>Last 90 days: 5pts<br>Inactive: 0pts |
| Consistency | 10 | Regular commits (weekly): 10pts<br>Monthly: 5pts<br>Sporadic: 2pts |

**Activity Calculation:**
```python
activity_score = 0

# Recent activity
if commits_last_30_days > 10:
    activity_score += 10
elif commits_last_90_days > 20:
    activity_score += 5

# Consistency
weeks_with_commits = count_weeks_with_commits(last_6_months)
if weeks_with_commits > 20:  # ~80% of weeks
    activity_score += 10
elif weeks_with_commits > 13:  # ~50% of weeks
    activity_score += 5
elif weeks_with_commits > 6:  # ~25% of weeks
    activity_score += 2
```

---

### 4. Architecture Score (0-20 points)

Evaluates code organization and design patterns.

| Pattern/Feature | Points | Indicators |
|----------------|--------|------------|
| MVC/MVVM pattern | 5 | Separate models, views, controllers |
| Modular structure | 5 | Clear module separation, reusable code |
| Separation of concerns | 4 | Logic separated from UI, single responsibility |
| Reusable components | 3 | Component/function libraries |
| Services/Utils structure | 3 | Organized helper functions, services layer |

**Look for:**
- Directory structure: `/models`, `/views`, `/controllers`, `/services`
- Component reuse across files
- Clear interfaces and abstractions
- Dependency injection patterns

---

### 5. Repository Quality (0-20 points)

Measures completeness and professionalism of repositories.

| Feature | Points | Criteria |
|---------|--------|----------|
| Complete project | 5 | Not just scaffolding, actual implementation |
| CI/CD pipelines | 5 | GitHub Actions, CircleCI, Travis, etc. |
| Well-structured repo | 5 | Multiple organized files/folders |
| Community engagement | 5 | Stars > 5, forks > 2, or active issues |

---

### 6. Professionalism Score (0-10 points)

Evaluates professional presentation and documentation.

| Aspect | Points | Criteria |
|--------|--------|----------|
| Profile completeness | 3 | Name, bio, location, avatar |
| README quality | 3 | Clear, detailed READMEs with instructions |
| Community engagement | 2 | Contributions to other repos, PR reviews |
| Documentation clarity | 2 | Code comments, wikis, documentation files |

---

## 🚫 Repository Filters

**The backend MUST filter out low-quality repositories before analysis.**

### Repositories to Ignore

```typescript
// Pseudo-code for filtering
function shouldAnalyzeRepo(repo) {
  // Skip forks
  if (repo.fork) return false;
  
  // Skip repos with < 5 files
  if (repo.file_count < 5) return false;
  
  // Skip repos with no commits from owner
  if (repo.commits_by_owner === 0) return false;
  
  // Skip school assignments (common patterns)
  const assignmentPatterns = /assignment|lab\d+|project\d+|homework|cs\d+/i;
  if (assignmentPatterns.test(repo.name)) return false;
  
  // Skip auto-generated repos
  if (repo.description?.includes('generated by')) return false;
  
  // Skip repos older than 5 years with no recent activity
  if (repo.age_years > 5 && repo.days_since_last_commit > 365) return false;
  
  return true;
}
```

### Quality Filters

Only analyze repositories that meet these criteria:

✅ **Include:**
- Original work (not forks)
- 5+ files minimum
- Active or semi-active (commits within 2 years)
- Owner has commits in the repo
- Descriptive names and documentation

❌ **Exclude:**
- Forks (unless heavily modified)
- Empty/scaffold repos
- School assignments
- Auto-generated repos
- Archived repos with no activity

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Scenario | Response |
|------|----------|----------|
| 200 | Success | Full evaluation object |
| 400 | Invalid request | Error message with details |
| 401 | Authentication required | Token invalid/missing |
| 403 | Rate limited by GitHub | GitHub rate limit info |
| 404 | User not found | User doesn't exist or private |
| 429 | Rate limited by backend | Retry-After header |
| 500 | Internal error | Generic error message |
| 502 | GitHub API down | Service unavailable |
| 503 | Backend overloaded | Retry later |

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "message": "Technical details (optional)",
  "retry_after": 900 (optional, seconds),
  "status_code": 404
}
```

---

## 🛠️ Implementation Guide

### Step 1: Data Collection

```python
# Pseudo-code
def collect_github_data(username):
    # Get user profile
    profile = github.get_user(username)
    
    # Get all repositories
    repos = github.get_user_repos(username)
    
    # Filter quality repos
    quality_repos = [r for r in repos if should_analyze_repo(r)]
    
    # Get detailed data for each repo
    repo_details = []
    for repo in quality_repos[:30]:  # Limit to top 30
        details = analyze_repository(repo)
        repo_details.append(details)
    
    return profile, quality_repos, repo_details
```

### Step 2: Score Calculation

```python
def calculate_scores(repo_details, profile, activity_data):
    scores = {
        'code_quality': calculate_code_quality(repo_details),
        'project_diversity': calculate_diversity(repo_details),
        'activity': calculate_activity(activity_data),
        'architecture': calculate_architecture(repo_details),
        'repo_quality': calculate_repo_quality(repo_details),
        'professionalism': calculate_professionalism(profile, repo_details)
    }
    
    overall_score = sum(scores.values())
    level = classify_level(overall_score)
    
    return {
        'overall_score': overall_score,
        'overall_level': level,
        'job_readiness_score': calculate_job_readiness(scores),
        'tech_depth_score': calculate_tech_depth(scores),
        **scores
    }
```

### Step 3: Generate Insights

```python
def generate_insights(scores, repo_details, profile):
    # Use AI/LLM to generate insights
    recruiter_summary = generate_recruiter_insights(scores, repo_details)
    engineer_breakdown = generate_engineer_insights(repo_details, scores)
    
    return {
        'profile': format_profile(profile),
        'scores': scores,
        'recruiter_summary': recruiter_summary,
        'engineer_breakdown': engineer_breakdown
    }
```

### Step 4: Response Assembly

```python
def evaluate_github_profile(github_url):
    try:
        username = extract_username(github_url)
        
        # Step 1: Collect data
        profile, repos, repo_details = collect_github_data(username)
        
        # Step 2: Calculate scores
        scores = calculate_scores(repo_details, profile, activity_data)
        
        # Step 3: Generate insights
        response = generate_insights(scores, repo_details, profile)
        
        return response, 200
        
    except UserNotFound:
        return {'error': 'GitHub user not found'}, 404
    except RateLimitExceeded:
        return {'error': 'Rate limit exceeded', 'retry_after': 900}, 429
    except Exception as e:
        return {'error': 'Internal server error'}, 500
```

---

## 🔐 Security Considerations

1. **Rate Limiting**
   - Implement rate limiting per IP: 10 requests/hour
   - Use Redis or similar for distributed rate limiting

2. **Input Validation**
   - Validate GitHub URL format
   - Sanitize all inputs
   - Prevent injection attacks

3. **CORS**
   - Whitelist specific origins
   - Don't use `*` in production

4. **API Keys**
   - Store GitHub tokens securely
   - Rotate tokens regularly
   - Use OAuth when possible

---

## 📝 Testing Checklist

- [ ] Valid GitHub profile returns 200 with complete data
- [ ] Invalid GitHub URL returns 400
- [ ] Non-existent user returns 404
- [ ] Private profiles are handled correctly
- [ ] Rate limiting works (429 after limit)
- [ ] Health endpoint returns status
- [ ] CORS headers are correct
- [ ] All score fields are present (0-20, 0-10 ranges)
- [ ] Level classification is accurate
- [ ] Repository filtering works
- [ ] Language breakdown is calculated
- [ ] Testing analysis detects test files
- [ ] Error responses are consistent

---

## 🚀 Performance Guidelines

- **Response Time**: < 10 seconds for typical profile
- **Caching**: Cache results for 1 hour per user
- **Pagination**: Analyze max 30-50 repos per user
- **Concurrency**: Use async/parallel processing for repo analysis
- **GitHub API**: Use conditional requests (ETags) to save quota

---

## 📞 Support

For backend implementation questions:
1. Review this specification
2. Check the frontend integration at `INTEGRATION_GUIDE.md`
3. Test with provided examples
4. Open an issue if needed

---

**Document Version:** 2.0.0  
**Maintained by:** Dev-Insight-Lens Team  
**Last Updated:** December 7, 2025
