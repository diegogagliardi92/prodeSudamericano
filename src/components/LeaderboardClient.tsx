"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Player = { id:string; name:string; image:string|null; points:number; count:number; rank:number };

const MEDAL = ["🥇","🥈","🥉"];
const GLOW  = ["rgba(251,191,36,0.3)","rgba(192,192,192,0.2)","rgba(205,127,50,0.2)"];
const H     = [220, 170, 150]; // podium heights: 1st, 2nd, 3rd

export function LeaderboardClient({ board }: { board: Player[] }) {
  const top3 = board.slice(0, 3);
  // podium order: 2nd · 1st · 3rd
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean) as Player[];
  const podiumH = top3.length >= 3
    ? [H[1], H[0], H[2]]
    : top3.length === 2
    ? [H[1], H[0]]
    : [H[0]];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
        <motion.div className="text-5xl mb-2"
          animate={{ rotate:[-5,5,-5], scale:[1,1.08,1] }}
          transition={{ duration:3, repeat:Infinity, repeatDelay:2 }}>🏆</motion.div>
        <h1 className="text-3xl font-black">
          Tabla de <span className="grad-gold">Posiciones</span>
        </h1>
        <p className="text-white/35 text-sm mt-1">Se actualiza cada 60 seg</p>
      </motion.div>

      {board.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-white/40">Todavía no hay puntajes</p>
          <p className="text-white/20 text-sm mt-1">¡Sé el primero en jugar!</p>
        </motion.div>
      ) : (
        <>
          {/* Podium */}
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2 }}
            className="flex items-end justify-center gap-2 mb-8"
            style={{ height: H[0] + 80 }}
          >
            {podium.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.25 + i*0.1 }}
                className="flex flex-col items-center"
                style={{ width: 96 }}
              >
                {/* Avatar */}
                <div className="relative mb-1">
                  {p.image ? (
                    <Image src={p.image} alt={p.name}
                      width={p.rank===1?48:38} height={p.rank===1?48:38}
                      className="rounded-full ring-2 ring-white/15" />
                  ) : (
                    <div className={`rounded-full bg-white/10 flex items-center justify-center font-bold text-lg
                      ${p.rank===1?"w-12 h-12":"w-9 h-9"}`}>
                      {p.name[0]}
                    </div>
                  )}
                  {p.rank === 1 && (
                    <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl"
                      animate={{ y:[0,-4,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                      👑
                    </motion.div>
                  )}
                </div>
                <p className="text-white text-xs font-bold truncate w-full text-center px-1">
                  {p.name.split(" ")[0]}
                </p>
                <p className="grad-gold text-sm font-black">{p.points}pts</p>

                {/* Block */}
                <motion.div
                  initial={{ height:0 }} animate={{ height: podiumH[i] }}
                  transition={{ delay: 0.5+i*0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
                  className="w-full rounded-t-xl mt-2 flex items-start justify-center pt-3 overflow-hidden"
                  style={{
                    background:`linear-gradient(180deg,${GLOW[p.rank-1]} 0%,rgba(255,255,255,0.02) 100%)`,
                    border:"1px solid rgba(255,255,255,0.07)",
                    boxShadow:`0 0 24px ${GLOW[p.rank-1]}`,
                  }}
                >
                  <span className="text-xl">{MEDAL[p.rank-1]}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Full list */}
          <div className="space-y-2">
            {board.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: i*0.03 + 0.3 }}
                className="glass rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className={`w-6 text-center text-sm font-bold shrink-0
                  ${p.rank<=3 ? "grad-gold" : "text-white/25"}`}>
                  {p.rank}
                </span>
                {p.image ? (
                  <Image src={p.image} alt="" width={34} height={34} className="rounded-full ring-1 ring-white/10 shrink-0" />
                ) : (
                  <div className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-sm shrink-0">
                    {p.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-white/25 text-xs">{p.count} pronósticos</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="grad-gold font-black text-lg leading-none">{p.points}</p>
                  <p className="text-white/25 text-xs">pts</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
