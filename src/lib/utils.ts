import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  if (predictedHome === actualHome && predictedAway === actualAway) return 3;
  const predictedResult = Math.sign(predictedHome - predictedAway);
  const actualResult = Math.sign(actualHome - actualAway);
  if (predictedResult === actualResult) return 1;
  return 0;
}

export function stageLabel(stage: string): string {
  const labels: Record<string, string> = {
    GROUP: "Fase de Grupos",
    ROUND_OF_16: "Octavos de Final",
    QUARTER_FINAL: "Cuartos de Final",
    SEMI_FINAL: "Semifinal",
    THIRD_PLACE: "3er y 4to Puesto",
    FINAL: "Final",
  };
  return labels[stage] ?? stage;
}

export function formatMatchDate(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(date));
}
