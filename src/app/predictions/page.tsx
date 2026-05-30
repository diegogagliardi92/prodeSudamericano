import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PredictionsClient } from "@/components/PredictionsClient";

export default async function PredictionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const [matches, predictions] = await Promise.all([
    prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true },
      orderBy: [{ order: "asc" }, { matchDate: "asc" }],
    }),
    prisma.prediction.findMany({ where: { userId: session.user.id } }),
  ]);

  const predMap: Record<string, { homeScore: number; awayScore: number }> = {};
  for (const p of predictions) predMap[p.matchId] = { homeScore: p.homeScore, awayScore: p.awayScore };

  return (
    <PredictionsClient
      matches={JSON.parse(JSON.stringify(matches))}
      initialPredictions={predMap}
    />
  );
}
