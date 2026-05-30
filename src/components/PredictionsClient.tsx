"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Lock, ChevronDown } from "lucide-react";
import { formatMatchDate, stageLabel } from "@/lib/utils";

type Team = { id: string; name: string; nameEs: string; flag: string; group: string };
type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  stage: string;
  group: string | null;
  homeScore: number | null;
  awayScore: number | null;
  venue: string | null;
};

interface Props {
  matches: Match[];
  initialPredictions: Record<string, { homeScore: number; awayScore: number }>;
}

const STAGE_ORDER = ["GROUP", "ROUND_OF_16", "QUARTER_FINAL", "SEMI_FINAL", "THIRD_PLACE", "FINAL"];

export function PredictionsClient({ matches, initialPredictions }: Props) {
  const [predictions, setPredictions] = useState(initialPredictions);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [activeGroup, setActiveGroup] = useState<string>("A");

  const groupMatches = matches.filter((m) => m.stage === "GROUP");
  const knockoutMatches = matches.filter((m) => m.stage !== "GROUP");

  const groups = [...new Set(groupMatches.map((m) => m.group).filter(Boolean))].sort() as string[];

  const savePrediction = useCallback(
    async (matchId: string, homeScore: number, awayScore: number) => {
      if (isNaN(homeScore) || isNaN(awayScore)) return;
      setSaving(matchId);
      try {
        await fetch("/api/predictions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId, homeScore, awayScore }),
        });
        setSaved((prev) => ({ ...prev, [matchId]: true }));
        setTimeout(() => setSaved((prev) => ({ ...prev, [matchId]: false })), 2000);
      } finally {
        setSaving(null);
      }
    },
    []
  );

  const handleScore = (matchId: string, side: "home" | "away", value: string) => {
    const num = parseInt(value, 10);
    if (value === "" || (!isNaN(num) && num >= 0 && num <= 20)) {
      const current = predictions[matchId] ?? { homeScore: 0, awayScore: 0 };
      const updated = {
        ...current,
        [side === "home" ? "homeScore" : "awayScore"]: isNaN(num) ? 0 : num,
      };
      setPredictions((prev) => ({ ...prev, [matchId]: updated }));
      if (!isNaN(num)) {
        const home = side === "home" ? num : (updated.homeScore ?? 0);
        const away = side === "away" ? num : (updated.awayScore ?? 0);
        savePrediction(matchId, home, away);
      }
    }
  };

  const isLocked = (match: Match) => new Date(match.matchDate) <= new Date();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-white mb-1">
          Mis <span className="gradient-text">Predicciones</span>
        </h1>
        <p className="text-white/40 text-sm">
          Exacto = 3pts · Resultado correcto = 1pt · Guardado automático
        </p>
      </motion.div>

      {/* GROUP STAGE */}
      <Section title="Fase de Grupos">
        {/* Group tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {groups.map((g) => (
            <motion.button
              key={g}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGroup(g)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeGroup === g
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25"
                  : "glass text-white/50 hover:text-white"
              }`}
            >
              Grupo {g}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGroup}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {groupMatches
              .filter((m) => m.group === activeGroup)
              .map((match, i) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictions[match.id]}
                  locked={isLocked(match)}
                  saving={saving === match.id}
                  saved={saved[match.id]}
                  onScore={handleScore}
                  index={i}
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* KNOCKOUT */}
      {knockoutMatches.length > 0 && (
        <Section title="Fase Eliminatoria" className="mt-8">
          <div className="space-y-3">
            {STAGE_ORDER.filter((s) => s !== "GROUP").map((stage) => {
              const stageGames = knockoutMatches.filter((m) => m.stage === stage);
              if (!stageGames.length) return null;
              return (
                <div key={stage}>
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    {stageLabel(stage)}
                  </p>
                  {stageGames.map((match, i) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      prediction={predictions[match.id]}
                      locked={isLocked(match)}
                      saving={saving === match.id}
                      saved={saved[match.id]}
                      onScore={handleScore}
                      index={i}
                      multiplier={2}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">{title}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      {children}
    </div>
  );
}

function MatchCard({
  match,
  prediction,
  locked,
  saving,
  saved,
  onScore,
  index,
  multiplier = 1,
}: {
  match: Match;
  prediction?: { homeScore: number; awayScore: number };
  locked: boolean;
  saving: boolean;
  saved: boolean;
  onScore: (id: string, side: "home" | "away", val: string) => void;
  index: number;
  multiplier?: number;
}) {
  const hasPrediction = prediction !== undefined;
  const actualPlayed = match.homeScore !== null && match.awayScore !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`glass rounded-2xl p-4 transition-all glass-hover ${
        hasPrediction ? "border-white/[0.1]" : ""
      } ${locked ? "opacity-70" : ""}`}
    >
      <div className="flex items-center gap-3">
        {/* Home team */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-2xl">{match.homeTeam.flag}</span>
          <span className="font-semibold text-white text-sm truncate hidden sm:block">
            {match.homeTeam.nameEs}
          </span>
          <span className="font-semibold text-white text-xs truncate sm:hidden">
            {match.homeTeam.flag}
          </span>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {locked ? (
            <div className="flex items-center gap-2">
              {hasPrediction ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.06] text-white/50 text-sm font-bold">
                  <Lock size={10} />
                  {prediction.homeScore} – {prediction.awayScore}
                </div>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/[0.04] text-white/20 text-xs">
                  <Lock size={10} />
                  Sin predicción
                </div>
              )}
            </div>
          ) : (
            <>
              <input
                type="number"
                min={0}
                max={20}
                value={prediction?.homeScore ?? ""}
                placeholder="–"
                onChange={(e) => onScore(match.id, "home", e.target.value)}
                className="score-input"
                disabled={locked}
              />
              <span className="text-white/20 font-bold text-lg">:</span>
              <input
                type="number"
                min={0}
                max={20}
                value={prediction?.awayScore ?? ""}
                placeholder="–"
                onChange={(e) => onScore(match.id, "away", e.target.value)}
                className="score-input"
                disabled={locked}
              />
            </>
          )}

          {/* Save indicator */}
          <AnimatePresence>
            {saving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"
              />
            )}
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Check size={16} className="text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span className="font-semibold text-white text-sm truncate hidden sm:block">
            {match.awayTeam.nameEs}
          </span>
          <span className="text-2xl">{match.awayTeam.flag}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-xs text-white/25">
          <Clock size={11} />
          {formatMatchDate(new Date(match.matchDate))}
          {match.venue && <span>· {match.venue}</span>}
        </div>
        <div className="flex items-center gap-2">
          {multiplier > 1 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold">
              ×{multiplier}
            </span>
          )}
          {actualPlayed && (
            <span className="text-xs text-white/30">
              Real: {match.homeScore} – {match.awayScore}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
