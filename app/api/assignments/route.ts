import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Assignment } from '@/types';

export async function GET() {
  const assignments = db.getAssignments();
  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'instructor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const assignment: Assignment = {
    id: `asgn-${Date.now()}`,
    title: body.title,
    description: body.description,
    deadline: body.deadline,
    difficulty: body.difficulty,
    createdAt: new Date().toISOString(),
    instructorId: (session.user as any).id,
  };

  db.createAssignment(assignment);
  return NextResponse.json(assignment, { status: 201 });
}