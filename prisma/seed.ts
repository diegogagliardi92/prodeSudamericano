import { PrismaClient, Stage } from "@prisma/client";

const prisma = new PrismaClient();

const teams = [
  // Group A
  { name: "Ecuador", nameEs: "Ecuador", flag: "🇪🇨", group: "A" },
  { name: "Bolivia", nameEs: "Bolivia", flag: "🇧🇴", group: "A" },
  { name: "Venezuela", nameEs: "Venezuela", flag: "🇻🇪", group: "A" },
  { name: "Peru", nameEs: "Perú", flag: "🇵🇪", group: "A" },
  // Group B
  { name: "Argentina", nameEs: "Argentina", flag: "🇦🇷", group: "B" },
  { name: "Chile", nameEs: "Chile", flag: "🇨🇱", group: "B" },
  { name: "Colombia", nameEs: "Colombia", flag: "🇨🇴", group: "B" },
  { name: "Paraguay", nameEs: "Paraguay", flag: "🇵🇾", group: "B" },
  // Group C
  { name: "Brazil", nameEs: "Brasil", flag: "🇧🇷", group: "C" },
  { name: "Uruguay", nameEs: "Uruguay", flag: "🇺🇾", group: "C" },
  { name: "Panama", nameEs: "Panamá", flag: "🇵🇦", group: "C" },
  { name: "Jamaica", nameEs: "Jamaica", flag: "🇯🇲", group: "C" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();

  // Create teams
  const createdTeams: Record<string, string> = {};
  for (const team of teams) {
    const created = await prisma.team.create({ data: team });
    createdTeams[team.name] = created.id;
  }
  console.log(`✅ Created ${teams.length} teams`);

  // Create group stage matches
  const groupMatches = [
    // Group A
    { home: "Ecuador", away: "Bolivia", date: new Date("2026-06-11T18:00:00Z"), group: "A", venue: "Seattle" },
    { home: "Venezuela", away: "Peru", date: new Date("2026-06-11T21:00:00Z"), group: "A", venue: "Los Angeles" },
    { home: "Ecuador", away: "Venezuela", date: new Date("2026-06-15T18:00:00Z"), group: "A", venue: "Dallas" },
    { home: "Bolivia", away: "Peru", date: new Date("2026-06-15T21:00:00Z"), group: "A", venue: "Miami" },
    { home: "Ecuador", away: "Peru", date: new Date("2026-06-19T20:00:00Z"), group: "A", venue: "New York" },
    { home: "Bolivia", away: "Venezuela", date: new Date("2026-06-19T20:00:00Z"), group: "A", venue: "Chicago" },
    // Group B
    { home: "Argentina", away: "Chile", date: new Date("2026-06-12T00:00:00Z"), group: "B", venue: "New York" },
    { home: "Colombia", away: "Paraguay", date: new Date("2026-06-12T03:00:00Z"), group: "B", venue: "Boston" },
    { home: "Argentina", away: "Colombia", date: new Date("2026-06-16T00:00:00Z"), group: "B", venue: "Dallas" },
    { home: "Chile", away: "Paraguay", date: new Date("2026-06-16T03:00:00Z"), group: "B", venue: "Houston" },
    { home: "Argentina", away: "Paraguay", date: new Date("2026-06-20T20:00:00Z"), group: "B", venue: "Miami" },
    { home: "Chile", away: "Colombia", date: new Date("2026-06-20T20:00:00Z"), group: "B", venue: "Los Angeles" },
    // Group C
    { home: "Brazil", away: "Panama", date: new Date("2026-06-13T00:00:00Z"), group: "C", venue: "San Francisco" },
    { home: "Uruguay", away: "Jamaica", date: new Date("2026-06-13T03:00:00Z"), group: "C", venue: "Atlanta" },
    { home: "Brazil", away: "Uruguay", date: new Date("2026-06-17T00:00:00Z"), group: "C", venue: "Seattle" },
    { home: "Panama", away: "Jamaica", date: new Date("2026-06-17T03:00:00Z"), group: "C", venue: "Kansas City" },
    { home: "Brazil", away: "Jamaica", date: new Date("2026-06-21T20:00:00Z"), group: "C", venue: "New York" },
    { home: "Panama", away: "Uruguay", date: new Date("2026-06-21T20:00:00Z"), group: "C", venue: "Chicago" },
  ];

  let order = 1;
  for (const match of groupMatches) {
    await prisma.match.create({
      data: {
        homeTeamId: createdTeams[match.home],
        awayTeamId: createdTeams[match.away],
        matchDate: match.date,
        stage: Stage.GROUP,
        group: match.group,
        venue: match.venue,
        order: order++,
      },
    });
  }
  console.log(`✅ Created ${groupMatches.length} group stage matches`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
