import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user || {};
  const role = user.role;
  const userId = user.id;

  if (role === 'instructor') {
    return NextResponse.json(db.getSubmissions());
  } else {
    return NextResponse.json(db.getSubmissionsByStudent(userId));
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const user = (session && session.user) || {};
  if (!session || user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const submission = {
    id: `sub-${Date.now()}`,
    assignmentId: body.assignmentId,
    studentId: user.id,
    studentName: user.name || 'Unknown',
    submissionUrl: body.submissionUrl,
    note: body.note,
    status: 'pending',
    feedback: '',
    submittedAt: new Date().toISOString(),
  };

  db.createSubmission(submission);
  return NextResponse.json(submission, { status: 201 });
}