import { Assignment, Submission, User } from '@/types';

// In-memory database (replace with real DB in production)
let users: User[] = [
  {
    id: 'inst-1',
    name: 'John Instructor',
    email: 'instructor@demo.com',
    role: 'instructor',
    password: 'password123',
  },
  {
    id: 'stu-1',
    name: 'Alice Student',
    email: 'student@demo.com',
    role: 'student',
    password: 'password123',
  },
  {
    id: 'stu-2',
    name: 'Bob Student',
    email: 'bob@demo.com',
    role: 'student',
    password: 'password123',
  },
];

let assignments: Assignment[] = [
  {
    id: 'asgn-1',
    title: 'Build a Todo App',
    description: 'Create a fully functional Todo application using React with add, delete, and complete features.',
    deadline: '2026-05-01',
    difficulty: 'beginner',
    createdAt: '2026-04-20T10:00:00Z',
    instructorId: 'inst-1',
  },
  {
    id: 'asgn-2',
    title: 'REST API with Express',
    description: 'Build a RESTful API with CRUD operations for a blog platform using Express and MongoDB.',
    deadline: '2026-05-10',
    difficulty: 'intermediate',
    createdAt: '2026-04-21T10:00:00Z',
    instructorId: 'inst-1',
  },
  {
    id: 'asgn-3',
    title: 'Full-Stack E-Commerce',
    description: 'Develop a complete e-commerce platform with authentication, cart, payment integration.',
    deadline: '2026-05-20',
    difficulty: 'advanced',
    createdAt: '2026-04-22T10:00:00Z',
    instructorId: 'inst-1',
  },
];

let submissions: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asgn-1',
    studentId: 'stu-1',
    studentName: 'Alice Student',
    submissionUrl: 'https://github.com/alice/todo-app',
    note: 'Used useState and localStorage for persistence.',
    status: 'accepted',
    feedback: 'Great work! Clean code and good use of hooks.',
    submittedAt: '2026-04-23T14:00:00Z',
  },
  {
    id: 'sub-2',
    assignmentId: 'asgn-2',
    studentId: 'stu-2',
    studentName: 'Bob Student',
    submissionUrl: 'https://github.com/bob/rest-api',
    note: 'Implemented all CRUD endpoints with JWT auth.',
    status: 'needs_improvement',
    feedback: 'Good structure but missing error handling in routes.',
    submittedAt: '2026-04-23T16:00:00Z',
  },
  {
    id: 'sub-3',
    assignmentId: 'asgn-1',
    studentId: 'stu-2',
    studentName: 'Bob Student',
    submissionUrl: 'https://github.com/bob/todo',
    note: 'Basic todo with React.',
    status: 'pending',
    feedback: '',
    submittedAt: '2026-04-24T09:00:00Z',
  },
];

export const db = {
  getUsers: () => users,
  getUserByEmail: (email: string) => users.find(u => u.email === email),
  getUserById: (id: string) => users.find(u => u.id === id),

  getAssignments: () => assignments,
  getAssignmentById: (id: string) => assignments.find(a => a.id === id),
  createAssignment: (assignment: Assignment) => {
    assignments.push(assignment);
    return assignment;
  },
  updateAssignment: (id: string, data: Partial<Assignment>) => {
    assignments = assignments.map(a => a.id === id ? { ...a, ...data } : a);
    return assignments.find(a => a.id === id);
  },
  deleteAssignment: (id: string) => {
    assignments = assignments.filter(a => a.id !== id);
  },

  getSubmissions: () => submissions,
  getSubmissionsByStudent: (studentId: string) =>
    submissions.filter(s => s.studentId === studentId),
  getSubmissionsByAssignment: (assignmentId: string) =>
    submissions.filter(s => s.assignmentId === assignmentId),
  getSubmissionById: (id: string) => submissions.find(s => s.id === id),
  createSubmission: (submission: Submission) => {
    submissions.push(submission);
    return submission;
  },
  updateSubmission: (id: string, data: Partial<Submission>) => {
    submissions = submissions.map(s => s.id === id ? { ...s, ...data } : s);
    return submissions.find(s => s.id === id);
  },
};