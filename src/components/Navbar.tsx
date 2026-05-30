"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, BarChart3, LogOut, LogIn } from "lucide-react";

const NAV = [
  { href: "/predictions", label: "Mis Pronósticos", icon: Trophy },
  { href: "/leaderboard",  label: "Tabla",           icon: BarChart3 },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 glass border-b border-white/[0.05]"
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <motion.span
            animate={{ rotate: [0,-12,12,0] }}
            transition={{ duration:2.5, repeat: Infinity, repeatDelay:5 }}
            className="text-xl"
          >⚽</motion.span>
          <span className="font-black text-base tracking-tight">
            <span className="grad-gold">Prode</span>
            <span className="text-white/40 ml-1 text-sm font-normal">2026</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors
                  ${active ? "text-white" : "text-white/45 hover:text-white/80"}`}
              >
                <Icon size={14} />
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/[0.07] -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.div key="loading" className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
            ) : session ? (
              <motion.div
                key="session"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                {session.user?.image && (
                  <Image src={session.user.image} alt="" width={28} height={28}
                    className="rounded-full ring-1 ring-white/15" />
                )}
                <span className="hidden md:block text-sm text-white/60 max-w-[110px] truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <button onClick={() => signOut()}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all">
                  <LogOut size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="signin"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => signIn()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20"
              >
                <LogIn size={14} /> Entrar
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden flex border-t border-white/[0.05]">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[11px] font-medium transition-colors
                ${active ? "text-amber-400" : "text-white/35"}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </motion.header>
  );
}
