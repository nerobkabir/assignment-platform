export type UserRole = 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: DifficultyLevel;
  createdAt: string;
  instructorId: string;
}

export type SubmissionStatus = 'pending' | 'accepted' | 'needs_improvement';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionUrl: string;
  note: string;
  status: SubmissionStatus;
  feedback: string;
  submittedAt: string;
}