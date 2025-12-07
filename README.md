# 🔍 Dev-Insight-Lens - Frontend Application

> **AI-Powered GitHub Developer Analysis Tool with Dual-Mode Insights**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern React/TypeScript frontend application for analyzing GitHub developer profiles with AI-powered insights.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Backend Connection](#backend-connection)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## 🎯 Overview

**Dev-Insight-Lens** is an intelligent GitHub profile analyzer that provides meaningful insights about software developers. The tool features **two distinct modes** designed for different audiences:

### 🎭 Two Analysis Modes

#### 1. **Recruiter Mode** 👔
Designed for software engineering recruiters who need fast, actionable hiring signals.

**What You Get:**
- ✅ Clear skill level rating (Beginner → Intermediate → Senior → Expert)
- ✅ Job readiness score & hiring recommendation
- ✅ Top strengths and risk flags
- ✅ Technical competencies overview
- ✅ Work history signals & project maturity
- ✅ Professional summary for shortlisting

**Perfect for:** HR professionals, technical recruiters, hiring managers

#### 2. **Engineer Mode** 💻
Designed for developers evaluating peers or assessing their own skills.

**What You Get:**
- 🔧 Detailed code patterns & architecture analysis
- 🔧 Testing practices & complexity insights
- 🔧 Language proficiency breakdown
- 🔧 Repository-level diagnostics
- 🔧 Commit message quality assessment
- 🔧 Technical improvement suggestions

**Perfect for:** Software engineers, tech leads, developers seeking growth

---

## 🚀 Features

### Core Capabilities
- **AI-Powered Analysis** - Comprehensive GitHub profile evaluation
- **Dual-Mode Interface** - Switch between recruiter and engineer perspectives
- **Real-Time Health Monitoring** - Backend connection status tracking
- **Smart Error Handling** - Graceful error recovery with retry logic
- **Responsive Design** - Mobile-first, works on all devices
- **Backward Compatible** - Supports both new and legacy API formats

### Analysis Metrics

The system evaluates developers across 6 core categories (110 points total):

| Category | Max Score | What It Measures |
|----------|-----------|------------------|
| Code Quality | 20 | Tests, structure, style, documentation |
| Project Diversity | 20 | Tech stack breadth, project types |
| Activity | 20 | Commit frequency, consistency |
| Architecture | 20 | Design patterns, modularity |
| Repository Quality | 20 | Completeness, CI/CD, structure |
| Professionalism | 10 | Profile quality, documentation |

**Skill Levels:**
- 0-40 points: **Beginner**
- 41-75 points: **Intermediate**
- 76-95 points: **Senior**
- 96-110 points: **Expert**

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library (Radix UI)
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Bun/npm** - Package management

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9+ or **Bun** v1.0+ ([Download Bun](https://bun.sh/))
- **Backend server** running (see [Artemis-backend](../Artemis-backend))

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/oncodeoperations/dev-insight-lens-1.git
cd dev-insight-lens-1
```

### 2. Install dependencies

```bash
# Using npm
npm install

# Or using Bun (faster)
bun install
```

### 3. Configure environment

```bash
# Copy example environment files
cp .env.development.example .env.development
cp .env.production.example .env.production
```

Edit `.env.development`:

```env
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:5000
VITE_APP_VERSION=2.0.0
```

### 4. Start the development server

```bash
# Using npm
npm run dev

# Or using Bun
bun dev
```

The app will be available at `http://localhost:8080`

---

## ⚙️ Configuration

### Environment Variables

**Development (`.env.development`):**
```env
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:5000
VITE_APP_VERSION=2.0.0
```

**Production (`.env.production`):**
```env
VITE_NODE_ENV=production
VITE_API_URL=https://artemis-backend-mx4u.onrender.com
VITE_APP_VERSION=2.0.0
```

### Environment Variables Explained:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_NODE_ENV` | Environment mode (development/production) | Yes |
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_APP_VERSION` | Application version number | No |

### Application Configuration

The app configuration is managed in `src/config/index.js`:

```javascript
{
  development: {
    apiUrl: 'http://localhost:5000',
    enableDebugLogs: true,
    enableHealthCheck: true,
    healthCheckInterval: 5 * 60 * 1000, // 5 minutes
    requestTimeout: 60000, // 60 seconds
    retryAttempts: 3
  },
  production: {
    apiUrl: 'https://artemis-backend-mx4u.onrender.com',
    enableDebugLogs: false,
    enableHealthCheck: true,
    healthCheckInterval: 10 * 60 * 1000, // 10 minutes
    requestTimeout: 30000, // 30 seconds
    retryAttempts: 2
  }
}
```

---

## 🔌 Backend Connection

### Setting Up the Backend

This frontend application requires the **Artemis Backend** to be running. 

**Option 1: Run Backend Locally**

```bash
# Navigate to backend folder
cd ../Artemis-backend

# Install dependencies
npm install

# Configure .env file
cp .env.example .env
# Add your OPENAI_API_KEY and GITHUB_TOKEN

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

**Option 2: Use Deployed Backend**

Update `.env.development`:
```env
VITE_API_URL=https://artemis-backend-mx4u.onrender.com
```

### Backend API Requirements

The frontend expects the following API endpoint:

**POST** `/api/evaluate`

**Request Body:**
```json
{
  "githubUrl": "https://github.com/username"
}
```

**Response Format:**
```json
{
  "grade": "Advanced",
  "reasoning": "Detailed analysis...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "analyzedRepos": 5,
  "totalRepos": 12,
  "username": "username",
  "timestamp": "2025-12-07T10:30:00.000Z"
}
    ],
    "risks_or_weaknesses": [
      "Limited testing coverage",
      "Few collaborative projects"
    ],
    "recommended_role_level": "Senior Software Engineer",
    "hiring_recommendation": "Yes",
    "activity_flag": "Active",
    "project_maturity_rating": "Good"
  },
  "engineer_breakdown": {
    "code_patterns": [
      "Uses modular architecture",
      "Implements MVC pattern"
    ],
    "architecture_analysis": [
      "Well-structured repositories",
      "Clear separation of concerns"
```

### Health Check

The frontend automatically monitors backend health via:

**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-07T10:30:00.000Z",
  "service": "Artemis Developer Evaluator Backend"
}
```

A visual indicator in the UI shows connection status:
- 🟢 Green: Backend online
- 🔴 Red: Backend offline
- 🟡 Yellow: Checking connection

### Troubleshooting Backend Connection

**Issue: "Backend is offline"**

1. Verify backend is running on correct port
2. Check `VITE_API_URL` in `.env.development`
3. Ensure CORS is configured on backend
4. Check browser console for errors

**Issue: CORS Errors**

Add frontend URL to backend's allowed origins:
```javascript
// Artemis-backend/src/app.js
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173
```

---

## 🎨 Project Structure

```
dev-insight-lens/
├── src/
│   ├── components/          # React components
│   │   ├── ModeToggle.tsx   # Mode switcher
│   │   ├── RecruiterView.tsx # Recruiter mode display
│   │   ├── EngineerView.tsx  # Engineer mode display
│   │   ├── ResultsCard.tsx   # Results coordinator
│   │   ├── GitHubInput.jsx   # URL input
│   │   ├── HealthCheck.jsx   # Backend status
│   │   └── ui/              # Shadcn components
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Main page
│   │   └── NotFound.tsx     # 404 page
│   ├── services/            # API services
│   │   └── api.js           # Backend integration
│   ├── types/               # TypeScript definitions
│   │   └── evaluation.ts    # Type definitions
│   ├── config/              # App configuration
│   │   └── index.js         # Environment config
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── utils/               # Helper utilities
├── public/                  # Static assets
├── .env.development         # Dev environment
├── .env.production          # Prod environment
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind setup
└── package.json             # Dependencies
```

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Adding New Components

```bash
# Using Shadcn CLI to add components
npx shadcn-ui@latest add [component-name]
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://artemis-backend-mx4u.onrender.com`)
   - `VITE_NODE_ENV`: `production`
   - `VITE_APP_VERSION`: `2.0.0`
4. Deploy automatically on push

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
# Set environment variables in Netlify dashboard
```

### Manual Build & Deploy

```bash
# Build for production
npm run build

# The dist/ folder contains static files
# Upload to any static hosting service (AWS S3, Azure, etc.)
```

---

## 🔧 Troubleshooting

### Backend Connection Issues

**Problem**: "Backend is offline" error

**Solutions**:
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check `VITE_API_URL` in `.env.development`
3. Ensure CORS is configured on backend
4. Check browser console for errors

### CORS Errors

Add your frontend URL to backend's `ALLOWED_ORIGINS`:
```env
# In Artemis-backend/.env
ALLOWED_ORIGINS=http://localhost:8080,https://your-frontend.vercel.app
```

### Port Already in Use

```bash
# Change port (default is 8080)
# Edit vite.config.ts or:
PORT=3000 npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🔗 Related Projects

- **Backend API**: [Artemis-backend](../Artemis-backend) - Node.js/Express backend service
- **Documentation**: See `BACKEND_SPEC.md`, `INTEGRATION_GUIDE.md`, `ARCHITECTURE.md`

---

## 📞 Support

If you have questions or need help:

1. Check the [Integration Guide](INTEGRATION_GUIDE.md)
2. Review the [Backend Specification](BACKEND_SPEC.md)
3. Open an issue on GitHub

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Made with ❤️ by the Dev-Insight-Lens team**
