# EduTrack — Assignment & Learning Analytics Platform

A full-stack Next.js application bridging instruction and evaluation with AI-powered assistance.

## 🚀 Live Demo
[Deploy on Vercel](https://vercel.com)

## ✨ Features

### Instructor Role
- Create assignments with title, description, deadline, and difficulty level
- Review all student submissions and update status (Accepted / Pending / Needs Improvement)
- AI-powered description enhancement for better assignment clarity
- AI-generated feedback for student submissions
- Analytics dashboard with Pie & Bar charts (Recharts)

### Student Role
- Browse all available assignments with difficulty filters
- Submit work via URL with a descriptive note
- View instructor feedback in real-time
- Progress tracking dashboard with visual progress bar
- AI note improvement suggestions

## 🤖 AI Implementation

The platform integrates a smart AI assistance system with three core functions:

1. **Assignment Description Enhancer** — Instructors can click "AI Enhance" while creating an assignment to automatically append structured learning objectives, evaluation criteria, and submission tips to their description.

2. **Auto Feedback Generator** — During submission review, instructors can click "Generate AI Feedback" to get a context-aware preliminary feedback based on the student's note and selected review status.

3. **Student Note Assistant** — Students get AI-powered suggestions on how to improve their submission notes before submitting.

> The AI feature is currently implemented with intelligent mock logic that demonstrates the automation workflow. To connect to a live LLM, replace the logic in `app/api/ai/route.ts` with an OpenAI or Anthropic API call.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (credentials provider)
- **Charts**: Recharts (PieChart + BarChart)
- **Icons**: Lucide React

## 📦 Installation

```bash
git clone <repo-url>
cd assignment-platform
npm install
cp .env.local.example .env.local
npm run dev
```

## 🔑 Demo Credentials

| Role       | Email                   | Password    |
|------------|-------------------------|-------------|
| Instructor | instructor@demo.com     | password123 |
| Student    | student@demo.com        | password123 |

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables:
   - `NEXTAUTH_SECRET` = (random string)
   - `NEXTAUTH_URL` = your Vercel URL
4. Deploy!

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/  # NextAuth handler
│   ├── assignments/         # Assignment CRUD
│   ├── submissions/         # Submission management
│   └── ai/                  # AI assistance endpoints
├── auth/                    # Login page
├── dashboard/
│   ├── instructor/          # Instructor analytics dashboard
│   └── student/             # Student progress dashboard
└── assignments/             # Assignment listing & submission

components/
├── Navbar.tsx               # Responsive navigation

lib/
├── auth.ts                  # NextAuth config
└── db.ts                    # In-memory data store

types/index.ts               # TypeScript interfaces
```