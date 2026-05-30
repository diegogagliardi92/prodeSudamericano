"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Medal, Star } from "lucide-react";

interface Player {
  id: string;
  name: string;
  image: string | null;
  points: number;
  predictions: number;
  rank: number;
}

export function LeaderboardClient({ leaderboard }: { leaderboard: Player[] }) {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const podiumHeights = [180, 220, 160];
  const podiumColors = ["silver", "gold", "bronze"];
  const podiumGlows = [
    "rgba(192,192,192,0.2)",
    "rgba(251,191,36,0.3)",
    "rgba(205,127,50,0.2)",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl mb-3"
        >
          🏆
        </motion.div>
        <h1 className="text-3xl font-black text-white">
          Tabla de <span className="gradient-text">Posiciones</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Actualizada cada 60 segundos</p>
      </motion.div>

      {/* Podium */}
      {top3.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-end justify-center gap-3 mb-10 h-64"
        >
          {podiumOrder.map((player, i) => {
            if (!player) return null;
            const height = podiumHeights[i];
            const actualRank = player.rank;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
                className="flex flex-col items-center"
                style={{ width: 100 }}
              >
                {/* Avatar */}
                <div className="mb-2 relative">
                  {player.image ? (
                    <Image
                      src={player.image}
                      alt={player.name}
                      width={actualRank === 1 ? 52 : 40}
                      height={actualRank === 1 ? 52 : 40}
                      className="rounded-full ring-2 ring-white/20"
                    />
                  ) : (
                    <div
                      className={`rounded-full bg-white/10 flex items-center justify-center text-lg ${
                        actualRank === 1 ? "w-12 h-12" : "w-10 h-10"
                      }`}
                    >
                      {player.name[0]}
                    </div>
                  )}
                  {actualRank === 1 && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      👑
                    </motion.div>
                  )}
                </div>
                <p className="text-white text-xs font-bold text-center truncate w-full px-1">
                  {player.name.split(" ")[0]}
                </p>
                <p className="gradient-text text-sm font-black">{player.points}pts</p>

                {/* Podium block */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-t-xl mt-2 flex items-start justify-center pt-3"
                  style={{
                    background: `linear-gradient(180deg, ${podiumGlows[i]} 0%, rgba(255,255,255,0.03) 100%)`,
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: `0 0 20px ${podiumGlows[i]}`,
                  }}
                >
                  <span className="text-xl">
                    {actualRank === 1 ? "🥇" : actualRank === 2 ? "🥈" : "🥉"}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Rest of leaderboard */}
      {leaderboard.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-3">📭</div>
          <p className="text-white/40">Todavía no hay predicciones cargadas</p>
          <p className="text-white/20 text-sm mt-1">¡Sé el primero en jugar!</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 + 0.3 }}
              className="glass glass-hover rounded-2xl px-4 py-3 flex items-center gap-4"
            >
              <span
                className={`w-7 text-center font-bold text-sm ${
                  player.rank <= 3 ? "gradient-text" : "text-white/30"
                }`}
              >
                {player.rank}
              </span>
              {player.image ? (
                <Image
                  src={player.image}
                  alt={player.name}
                  width={36}
                  height={36}
                  className="rounded-full ring-1 ring-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm">
                  {player.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                <p className="text-white/30 text-xs">{player.predictions} predicciones</p>
              </div>
              <div className="text-right">
                <p className="gradient-text font-black text-lg">{player.points}</p>
                <p className="text-white/30 text-xs">puntos</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
