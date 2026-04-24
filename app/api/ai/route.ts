import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


function generateAIFeedback(note: string, status: string): string {
  const feedbackTemplates = {
    accepted: [
      `Excellent submission! Your note "${note.substring(0, 40)}..." demonstrates strong understanding. The implementation is clean and well-structured. Keep up the great work!`,
      `Outstanding work! You clearly grasped the core concepts. The approach described in your note shows thoughtful problem-solving skills.`,
    ],
    needs_improvement: [
      `Good attempt! However, based on your note "${note.substring(0, 40)}...", there are areas to improve. Consider adding more error handling and edge case coverage.`,
      `You're on the right track! Review the requirements again and focus on code quality and documentation.`,
    ],
    pending: [
      `Submission received and under review. Your note shows initiative. We'll provide detailed feedback soon.`,
    ],
  };

  const templates = feedbackTemplates[status as keyof typeof feedbackTemplates] ||
    feedbackTemplates.pending;
  return templates[Math.floor(Math.random() * templates.length)];
}

function enhanceDescription(description: string): string {
  const enhancements = [
    `\n\n**Learning Objectives:**\n- Understand core concepts through hands-on practice\n- Apply best practices for clean, maintainable code\n- Demonstrate problem-solving and critical thinking\n\n**Evaluation Criteria:**\n- Code quality and organization (30%)\n- Feature completeness (40%)\n- Documentation and README (20%)\n- Creativity and innovation (10%)`,
    `\n\n**Requirements Breakdown:**\n1. Core functionality must be fully implemented\n2. Code should be well-commented\n3. Include a README with setup instructions\n4. Handle edge cases and errors gracefully\n\n**Submission Tips:**\n- Test thoroughly before submitting\n- Ensure your repository is public`,
  ];

  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
  return description + randomEnhancement;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action, data } = body;

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (action === 'generate_feedback') {
    const feedback = generateAIFeedback(data.note || '', data.status || 'pending');
    return NextResponse.json({ result: feedback });
  }

  if (action === 'enhance_description') {
    const enhanced = enhanceDescription(data.description || '');
    return NextResponse.json({ result: enhanced });
  }

  if (action === 'suggest_note_improvement') {
    const suggestions = [
      `Consider adding: what technologies/tools you used, any challenges you faced, and how you solved them.`,
      `Enhance your note by describing your approach, mentioning key features implemented, and any trade-offs you made.`,
      `A good submission note includes: your tech stack choices, implementation approach, and what you learned.`,
    ];
    return NextResponse.json({
      result: suggestions[Math.floor(Math.random() * suggestions.length)]
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}