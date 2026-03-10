import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, AlertTriangle, Zap } from 'lucide-react';

interface LogicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogicModal({ isOpen, onClose }: LogicModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 overflow-y-auto"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 overflow-y-auto pointer-events-none"
                    >
                        <div className="min-h-full flex items-center justify-center p-4">
                            <div className="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl pointer-events-auto relative">

                                {/* Header */}
                                <div className="p-8 border-b border-white/5 flex items-center justify-center sticky top-0 bg-neutral-900/95 backdrop-blur z-20">
                                    <h2 className="text-2xl font-bold">The Logic: <span className="text-amber-500">Why Context Matters</span></h2>
                                    <button
                                        onClick={onClose}
                                        className="absolute right-8 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-neutral-400 hover:text-white" />
                                    </button>
                                </div>

                                {/* Content - Vertical Timeline */}
                                <div className="p-8 md:p-16 relative">
                                    <div className="relative border-l-2 border-white/10 pl-8 md:pl-16 space-y-24">

                                        {/* Step 1 */}
                                        <div className="relative">
                                            <div className="absolute -left-[41px] md:-left-[73px] top-0 w-5 h-5 bg-neutral-900 border-4 border-neutral-700 rounded-full" />
                                            <div className="grid md:grid-cols-12 gap-8">
                                                <div className="md:col-span-4">
                                                    <div className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                                                        <BookOpen className="w-5 h-5 text-neutral-500" />
                                                        Native Model Capabilities
                                                    </div>
                                                    <div className="text-neutral-500 text-sm">The Potential</div>
                                                </div>
                                                <div className="md:col-span-8 space-y-6">
                                                    <div>
                                                        <strong className="text-white block mb-2">Accurate Short-Term Memory</strong>
                                                        <p className="text-neutral-400 text-sm leading-relaxed">Modern AI models have memory in the form of a "Context Window." This is essentially the model's <strong>short-term memory</strong>, capable of holding entire books or codebases at once.</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-white block mb-2">Direct Context Loading</strong>
                                                        <p className="text-neutral-400 text-sm leading-relaxed">CAG is a technique where you <strong>manually pre-load</strong> the context window. Strategic context loading is the most accurate way for any AI to address a complex query.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="relative">
                                            <div className="absolute -left-[41px] md:-left-[73px] top-0 w-5 h-5 bg-neutral-900 border-4 border-amber-900 rounded-full" />
                                            <div className="grid md:grid-cols-12 gap-8">
                                                <div className="md:col-span-4">
                                                    <div className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                                                        <AlertTriangle className="w-5 h-5 text-amber-600/70" />
                                                        The Interface Bottleneck
                                                    </div>
                                                    <div className="text-amber-500/50 text-sm">The Problem</div>
                                                </div>
                                                <div className="md:col-span-8 space-y-6">
                                                    <div>
                                                        <strong className="text-white block mb-2">Backend Supports Full Context</strong>
                                                        <p className="text-neutral-400 text-sm leading-relaxed">Many of the latest models have massive <strong>Context Windows</strong> (1M+ tokens) capable of holding your entire project. They are built to reason globally across thousands of files.</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-white block mb-2">Frontend Caps User Input</strong>
                                                        <p className="text-neutral-400 text-sm leading-relaxed">The web interfaces you use <strong>limit</strong> your input to 8k-32k tokens, creating a gap between you and the model's full capabilities. This forces you to use RAG (search) when you need CAG (reasoning).</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="relative">
                                            <div className="absolute -left-[41px] md:-left-[73px] top-0 w-5 h-5 bg-black border-4 border-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
                                            <div className="grid md:grid-cols-12 gap-8">
                                                <div className="md:col-span-4">
                                                    <div className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                                                        <Zap className="w-5 h-5 text-amber-500" />
                                                        Cheat the Prompt Window
                                                    </div>
                                                    <div className="text-amber-500 text-sm">The Solution</div>
                                                </div>
                                                <div className="md:col-span-8 space-y-6">
                                                    <div>
                                                        <strong className="text-white block mb-2">Maximize Available Space</strong>
                                                        <p className="text-neutral-400 text-sm leading-relaxed">LMTokenCook bridges the gap. It transforms your massive local files into perfectly sized 'servings' that fill your Web UI’s capacity to the absolute limit. You get the maximum amount of context into every message, bypassing those annoying "Message Too Long" errors.</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-white block mb-2">Enforce Global Awareness</strong>
                                                        <p className="text-neutral-400 text-sm leading-relaxed">We wrap every data chunk with smart 'Wait' instructions. This simple trick 'cheats' the interface, forcing the model to hold its thought and absorb your full project context before it generates a single word of its final answer.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="p-8 border-t border-white/5 bg-neutral-900/50 text-center">
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-colors"
                                    >
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
