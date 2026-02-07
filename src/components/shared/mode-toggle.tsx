"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-16 h-8 rounded-full bg-muted/20 animate-pulse" />
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-16 h-8 rounded-full cursor-pointer overflow-hidden shadow-inner transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{
        background: isDark
          ? "linear-gradient(81.55deg, #041326 10.28%, #0E314C 100%)"
          : "linear-gradient(81.55deg, #77C2D0 10.28%, #3D91A7 100%)",
      }}
      aria-label="Toggle theme"
    >
      {/* Stars (Dark mode only) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-white rounded-full opacity-80 shadow-[0_0_2px_#fff]" />
        <div className="absolute top-4 right-2 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
        <div className="absolute bottom-2 right-5 w-1 h-1 bg-white rounded-full opacity-70 shadow-[0_0_3px_#fff]" />
        <div className="absolute top-1 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
        <div className="absolute top-5 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
      </motion.div>

      {/* Clouds (Light mode only) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1, x: isDark ? 10 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-3 right-2 w-5 h-2 bg-white/40 rounded-full blur-[1px]" />
        <div className="absolute top-1 right-6 w-4 h-1.5 bg-white/30 rounded-full blur-[1px]" />
        <div className="absolute bottom-1 right-5 w-6 h-2.5 bg-white/50 rounded-full blur-[1px]" />
        <div className="absolute top-4 left-8 w-3 h-1 bg-white/20 rounded-full blur-[1px]" />
      </motion.div>

      {/* Toggle Knob (Sun/Moon) */}
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full shadow-md z-10 flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{
          x: isDark ? 32 : 0,
          backgroundColor: isDark ? "#E2E8F0" : "#FFC700",
          boxShadow: isDark 
            ? "inset -2px -2px 4px rgba(0,0,0,0.2), 0 0 8px rgba(255,255,255,0.4)" 
            : "inset -2px -2px 4px rgba(255,100,0,0.3), 0 0 10px rgba(255,200,0,0.6)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Moon Craters */}
        <motion.div 
          className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-slate-400/50 rounded-full"
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0 }} 
        />
        <motion.div 
          className="absolute bottom-1.5 left-2 w-1 h-1 bg-slate-400/50 rounded-full"
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0 }} 
        />
        <motion.div 
          className="absolute bottom-2 right-2 w-0.5 h-0.5 bg-slate-400/50 rounded-full"
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0 }} 
        />
      </motion.div>
    </button>
  )
}
