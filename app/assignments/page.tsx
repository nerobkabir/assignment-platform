'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Assignment, Submission } from '@/types';

export default function AssignmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [filterDiff, setFilterDiff] = useState('all');
  const [form, setForm] = useState({ submissionUrl: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth'); return; }
    loadData();
  }, [session, status]);

  async function loadData() {
    const [aRes, sRes] = await Promise.all([
      fetch('/api/assignments'),
      fetch('/api/submissions'),
    ]);
    setAssignments(await aRes.json());
    if (session) setSubmissions(await sRes.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submitModal) return;
    setLoading(true);
    await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId: submitModal.id, ...form }),
    });
    setLoading(false);
    setSubmitModal(null);
    setForm({ submissionUrl: '', note: '' });
    setSuccess('Submitted successfully!');
    setTimeout(() => setSuccess(''), 3000);
    loadData();
  }

  async function suggestNote() {
    setAiLoading(true);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'suggest_note_improvement', data: { note: form.note } }),
    });
    const data = await res.json();
    alert('💡 AI Suggestion:\n\n' + data.result);
    setAiLoading(false);
  }

  const filtered = filterDiff === 'all'
    ? assignments
    : assignments.filter(a => a.difficulty === filterDiff);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-500 mt-1">
            {role === 'student' ? 'Browse and submit assignments' : 'All platform assignments'}
          </p>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
            ✅ {success}
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
            <button
              key={d}
              onClick={() => setFilterDiff(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                filterDiff === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(asgn => {
            const userSub = submissions.find(s => s.assignmentId === asgn.id);
            const isOverdue = new Date(asgn.deadline) < new Date();

            return (
              <div key={asgn.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    asgn.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    asgn.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {asgn.difficulty}
                  </span>
                  {userSub && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      userSub.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      userSub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {userSub.status === 'needs_improvement' ? 'Needs Work' : userSub.status}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-slate-900 text-lg mb-2">{asgn.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {asgn.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                    {isOverdue ? '⚠️ Overdue' : '📅'} {new Date(asgn.deadline).toLocaleDateString()}
                  </span>
                  {role === 'student' && !userSub && (
                    <button
                      onClick={() => setSubmitModal(asgn)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      Submit
                    </button>
                  )}
                  {role === 'student' && userSub && (
                    <span className="text-xs text-slate-400">Already submitted</span>
                  )}
                </div>

                {/* Show feedback */}
                {userSub?.feedback && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-medium text-blue-700 mb-1">Instructor Feedback:</p>
                    <p className="text-xs text-slate-700">{userSub.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            No assignments found.
          </div>
        )}
      </main>

      {/* Submit Modal */}
      {submitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Submit Assignment</h3>
              <button onClick={() => setSubmitModal(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="font-medium text-slate-900">{submitModal.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                submitModal.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                submitModal.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {submitModal.difficulty}
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Submission URL</label>
                <input
                  required
                  type="url"
                  value={form.submissionUrl}
                  onChange={e => setForm(p => ({ ...p, submissionUrl: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/yourusername/project"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Note</label>
                  <button
                    type="button"
                    onClick={suggestNote}
                    disabled={aiLoading}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    🤖 {aiLoading ? 'Thinking...' : 'AI Tips'}
                  </button>
                </div>
                <textarea
                  required
                  value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your implementation, approach, and any challenges..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}