import { prisma } from "@/lib/prisma";
import { LeaderboardClient } from "@/components/LeaderboardClient";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    include: { predictions: { select: { points: true } } },
  });

  const board = users
    .map(u => ({
      id:   u.id,
      name: u.name ?? "Anónimo",
      image: u.image,
      points: u.predictions.reduce((s, p) => s + (p.points ?? 0), 0),
      count:  u.predictions.length,
    }))
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  return <LeaderboardClient board={board} />;
}
