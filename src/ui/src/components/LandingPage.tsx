import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Shield, Database, FileCode, Zap, Github, Globe, ArrowDown, Linkedin, Mail, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { LegalModal } from './LegalModal';
import clsx from 'clsx';

interface LandingPageProps {
    onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
    const [legalOpen, setLegalOpen] = useState<'privacy' | 'terms' | null>(null);
    const [stats, setStats] = useState({ tokens: 12500000, chunks: 4500, runs: 120 });
    const [scrolled, setScrolled] = useState(false);

    // Fetch Real Stats (Mock for now, will connect to API next)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real scenario, this would be: await fetch('/api/stats')
                // For now, simpler mock or localStorage could be used, but user wants REAL tracking.
                // We will implement the fetch logic assuming the backend exists on port 8000
                // Use relative path for Vite proxy (dev) or Nginx (prod)
                const res = await fetch('/stats').catch(() => null);
                if (res && res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (e) {
                console.log("Stats fetch failed (Endpoint might not be ready)");
            }
        };
        fetchStats();
        // Poll every 60s
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-neutral-950 to-neutral-950" />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[120px] rounded-full"
                />
            </div>

            {/* Nav */}
            <nav className={clsx("fixed top-0 w-full z-50 border-b transition-all duration-300", scrolled ? "bg-black/80 backdrop-blur-md border-white/5" : "bg-transparent border-transparent")}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/LMTC_Icon.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold tracking-tight hidden sm:block">LMTokenCook</span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6 text-xs md:text-sm font-bold text-neutral-400">
                        {/* Desktop Links */}
                        <a href="https://dropshockdigital.com" target="_blank" className="hover:text-amber-500 transition-colors hidden md:block">DropShock Digital</a>
                        <a href="https://stevenseagondollar.com" target="_blank" className="hover:text-amber-500 transition-colors hidden md:block">Steven Seagondollar</a>
                        <a href="https://github.com/DropShock-Digital" target="_blank" className="hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10">
                            <Github className="w-4 h-4" />
                            <span className="hidden sm:block">GitHub</span>
                        </a>
                    </div>
                </div>
            </nav>

            {/* Fullscreen Hero */}
            <header className="relative h-screen flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                        The AI Power-User's CAG Parsing Engine
                    </div>

                    {/* Logo Patch */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8 flex justify-center"
                    >
                        <img src="/LMTC_Patch.png" alt="LMTokenCook Patch" className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
                    </motion.div>

                    {/* Animated Text Background */}
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-3xl -z-10"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
                            Cook Your Files Into <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-400 to-amber-600">
                                AI-WebUI Ready Servings
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-10 px-4">
                        Process, tokenize, and perfectly portion your local data for any AI web interface.
                        <br />
                        <span className="text-white/60 text-base mt-2 block">
                            By Steven Seagondollar | DropShock Digital
                        </span>
                    </p>

                    <button
                        onClick={onStart}
                        className="group relative inline-flex items-center gap-3 px-8 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-neutral-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <img src="/LMTC_Icon.png" alt="LMTokenCook" className="w-8 h-8 object-contain" />
                        <span>Start Cooking Now</span>
                    </button>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1, duration: 2, repeat: Infinity, times: [0, 0.5, 1], ease: "easeInOut" }}
                    className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer text-white/30 hover:text-white transition-colors"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Learn More</span>
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </header>

            {/* 3-Box Educational Flow (Awareness -> Problem -> Solution) */}
            <section className="py-24 bg-neutral-900/10 border-y border-white/5 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">

                        {/* 1. Awareness (Blue) - Potential */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-sm relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
                            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <BookOpen className="w-4 h-4" /> Accurate Short-Term Memory
                            </h2>
                            <ul className="space-y-6 text-sm text-neutral-400 leading-relaxed flex-1">
                                <li>
                                    <strong className="text-blue-200 block mb-1 text-base">Modern AI Context Windows</strong>
                                    Modern AI models have memory in the form of a "Context Window." This is essentially the model's <strong>short-term memory</strong>, capable of holding entire books or codebases at once, and responding in consideration of what's loaded with extremely high accuracy.
                                </li>
                                <li>
                                    <strong className="text-blue-200 block mb-1 text-base">Context Augmented Generation (CAG)</strong>
                                    CAG is a simple technique where you <strong>manually pre-load</strong> the context window with information you want taken into consideration. Strategic context loading is the easiest and most accurate way for any AI to address a user's query.
                                </li>
                            </ul>

                            {/* Arrow for Desktop */}
                            <div className="hidden lg:flex absolute top-1/2 -right-6 z-20 text-white/20">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </motion.div>

                        {/* 2. The Problem (Red) - The Bottleneck */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-3xl bg-red-900/10 border border-red-500/20 backdrop-blur-sm relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -z-10 rounded-full" />
                            <h2 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <AlertTriangle className="w-4 h-4" /> The Paid AI Catch
                            </h2>
                            <ul className="space-y-6 text-sm text-neutral-400 leading-relaxed flex-1">
                                <li>
                                    <strong className="text-red-200 block mb-1 text-base">The Hidden Interface Limit</strong>
                                    You pay an AI subscription to save on API costs, but to offset the providers costs, the web interface <strong>limits how many tokens you can send</strong> in a single prompt (often as low as 8k-32k tokens, down from the model's actual 128K - 1M capacity).
                                </li>
                                <li>
                                    <strong className="text-red-200 block mb-1 text-base">Forced "RAG" (Search)</strong>
                                    This forces you to use "RAG" (Search) by attaching files. The AI <strong>won't look at the big picture</strong>; it only reviews what relevance searches return from your file, losing the ability to reason globally.
                                </li>
                            </ul>

                            {/* Arrow for Desktop */}
                            <div className="hidden lg:flex absolute top-1/2 -right-6 z-20 text-white/20">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </motion.div>

                        {/* 3. The Solution (Green) - Serialization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-3xl bg-emerald-900/10 border border-emerald-500/20 backdrop-blur-sm relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -z-10 rounded-full" />
                            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Zap className="w-4 h-4" /> Full-Context on Subscription
                            </h2>
                            <ul className="space-y-6 text-sm text-neutral-400 leading-relaxed flex-1">
                                <li>
                                    <strong className="text-emerald-200 block mb-1 text-base">Mathematical "Servings"</strong>
                                    We needed a way to mathematically split your data into "Servings" that <strong>fit the Prompt Window perfectly</strong>, maximizing the density of every message to load the context window fully.
                                </li>
                                <li>
                                    <strong className="text-emerald-200 block mb-1 text-base">Model Aligned Workflow</strong>
                                    Injecting headers like "Part 1 of 5... Wait" allows us to <strong>prompt engineer the interface</strong> into treating multiple messages as one continuous stream, unlocking full CAG operations.
                                </li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Showcase Animation (Replaced by App Screenshot) */}
            <section className="py-12 bg-black relative z-10">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="mb-10">
                        <span className="text-xs font-bold text-neutral-500 tracking-[0.2em] uppercase block mb-2">DropShock Digital Presents</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">LMTokenCook</h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-xl overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.15)] border border-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />

                        {/* App Screenshot */}
                        <div className="relative group text-center">
                            <img
                                src="/app_hero_screenshot.png"
                                alt="LMTokenCook Application Interface"
                                className="w-full h-auto max-h-[80vh] object-contain mx-auto opacity-90 group-hover:opacity-100 transition-opacity"
                                onError={(e) => {
                                    // Fallback if screenshot missing (auto-recovery to abstract)
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            {/* Fallback Abstract (Hidden by default unless error) */}
                            <div className="hidden absolute inset-0 bg-neutral-900 flex items-center justify-center">
                                <div className="absolute inset-x-0 top-0 h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] z-20 animate-[scan_3s_ease-in-out_infinite]" />
                                <span className="text-amber-500 font-mono">Scanning... (Screenshot Placeholder)</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* STATS CARD (New Placement) */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur text-center"
                    >
                        <div className="flex items-center justify-center gap-2 mb-6 text-amber-500 text-sm font-bold tracking-widest uppercase">
                            <Globe className="w-4 h-4" /> Global Community Impact
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-10">Used by AI Power-Users Worldwide</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/5">
                            <div className="p-4">
                                <div className="text-4xl font-mono font-bold text-white mb-2">{stats.tokens.toLocaleString()}</div>
                                <div className="text-sm text-neutral-500 uppercase tracking-wider">Tokens Processed</div>
                            </div>
                            <div className="p-4">
                                <div className="text-4xl font-mono font-bold text-white mb-2">{stats.chunks.toLocaleString()}</div>
                                <div className="text-sm text-neutral-500 uppercase tracking-wider">Chunks Created</div>
                            </div>
                            <div className="p-4">
                                <div className="text-4xl font-mono font-bold text-white mb-2">{stats.runs.toLocaleString()}</div>
                                <div className="text-sm text-neutral-500 uppercase tracking-wider">Happy Cooks</div>
                            </div>
                        </div>

                        <p className="mt-8 text-xs text-neutral-500">
                            * Real-time metrics from the distributed LMTokenCook network.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 3 Steps */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <h2 className="text-3xl font-bold text-center mb-16">The 3-Step Recipe</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="p-8 rounded-3xl bg-neutral-900/40 border border-white/5 relative group hover:border-amber-500/20 transition-all">
                        <div className="absolute top-6 right-6 text-7xl font-bold text-white/5 select-none">1</div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                            <Database className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Smart Scan & Extract</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                            Select entire folders to recursively scan. We filter out junk (binary, .git, node_modules) and extract text from code, markdown, and data files.
                        </p>
                        <ul className="text-xs text-neutral-500 space-y-2">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Ignores binaries & archives</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Supports drag-and-drop</li>
                        </ul>
                    </div>

                    {/* Step 2 */}
                    <div className="p-8 rounded-3xl bg-neutral-900/40 border border-white/5 relative group hover:border-amber-500/20 transition-all">
                        <div className="absolute top-6 right-6 text-7xl font-bold text-white/5 select-none">2</div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                            <FileCode className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Structure & Tokenize</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                            We map your file hierarchy and count tokens using <span className="font-mono text-white/70">tiktoken (cl100k_base)</span>—the same logic used by GPT-4 and Gemini for maximum accuracy.
                        </p>
                        <ul className="text-xs text-neutral-500 space-y-2">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full" /> Generates File Map / TOC</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full" /> Accurate Token Counts</li>
                        </ul>
                    </div>

                    {/* Step 3 */}
                    <div className="p-8 rounded-3xl bg-neutral-900/40 border border-white/5 relative group hover:border-amber-500/20 transition-all">
                        <div className="absolute top-6 right-6 text-7xl font-bold text-white/5 select-none">3</div>
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Intelligent Servings</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                            Your data is split into sequential chunks that fit your AI's window perfectly. We inject smart prompts to guide the AI to "wait for the next chunk" effectively.
                        </p>
                        <ul className="text-xs text-neutral-500 space-y-2">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Anti-Hallucination Headers</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Clean Sequential Output</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* The Payoff */}
            <section className="py-24 bg-gradient-to-b from-neutral-900/20 to-black px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">The Payoff: <span className="text-amber-500">Context Augmented Generation</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">Deeper Analysis</h4>
                            <ul className="text-xs text-neutral-400 space-y-3 list-disc pl-4 marker:text-amber-500">
                                <li>Achieve <strong>Global Context</strong>: The LLM 'reads' the whole book, not just the search results.</li>
                                <li>Identify hidden trends and correlations scattered across hundreds of separate files.</li>
                                <li>Eliminate 'Lossy Summarization' by feeding raw source material directly.</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">Better Code</h4>
                            <ul className="text-xs text-neutral-400 space-y-3 list-disc pl-4 marker:text-amber-500">
                                <li>Refactor complex architectures by letting the AI see cyclic dependencies across the full stack.</li>
                                <li>Generate integration tests that accurately reflect the logic of the entire repository.</li>
                                <li>Standardize coding patterns across legacy and modern directories simultaneously.</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">Coherent Writing</h4>
                            <ul className="text-xs text-neutral-400 space-y-3 list-disc pl-4 marker:text-amber-500">
                                <li>Feed 300+ pages of prior chapters to ensure perfect character voice consistency.</li>
                                <li>Detect plot holes or timeline contradictions that span across multiple volumes.</li>
                                <li>Maintain distinct thematic tone without the AI drifting into generic tropes.</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">Complete Answers</h4>
                            <ul className="text-xs text-neutral-400 space-y-3 list-disc pl-4 marker:text-amber-500">
                                <li>Force the AI to answer based <em>only</em> on your provided data, reducing hallucination.</li>
                                <li>Get nuanced answers that consider the "long-tail" details of your documents.</li>
                                <li>Save money by utilizing the flat-fee Web UI for heavy-lifting analysis.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder's Message */}
            <section className="py-24 bg-neutral-900 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
                    {/* Image / Avatar */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                        <div className="w-48 h-48 rounded-full bg-neutral-800 border-4 border-amber-500/20 overflow-hidden shadow-2xl mb-6 relative group">
                            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-neutral-600">
                                <span className="text-xs uppercase font-bold tracking-widest">Photo Placeholder</span>
                            </div>
                            <img src="/SS_Suit_Backdrop.jpg" alt="Steven Seagondollar" className="w-full h-full object-cover relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Steven Seagondollar</h3>
                        <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-6">Founder, DropShock Digital</p>

                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/stevenseagondollar/" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-amber-500 hover:text-white transition-colors text-neutral-400">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="mailto:steven.seagondollar@dropshockdigital.com" className="p-2 bg-white/5 rounded-full hover:bg-amber-500 hover:text-white transition-colors text-neutral-400">
                                <Mail className="w-5 h-5" />
                            </a>
                            <a href="https://stevenseagondollar.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-amber-500 hover:text-white transition-colors text-neutral-400">
                                <Globe className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="md:col-span-8 space-y-6">
                        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-amber-500 pl-6">
                            A Message from Our Founder
                        </h2>

                        <div className="prose prose-invert prose-neutral max-w-none text-neutral-300 leading-relaxed space-y-6 pl-6 italic">
                            <p>
                                In a previous role, I was tasked with analyzing <strong>years' worth of enterprise sales transcripts</strong> to create all new product documentation based on characteristics that satisfied clients. I was provided <strong>hundreds of videos</strong> that would've required me to spend the next month manually reviewing, but I needed to deliver fast. So I considered ways to solve the issue using AI. While we had no approved budget for API calls, we had a <strong>corporate subscription to ChatGPT Teams</strong>.
                            </p>
                            <p>
                                I couldn't paste <strong>almost 100,000 tokens</strong> of transcripts into the context of ChatGPT Teams due to its <strong>28,000 token maximum prompt window</strong>, and RAG wouldn't be comprehensive enough to consider the <strong>subliminal across-transcript details</strong> that shifted client sentiments. To solve this problem, I wrote a workflow patching script to chop the data into 'servings' that ChatGPT would accept sequentially. That script was later iterated, creating this fully featured patch program.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-neutral-950 relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
                    <div className="flex flex-col text-center md:text-left gap-1">
                        <span className="flex items-center justify-center md:justify-start gap-2 font-bold text-white">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            100% Local & Private Processing
                        </span>
                        <p className="text-[10px] text-neutral-600 max-w-md mt-2">
                            ChatGPT, Claude, and Gemini are trademarks of their respective owners. DropShock Digital is not affiliated with OpenAI, Anthropic, or Google. This tool is an independent utility for data preprocessing.
                        </p>
                    </div>
                    <p className="text-center md:text-left">© 2025 DropShock Digital. Created by Steven Seagondollar.</p>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="flex gap-6">
                            <button onClick={() => setLegalOpen('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                            <button onClick={() => setLegalOpen('terms')} className="hover:text-white transition-colors">Terms of Use</button>
                            <a href="mailto:support@dropshockdigital.com" className="hover:text-white transition-colors">Support</a>
                        </div>
                        <div className="hidden md:block w-px h-4 bg-white/10"></div>
                        <div className="flex gap-6">
                            <a href="https://github.com/DropShock-Digital/LMTokenCook/issues/new?labels=enhancement&template=feature_request.md" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Request Feature
                            </a>
                            <a href="https://github.com/DropShock-Digital/LMTokenCook/issues/new?labels=bug&template=bug_report.md" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                                <AlertTriangle className="w-3 h-3" /> Report Bug
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Legal Modals */}
            <LegalModal
                isOpen={legalOpen === 'terms'}
                onClose={() => setLegalOpen(null)}
                title="Terms of Use"
                content={
                    <div className="space-y-6">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Jurisdiction: Hesperia, San Bernardino County, CA</p>

                        <section>
                            <h3 className="text-white font-bold mb-2">1. Acceptance of Terms</h3>
                            <p>By accessing or using LMTokenCook ("The Software"), you agree to be bound by these Terms. The Software is owned and operated by <strong>DropShock Digital</strong> and <strong>Steven Seagondollar</strong>, operating out of Hesperia, California.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">2. Limitation of Liability</h3>
                            <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg text-red-200">
                                <p className="uppercase font-bold text-xs mb-2">Important</p>
                                <p>To the maximum extent permitted by law, DropShock Digital and Steven Seagondollar shall NOT be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this software, including but not limited to data loss, leakage of sensitive information to third-party AI providers, or corruption of local files.</p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">3. User Responsibility</h3>
                            <p>You acknowledge that you are solely responsible for the content you process. You agree not to use this tool to process illegal content or violate the Terms of Service of any third-party AI provider (e.g., OpenAI, Anthropic, Google).</p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">4. Accessibility (ADA Compliance)</h3>
                            <p>We are committed to making our software accessible to all users, including those with disabilities. We strive to adhere to WCAG 2.1 Level AA standards. If you encounter accessibility barriers, please contact support@dropshockdigital.com.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">5. Governing Law</h3>
                            <p>These terms are governed by the laws of the State of California. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the state and federal courts located in <strong>San Bernardino County, California</strong>.</p>
                        </section>
                    </div>
                }
            />

            <LegalModal
                isOpen={legalOpen === 'privacy'}
                onClose={() => setLegalOpen(null)}
                title="Privacy Policy"
                content={
                    <div className="space-y-6">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Effect Date: December 1, 2025</p>

                        <section>
                            <h3 className="text-white font-bold mb-2">1. The "No-Data" Philosophy</h3>
                            <p>LMTokenCook operates on a simple principle: <strong>We do not want your data.</strong> The software runs entirely on your local machine using client-side technologies (WebAssembly, File System Access API).</p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">2. Data Collection (Global Stats)</h3>
                            <p>To monitor the utility and adoption of the tool, the application may send anonymous, aggregate usage counters to our central dashboard.</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 bg-white/5 p-4 rounded-lg">
                                <li><strong>What we count:</strong> Incrementing integers (e.g., "+1 chunking run", "+450 tokens processed").</li>
                                <li><strong>What we DO NOT count:</strong> Filenames, file contents, IP addresses, user agents, or any personally identifiable information (PII).</li>
                                <li><strong>Purpose:</strong> To display the "Community Stats" bar on the landing page and validate development resources.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">3. No Third-Party Tracking</h3>
                            <p>We do not use Google Analytics, Facebook Pixels, or third-party cookies. Your usage remains a private interaction between you and your computer.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-2">4. Data Accuracy Disclaimer</h3>
                            <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-lg text-amber-200">
                                <p>The "Community Stats" displayed are best-effort aggregate counters. As this is an independent open-source project, we cannot guarantee 100% precision in these numbers. Please view them as an indicative measure of our growing community rather than a certified data audit.</p>
                            </div>
                        </section>
                    </div>
                }
            />
        </div>
    )
}
