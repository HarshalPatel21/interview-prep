interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface LeetcodeQuestion {
  id: string;
  interviewId: interviewId,
  questionId: string,
  title: string,
  content: string,
  difficulty: string,
  exampleTestcaseList: string[],
  codeSnippets: codeSnippets[],
  topicTags: topicTag[],
  solution: solution,
}

interface codeSnippets{
  lang:string;
  langSlug:string;
  code:string;
}

interface topicTag{
  name:string;
  slug:string
}

interface solution{
  id:string;
  content:string
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface CreateLeetcodeFeedbackParams {
  interviewId: string;
  userId: string;
  title: string;
  code: string;
  description: string;
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  technical?: boolean
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLeetcodeQuestionParams{
  interviewId: string;
  userId: string;
  leetcodeQuestionId?: string;
}

interface GetLeetcodeQuestionByInterviewIdParams{
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
interface retakeInterviewProps {
  interviewId: string;
}
