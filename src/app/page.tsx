"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";
import { Zap, Trophy, Users, Target, ArrowRight } from "lucide-react";

const FLAGS = ["🇦🇷","🇧🇷","🇺🇾","🇨🇴","🇨🇱","🇪🇨","🇵🇪","🇧🇴","🇻🇪","🇵🇾","🇵🇦","🇯🇲"];

const STATS = [
  { icon: Target,  value: "78",   label: "Partidos",   color: "#fbbf24" },
  { icon: Users,   value: "48",   label: "Selecciones",color: "#4ade80" },
  { icon: Trophy,  value: "3pts", label: "Por exacto", color: "#a78bfa" },
];

function FloatingFlag({ flag, x, y, delay }: { flag:string; x:number; y:number; delay:number }) {
  return (
    <motion.div
      className="absolute select-none pointer-events-none text-3xl sm:text-4xl"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0.12, 0.25, 0.12], y: [0, -18, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {flag}
    </motion.div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="cursor-default"
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center overflow-hidden px-4 py-12">

      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] bg-amber-500/10 -top-32 -left-32"
          animate={{ scale:[1,1.15,1], opacity:[0.5,0.8,0.5] }}
          transition={{ duration:8, repeat:Infinity, ease:"easeInOut" }} />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] bg-green-500/10 -bottom-32 -right-32"
          animate={{ scale:[1.15,1,1.15], opacity:[0.5,0.8,0.5] }}
          transition={{ duration:8, repeat:Infinity, ease:"easeInOut", delay:1 }} />
        <motion.div className="absolute w-[700px] h-[700px] rounded-full blur-[160px] bg-violet-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate:360 }}
          transition={{ duration:35, repeat:Infinity, ease:"linear" }} />
      </div>

      {/* ── Floating flags ── */}
      {FLAGS.map((f, i) => (
        <FloatingFlag key={i} flag={f}
          x={5 + (i * 9) % 88}
          y={8 + (i * 13) % 84}
          delay={i * 0.35} />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 text-center max-w-2xl w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-amber-500/25 border text-amber-400 text-xs font-semibold mb-7 tracking-wide uppercase"
        >
          <motion.span animate={{ scale:[1,1.3,1] }} transition={{ duration:1.5, repeat:Infinity, repeatDelay:2 }}>
            🏆
          </motion.span>
          FIFA World Cup · USA · México · Canadá · 2026
        </motion.div>

        {/* Heading */}
        <TiltCard>
          <motion.h1
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.65, delay:0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] mb-5"
          >
            <span className="text-white">El Prode</span>
            <br />
            <span className="grad-gold">del Mundial</span>
          </motion.h1>
        </TiltCard>

        <motion.p
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, delay:0.2 }}
          className="text-base sm:text-lg text-white/45 mb-10 max-w-md mx-auto leading-relaxed"
        >
          Predecí los marcadores exactos, sumá puntos y{" "}
          <span className="text-white/75 font-medium">demostrá que sos el más picante</span>{" "}
          del grupo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14"
        >
          {session ? (
            <Link href="/predictions">
              <motion.button
                whileHover={{ scale:1.04, boxShadow:"0 0 50px rgba(251,191,36,0.35)" }}
                whileTap={{ scale:0.96 }}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-base shadow-xl shadow-amber-500/20 transition-shadow"
              >
                <Zap size={18} />
                Hacer mis pronósticos
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale:1.04, boxShadow:"0 0 50px rgba(251,191,36,0.35)" }}
              whileTap={{ scale:0.96 }}
              onClick={() => signIn()}
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-base shadow-xl shadow-amber-500/20 transition-shadow"
            >
              <Zap size={18} />
              Empezar a jugar
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}

          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl glass font-semibold text-base text-white/60 hover:text-white transition-colors"
            >
              <Trophy size={18} />
              Ver tabla
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, delay:0.5 }}
          className="grid grid-cols-3 gap-3 max-w-sm mx-auto"
        >
          {STATS.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              whileHover={{ y:-5, scale:1.04 }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.55 + i*0.08 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <Icon size={16} className="mx-auto mb-1.5" style={{ color }} />
              <div className="text-2xl font-black" style={{
                background: `linear-gradient(135deg, ${color}, ${color}88)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {value}
              </div>
              <div className="text-[11px] text-white/35 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
