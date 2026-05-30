"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trophy, BarChart3, LogOut, LogIn } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 glass border-b border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            ⚽
          </motion.span>
          <span className="font-bold text-lg tracking-tight">
            <span className="gradient-text">Prode</span>
            <span className="text-white/60 ml-1 text-sm font-normal">Mundial 2026</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/predictions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Trophy size={15} />
            Mis Predicciones
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <BarChart3 size={15} />
            Tabla
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-white/10"
                />
              )}
              <span className="hidden sm:block text-sm text-white/70 max-w-[120px] truncate">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => signIn()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
            >
              <LogIn size={15} />
              Entrar
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
