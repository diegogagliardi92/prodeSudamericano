import { prisma } from "@/lib/prisma";
import { LeaderboardClient } from "@/components/LeaderboardClient";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    include: {
      predictions: {
        where: { points: { not: null } },
        select: { points: true },
      },
    },
  });

  const leaderboard = users
    .map((u) => ({
      id: u.id,
      name: u.name ?? "Anónimo",
      image: u.image,
      points: u.predictions.reduce((acc, p) => acc + (p.points ?? 0), 0),
      predictions: u.predictions.length,
    }))
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  return <LeaderboardClient leaderboard={leaderboard} />;
}
