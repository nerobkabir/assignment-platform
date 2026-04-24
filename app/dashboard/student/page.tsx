'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Assignment, Submission } from '@/types';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any).role !== 'student') {
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

  const accepted = submissions.filter(s => s.status === 'accepted').length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const needsWork = submissions.filter(s => s.status === 'needs_improvement').length;

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Learning Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your progress and submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Submissions', value: submissions.length },
            { label: 'Accepted', value: accepted },
            { label: 'Pending Review', value: pending },
            { label: 'Needs Improvement', value: needsWork },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
            <h2 className="font-semibold text-slate-900 mb-4">Progress Overview</h2>
            <div className="flex rounded-full h-4 overflow-hidden">
              <div
                style={{ width: `${(accepted / submissions.length) * 100}%` }}
                className="bg-green-500"
              />
              <div
                style={{ width: `${(pending / submissions.length) * 100}%` }}
                className="bg-amber-400"
              />
              <div
                style={{ width: `${(needsWork / submissions.length) * 100}%` }}
                className="bg-red-400"
              />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"/> Accepted ({accepted})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"/> Pending ({pending})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full"/> Needs Improvement ({needsWork})</span>
            </div>
          </div>
        )}

        {/* My Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">My Submissions</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {submissions.map(sub => {
              const assignment = assignments.find(a => a.id === sub.assignmentId);
              return (
                <div key={sub.id} className="px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900">{assignment?.title}</p>
                      <p className="text-xs text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      sub.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sub.status === 'needs_improvement' ? 'Needs Improvement' :
                       sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </div>
                  {sub.feedback && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-2">
                      <p className="text-xs font-medium text-blue-700 mb-1">Instructor Feedback:</p>
                      <p className="text-sm text-slate-700">{sub.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {submissions.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400">
                <p>No submissions yet.</p>
                <Link href="/assignments" className="text-blue-600 text-sm mt-2 inline-block">
                  Browse Assignments →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Available Assignments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-900">Available Assignments</h2>
            <Link href="/assignments" className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.slice(0, 3).map(asgn => {
              const submitted = submissions.some(s => s.assignmentId === asgn.id);
              return (
                <div key={asgn.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      asgn.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      asgn.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {asgn.difficulty}
                    </span>
                    {submitted && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Submitted</span>
                    )}
                  </div>
                  <h3 className="font-medium text-slate-900 mt-2">{asgn.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{asgn.description}</p>
                  <p className="text-xs text-slate-400 mt-3">Due: {new Date(asgn.deadline).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}