import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PredictionsClient } from "@/components/PredictionsClient";

export default async function PredictionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ stage: "asc" }, { order: "asc" }, { matchDate: "asc" }],
  });

  const predictions = await prisma.prediction.findMany({
    where: { userId: session.user.id },
  });

  const predictionsMap: Record<string, { homeScore: number; awayScore: number }> = {};
  for (const p of predictions) {
    predictionsMap[p.matchId] = { homeScore: p.homeScore, awayScore: p.awayScore };
  }

  return (
    <PredictionsClient
      matches={JSON.parse(JSON.stringify(matches))}
      initialPredictions={predictionsMap}
    />
  );
}
