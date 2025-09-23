// "use client";

// import { useState } from "react";
// import Crypto from "@/components/Crypto";
// import Stocks from "@/components/Stocks";

// export default function Page() {
//   const [active, setActive] = useState<"crypto" | "stocks">("stocks");

//   return (
//     <div className='px-4 py-10'>
//       <h1 className='text-2xl font-bold mb-6'>Market Dashboard</h1>

//       {/* Buttons here */}
//       <div className='inline-flex rounded-2xl bg-slate-800 p-1 shadow'>
//         <button
//           onClick={() => setActive("crypto")}
//           className={`px-4 py-2 rounded-xl text-sm transition ${
//             active === "crypto" ? "bg-slate-700" : "hover:bg-slate-700/50"
//           }`}
//         >
//           Crypto (Top 10)
//         </button>
//         <button
//           onClick={() => setActive("stocks")}
//           className={`px-4 py-2 rounded-xl text-sm transition ${
//             active === "stocks" ? "bg-slate-700" : "hover:bg-slate-700/50"
//           }`}
//         >
//           US Stocks (Top 10)
//         </button>
//       </div>

//       {/* Render selected tab */}
//       {active === "crypto" ? <Crypto /> : <Stocks />}
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

function FeaturesSection() {
  const features = [
    {
      title: "AI Signal Briefings",
      desc: "Get concise, data-backed entries with risk levels, SL/TP bands, and confidence scores.",
      img: "/screens/signal-briefing.png",
      tag: "Signals",
    },
    {
      title: "Watchlists + Alerts",
      desc: "Create focused watchlists; receive alerts when setups meet your criteria.",
      img: "/screens/watchlist-alerts.png",
      tag: "Alerts",
    },
    {
      title: "Backtests in 1 Click",
      desc: "Validate strategies over historical data. No code required.",
      img: "/screens/backtest.png",
      tag: "Backtest",
    },
  ];

  return (
    <section className='mt-8'>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='text-2xl md:text-3xl font-bold'
      >
        What to expect at launch
      </motion.h2>

      <p className='mt-2 text-slate-400'>
        Early access unlocks core TickrX features. Here’s a peek:
      </p>

      <div className='mt-8 grid gap-6 md:grid-cols-3'>
        {features.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>

      {/* Bonus: wide “hero” screenshot with gentle float */}
      <div className='mt-10'>
        <FloatingScreenshot src='/screens/overview.png' alt='TickrX Overview' />
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: { title: string; desc: string; img: string; tag: string };
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className='group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4'
    >
      {/* Glow on hover */}
      <div className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity'>
        <div className='absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_60%)]' />
      </div>

      <span className='inline-flex items-center rounded-full border border-zinc-700 px-2 py-1 text-xs text-slate-300'>
        {feature.tag}
      </span>
      <h3 className='mt-3 text-lg font-semibold'>{feature.title}</h3>
      <p className='mt-1 text-sm text-slate-400'>{feature.desc}</p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 + 0.1 * index }}
        className='mt-4 overflow-hidden rounded-xl border border-zinc-800'
      >
        <motion.div
          initial={{ scale: 1.02 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className='relative aspect-[16/10] w-full'
        >
          <Image
            src={feature.img}
            alt={feature.title}
            fill
            sizes='(min-width: 768px) 33vw, 100vw'
            className='object-cover'
            priority={index === 0}
          />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

function FloatingScreenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
      className='relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3'
    >
      {/* Animated border shimmer */}
      <motion.div
        aria-hidden
        className='pointer-events-none absolute -inset-px rounded-2xl'
        animate={{
          background: [
            "conic-gradient(from 0deg, rgba(16,185,129,.25), transparent 30%, rgba(99,102,241,.25))",
            "conic-gradient(from 360deg, rgba(16,185,129,.25), transparent 30%, rgba(99,102,241,.25))",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ mask: "linear-gradient(#000,transparent 60%)" }}
      />
      {/* Floating image */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className='relative'
      >
        <div className='relative aspect-[16/9] w-full overflow-hidden'>
          <Image
            src={src}
            alt={alt}
            fill
            sizes='100vw'
            className='object-contain rounded-xl overflow-hidden'
            priority={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Page() {
  return (
    <main className='relative min-h-screen  text-white flex flex-col items-center justify-center overflow-hidden pb-10'>
      {/* Background Animation */}
      <AnimatedBackground />

      <section className='w-full max-w-4xl px-6 py-16 relative z-10'>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-4xl md:text-6xl font-extrabold tracking-tight'
        >
          One dashboard. Stocks + Crypto. Smarter AI-powered decisions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='mt-4 text-slate-300 text-lg md:text-xl'
        >
          Be first to know when we launch. Join the early access list for AI-assisted trading
          signals and insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='mt-10'
        >
          <SignupForm />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className='mt-6 text-sm text-slate-400'
        >
          No spam. Unsubscribe anytime.
        </motion.p>
      </section>

      <FeaturesSection />
    </main>
  );
}

/* ✨ Animated Gradient Background */
function AnimatedBackground() {
  return (
    <div className='absolute inset-0 -z-10 overflow-hidden'>
      {/* Layer 1 */}
      <motion.div
        className='absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/30 blur-3xl'
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />
      {/* Layer 2 */}
      <motion.div
        className='absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-3xl'
        animate={{
          x: [0, -80, 80, 0],
          y: [0, 60, -60, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
        }}
      />
      {/* Layer 3 */}
      <motion.div
        className='absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full bg-purple-600/20 blur-3xl'
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/* ✅ Signup form (unchanged) */
function SignupForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "error">(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero", website: "" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col sm:flex-row gap-3'>
      <input
        type='text'
        name='website'
        autoComplete='off'
        className='hidden'
        tabIndex={-1}
        aria-hidden='true'
      />
      <input
        type='email'
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter your email'
        className='flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500'
      />
      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={busy}
        type='submit'
        className='rounded-xl px-5 py-3 font-semibold bg-emerald-500 text-black hover:brightness-110 disabled:opacity-60'
      >
        {busy ? "Subscribing…" : "Notify Me"}
      </motion.button>

      {status === "ok" && <p className='text-emerald-400 text-sm'>You’re in! Check your inbox.</p>}
      {status === "error" && (
        <p className='text-red-400 text-sm'>Something went wrong. Try again.</p>
      )}
    </form>
  );
}
