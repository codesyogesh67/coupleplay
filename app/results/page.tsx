import Results from "@/components/games/Results";

export default function Page({
  searchParams,
}: {
  searchParams: { score?: string; game?: string };
}) {
  const score = searchParams.score ? Number(searchParams.score) : null;
  const game = searchParams.game ?? null;

  return <Results score={score} game={game} />;
}
