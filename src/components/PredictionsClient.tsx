"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Team  = { id:string; nameEs:string; flag:string; group:string };
type Match = {
  id:string; homeTeam:Team; awayTeam:Team;
  matchDate:string; stage:string; group:string|null;
  homeScore:number|null; awayScore:number|null; venue:string|null;
};
type PredMap = Record<string, { homeScore:number; awayScore:number }>;

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export function PredictionsClient({ matches, initialPredictions }:
  { matches: Match[]; initialPredictions: PredMap }) {

  const [preds, setPreds]   = useState<PredMap>(initialPredictions);
  const [saving, setSaving] = useState<string|null>(null);
  const [saved,  setSaved]  = useState<Record<string,boolean>>({});
  const [tab,    setTab]    = useState("A");
  const saveTimer = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const groupMatches = matches.filter(m => m.stage === "GROUP");
  const groups = GROUPS.filter(g => groupMatches.some(m => m.group === g));

  const save = useCallback(async (matchId: string, home: number, away: number) => {
    setSaving(matchId);
    try {
      await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, homeScore: home, awayScore: away }),
      });
      setSaved(prev => ({ ...prev, [matchId]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [matchId]: false })), 1800);
    } finally {
      setSaving(null);
    }
  }, []);

  const onChange = (matchId: string, side: "home"|"away", raw: string) => {
    const n = parseInt(raw, 10);
    if (raw !== "" && (isNaN(n) || n < 0 || n > 20)) return;
    const curr = preds[matchId] ?? { homeScore:0, awayScore:0 };
    const next  = { ...curr, [side==="home" ? "homeScore":"awayScore"]: isNaN(n) ? 0 : n };
    setPreds(prev => ({ ...prev, [matchId]: next }));
    clearTimeout(saveTimer.current[matchId]);
    if (!isNaN(n)) {
      saveTimer.current[matchId] = setTimeout(() =>
        save(matchId, next.homeScore, next.awayScore), 600);
    }
  };

  const locked = (m: Match) => new Date(m.matchDate) <= new Date();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="mb-7">
        <h1 className="text-3xl font-black">
          Mis <span className="grad-gold">Pronósticos</span>
        </h1>
        <p className="text-white/35 text-sm mt-1">
          Exacto = <span className="text-amber-400 font-semibold">3pts</span> &nbsp;·&nbsp;
          Resultado = <span className="text-green-400 font-semibold">1pt</span> &nbsp;·&nbsp;
          Guardado automático
        </p>
      </motion.div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {groups.map(g => (
          <motion.button key={g} whileTap={{ scale:0.93 }} onClick={() => setTab(g)}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all
              ${tab===g ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25" : "glass text-white/40 hover:text-white"}`}>
            Grupo {g}
          </motion.button>
        ))}
      </div>

      {/* Match cards */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
          transition={{ duration:0.18 }}
          className="space-y-2.5"
        >
          {groupMatches.filter(m => m.group === tab).map((m, i) => {
            const p = preds[m.id];
            const lck = locked(m);
            return (
              <motion.div key={m.id}
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.04 }}
                className={`glass rounded-2xl p-4 ${p ? "border-white/[0.10]" : ""} ${lck ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {/* Home */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-[1.6rem] leading-none">{m.homeTeam.flag}</span>
                    <span className="font-semibold text-sm truncate hidden xs:block">{m.homeTeam.nameEs}</span>
                  </div>

                  {/* Score inputs / locked display */}
                  <div className="flex items-center gap-2 shrink-0">
                    {lck ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-white/40 text-sm font-bold">
                        <Lock size={11} />
                        {p ? `${p.homeScore} – ${p.awayScore}` : "–"}
                      </div>
                    ) : (
                      <>
                        <input type="number" min={0} max={20} placeholder="–"
                          value={p?.homeScore ?? ""}
                          onChange={e => onChange(m.id, "home", e.target.value)}
                          className="score-input" />
                        <span className="text-white/20 font-bold text-xl select-none">:</span>
                        <input type="number" min={0} max={20} placeholder="–"
                          value={p?.awayScore ?? ""}
                          onChange={e => onChange(m.id, "away", e.target.value)}
                          className="score-input" />
                      </>
                    )}

                    {/* Status */}
                    <div className="w-5 flex items-center justify-center">
                      <AnimatePresence>
                        {saving===m.id && (
                          <motion.div key="spin"
                            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                            className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        )}
                        {saved[m.id] && (
                          <motion.div key="check"
                            initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ opacity:0 }}>
                            <Check size={15} className="text-green-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Away */}
                  <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                    <span className="font-semibold text-sm truncate hidden xs:block">{m.awayTeam.nameEs}</span>
                    <span className="text-[1.6rem] leading-none">{m.awayTeam.flag}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/[0.04] text-[11px] text-white/25">
                  <Clock size={10} />
                  {formatDate(m.matchDate)}
                  {m.venue && <span>· {m.venue}</span>}
                  {m.homeScore !== null && (
                    <span className="ml-auto text-white/20">
                      Real: {m.homeScore}–{m.awayScore}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
