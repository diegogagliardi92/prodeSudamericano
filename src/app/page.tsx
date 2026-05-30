"use client";

import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Trophy, Zap, Users, Target } from "lucide-react";

const floatingFlags = ["🇦🇷", "🇧🇷", "🇺🇾", "🇨🇴", "🇨🇱", "🇪🇨", "🇵🇪", "🇧🇴"];

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating flags */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingFlags.map((flag, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl md:text-4xl select-none"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              top: `${15 + (i * 17) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            {flag}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/20 text-amber-400 text-sm font-medium mb-8"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.span>
          FIFA World Cup 2026 · USA · México · Canadá
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none"
        >
          <span className="text-white">El Prode</span>
          <br />
          <span className="gradient-text">del Mundial</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Predecí los resultados, acumulá puntos y demostrá que sos el más{" "}
          <span className="text-white/80 font-medium">canchero</span> entre tus amigos.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {session ? (
            <Link href="/predictions">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(251,191,36,0.35)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-lg shadow-xl shadow-amber-500/25 transition-all"
              >
                <Zap size={20} />
                Hacer mis predicciones
              </motion.button>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(251,191,36,0.35)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => signIn()}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-lg shadow-xl shadow-amber-500/25 transition-all"
            >
              <Zap size={20} />
              Empezar a jugar
            </motion.button>
          )}
          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white/70 hover:text-white font-semibold text-lg transition-all hover:border-white/20"
            >
              <Trophy size={20} />
              Ver tabla
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto"
        >
          {[
            { icon: Target, value: "78", label: "Partidos" },
            { icon: Users, value: "48", label: "Equipos" },
            { icon: Trophy, value: "3pts", label: "Por exacto" },
          ].map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, scale: 1.03 }}
              className="glass rounded-2xl p-4 text-center cursor-default transition-all hover:border-white/14"
            >
              <Icon size={18} className="mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-black gradient-text">{value}</div>
              <div className="text-xs text-white/40 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
