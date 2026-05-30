import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEAMS = [
  // Group A
  { name: "Ecuador",   nameEs: "Ecuador",   flag: "🇪🇨", group: "A" },
  { name: "Bolivia",   nameEs: "Bolivia",   flag: "🇧🇴", group: "A" },
  { name: "Venezuela", nameEs: "Venezuela", flag: "🇻🇪", group: "A" },
  { name: "Peru",      nameEs: "Perú",      flag: "🇵🇪", group: "A" },
  // Group B
  { name: "Argentina", nameEs: "Argentina", flag: "🇦🇷", group: "B" },
  { name: "Chile",     nameEs: "Chile",     flag: "🇨🇱", group: "B" },
  { name: "Colombia",  nameEs: "Colombia",  flag: "🇨🇴", group: "B" },
  { name: "Paraguay",  nameEs: "Paraguay",  flag: "🇵🇾", group: "B" },
  // Group C
  { name: "Brazil",    nameEs: "Brasil",    flag: "🇧🇷", group: "C" },
  { name: "Uruguay",   nameEs: "Uruguay",   flag: "🇺🇾", group: "C" },
  { name: "Panama",    nameEs: "Panamá",    flag: "🇵🇦", group: "C" },
  { name: "Jamaica",   nameEs: "Jamaica",   flag: "🇯🇲", group: "C" },
];

async function main() {
  console.log("🌱 Limpiando datos...");
  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();

  console.log("⚽ Creando equipos...");
  const t: Record<string, string> = {};
  for (const team of TEAMS) {
    const created = await prisma.team.create({ data: team });
    t[team.name] = created.id;
  }

  console.log("📅 Creando partidos...");
  const MATCHES = [
    // Grupo A
    { h: "Ecuador",   a: "Bolivia",   date: "2026-06-11T18:00:00Z", g: "A", v: "Seattle",     o: 1 },
    { h: "Venezuela", a: "Peru",      date: "2026-06-11T21:00:00Z", g: "A", v: "Los Angeles",  o: 2 },
    { h: "Ecuador",   a: "Venezuela", date: "2026-06-15T21:00:00Z", g: "A", v: "Dallas",       o: 3 },
    { h: "Bolivia",   a: "Peru",      date: "2026-06-15T18:00:00Z", g: "A", v: "Miami",        o: 4 },
    { h: "Ecuador",   a: "Peru",      date: "2026-06-19T20:00:00Z", g: "A", v: "New York",     o: 5 },
    { h: "Bolivia",   a: "Venezuela", date: "2026-06-19T20:00:00Z", g: "A", v: "Chicago",      o: 6 },
    // Grupo B
    { h: "Argentina", a: "Chile",     date: "2026-06-12T00:00:00Z", g: "B", v: "New York",     o: 7 },
    { h: "Colombia",  a: "Paraguay",  date: "2026-06-12T03:00:00Z", g: "B", v: "Boston",       o: 8 },
    { h: "Argentina", a: "Colombia",  date: "2026-06-16T00:00:00Z", g: "B", v: "Dallas",       o: 9 },
    { h: "Chile",     a: "Paraguay",  date: "2026-06-16T03:00:00Z", g: "B", v: "Houston",      o: 10 },
    { h: "Argentina", a: "Paraguay",  date: "2026-06-20T20:00:00Z", g: "B", v: "Miami",        o: 11 },
    { h: "Chile",     a: "Colombia",  date: "2026-06-20T20:00:00Z", g: "B", v: "Los Angeles",  o: 12 },
    // Grupo C
    { h: "Brazil",    a: "Panama",    date: "2026-06-13T00:00:00Z", g: "C", v: "San Francisco",o: 13 },
    { h: "Uruguay",   a: "Jamaica",   date: "2026-06-13T03:00:00Z", g: "C", v: "Atlanta",      o: 14 },
    { h: "Brazil",    a: "Uruguay",   date: "2026-06-17T00:00:00Z", g: "C", v: "Seattle",      o: 15 },
    { h: "Panama",    a: "Jamaica",   date: "2026-06-17T03:00:00Z", g: "C", v: "Kansas City",  o: 16 },
    { h: "Brazil",    a: "Jamaica",   date: "2026-06-21T20:00:00Z", g: "C", v: "New York",     o: 17 },
    { h: "Panama",    a: "Uruguay",   date: "2026-06-21T20:00:00Z", g: "C", v: "Chicago",      o: 18 },
  ];

  for (const m of MATCHES) {
    await prisma.match.create({
      data: {
        homeTeamId: t[m.h],
        awayTeamId: t[m.a],
        matchDate:  new Date(m.date),
        stage:      "GROUP",
        group:      m.g,
        venue:      m.v,
        order:      m.o,
      },
    });
  }

  console.log(`✅ ${MATCHES.length} partidos creados. ¡Listo!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
