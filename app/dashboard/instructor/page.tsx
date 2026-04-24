'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Assignment, Submission } from '@/types';

const COLORS = {
  accepted: '#22c55e',
  pending: '#f59e0b',
  needs_improvement: '#ef4444',
};

const DIFF_COLORS = ['#3b82f6', '#8b5cf6', '#f97316'];

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewStatus, setReviewStatus] = useState<string>('pending');
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    difficulty: 'beginner',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any).role !== 'instructor') {
      router.push('/auth');
      return;
    }
    loadData();
  }, [session, status]);

  async function loadData() {
    const [aRes, sRes] = await Promise.all([
      fetch('/api/assignments'),
      fetch('/api/submissions'),
    ]);
    setAssignments(await aRes.json());
    setSubmissions(await sRes.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowCreateForm(false);
    setForm({ title: '', description: '', deadline: '', difficulty: 'beginner' });
    loadData();
  }

  async function enhanceDescription() {
    setAiLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'enhance_description', data: { description: form.description } }),
    });
    const data = await res.json();
    setForm(prev => ({ ...prev, description: data.result }));
    setAiLoading(false);
  }

  async function handleReviewSubmit() {
    if (!reviewModal) return;
    await fetch(`/api/submissions/${reviewModal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: reviewStatus, feedback: feedbackText }),
    });
    setReviewModal(null);
    loadData();
  }

  async function generateAIFeedback() {
    if (!reviewModal) return;
    setAiLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_feedback',
        data: { note: reviewModal.note, status: reviewStatus }
      }),
    });
    const data = await res.json();
    setFeedbackText(data.result);
    setAiLoading(false);
  }

  async function handleDeleteAssignment(id: string) {
    if (!confirm('Delete this assignment?')) return;
    await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    loadData();
  }

  // Analytics data
  const statusData = [
    { name: 'Accepted', value: submissions.filter(s => s.status === 'accepted').length, color: COLORS.accepted },
    { name: 'Pending', value: submissions.filter(s => s.status === 'pending').length, color: COLORS.pending },
    { name: 'Needs Improvement', value: submissions.filter(s => s.status === 'needs_improvement').length, color: COLORS.needs_improvement },
  ].filter(d => d.value > 0);

  const difficultyData = ['beginner', 'intermediate', 'advanced'].map((diff, i) => {
    const diffAssignments = assignments.filter(a => a.difficulty === diff);
    const diffSubs = submissions.filter(s => diffAssignments.some(a => a.id === s.assignmentId));
    return {
      name: diff.charAt(0).toUpperCase() + diff.slice(1),
      Assignments: diffAssignments.length,
      Submissions: diffSubs.length,
      Accepted: diffSubs.filter(s => s.status === 'accepted').length,
    };
  });

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {session?.user?.name}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            + New Assignment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Assignments', value: assignments.length, color: 'blue' },
            { label: 'Total Submissions', value: submissions.length, color: 'purple' },
            { label: 'Accepted', value: submissions.filter(s => s.status === 'accepted').length, color: 'green' },
            { label: 'Pending Review', value: submissions.filter(s => s.status === 'pending').length, color: 'amber' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Submission Status Distribution</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">No submission data yet</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Performance by Difficulty</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Assignments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Submissions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Accepted" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">All Student Submissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Assignment</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Submitted</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => {
                  const assignment = assignments.find((a: Assignment) => a.id === sub.assignmentId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{sub.studentName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{assignment?.title || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sub.status === 'needs_improvement' ? 'Needs Improvement' :
                           sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setReviewModal(sub);
                            setFeedbackText(sub.feedback);
                            setReviewStatus(sub.status);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Managed Assignments</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {assignments.map((asgn) => (
              <div key={asgn.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{asgn.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      asgn.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      asgn.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {asgn.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">
                      Due: {new Date(asgn.deadline).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      {submissions.filter(s => s.assignmentId === asgn.id).length} submissions
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAssignment(asgn.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Create New Assignment</h3>
              <button type="button" onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <button
                    type="button"
                    onClick={enhanceDescription}
                    disabled={aiLoading || !form.description}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    🤖 {aiLoading ? 'Enhancing...' : 'AI Enhance'}
                  </button>
                </div>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the assignment..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={form.deadline}
                    onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Review Submission</h3>
              <button onClick={() => setReviewModal(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Student</p>
                <p className="font-medium text-slate-900">{reviewModal.studentName}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Submission URL</p>
                <a href={reviewModal.submissionUrl} target="_blank" className="text-blue-600 text-sm break-all">
                  {reviewModal.submissionUrl}
                </a>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Student Note</p>
                <p className="text-slate-700 text-sm">{reviewModal.note}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={reviewStatus}
                  onChange={e => setReviewStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Feedback</label>
                  <button
                    onClick={generateAIFeedback}
                    disabled={aiLoading}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    🤖 {aiLoading ? 'Generating...' : 'Generate AI Feedback'}
                  </button>
                </div>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write feedback for the student..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setReviewModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}