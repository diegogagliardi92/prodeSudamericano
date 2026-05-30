import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcPoints(pH: number, pA: number, rH: number, rA: number): number {
  if (pH === rH && pA === rA) return 3;
  if (Math.sign(pH - pA) === Math.sign(rH - rA)) return 1;
  return 0;
}

export function stageLabel(stage: string): string {
  return (
    { GROUP: "Fase de Grupos", ROUND_OF_16: "Octavos de Final", QUARTER_FINAL: "Cuartos de Final",
      SEMI_FINAL: "Semifinal", THIRD_PLACE: "3° y 4° Puesto", FINAL: "Gran Final 🏆" }[stage] ?? stage
  );
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(date));
}
