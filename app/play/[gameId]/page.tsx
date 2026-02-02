import { prisma } from "@/lib/prisma";
import QuestionGameClient from "@/components/QuestionGameClient";

export const runtime = "nodejs"; // IMPORTANT

type PageProps = {
  params: Promise<{ gameId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { gameId } = await params;

  const questions = await prisma.question.findMany({
    where: { gameId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      text: true,
      category: true,
      type: true,
      options: true,
    },
  });

  // fallback if invalid gameId
  if (questions.length === 0) {
    const fallback = await prisma.question.findMany({
      where: { gameId: "questions" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        text: true,
        category: true,
        type: true,
        options: true,
      },
    });
    return <QuestionGameClient gameId="questions" questions={fallback} />;
  }

  return <QuestionGameClient gameId={gameId} questions={questions} />;
}
