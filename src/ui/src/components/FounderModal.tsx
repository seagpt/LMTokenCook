import { motion, AnimatePresence } from 'framer-motion'
import { X, Linkedin, Mail, Globe } from 'lucide-react'

interface FounderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FounderModal({ isOpen, onClose }: FounderModalProps) {
    if (!isOpen) return null;

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-4xl h-fit max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 sticky top-0 bg-neutral-900/95 backdrop-blur z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-white">The Founder</h2>
                                <p className="text-amber-500 font-bold uppercase tracking-widest text-xs">A Note from the Developer</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12">
                            <div className="grid md:grid-cols-12 gap-12 items-start">
                                {/* Profile */}
                                <div className="md:col-span-4 flex flex-col items-center text-center">
                                    <div className="w-40 h-40 rounded-full bg-neutral-800 border-4 border-amber-500/20 overflow-hidden shadow-2xl mb-6 relative group">
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

                                {/* Text */}
                                <div className="md:col-span-8 space-y-6">
                                    <div className="prose prose-invert prose-neutral max-w-none text-neutral-300 leading-relaxed space-y-6 italic border-l-2 border-white/10 pl-6">
                                        <p>
                                            This tool began as a necessity, not a product. In a previous role, I was tasked with a massive challenge. I had to analyze years' worth of enterprise sales data. I needed to review the full transcripts of every multi-hour sales call we had ever conducted to find the root causes of success. Standard tools failed—they could only <strong>search</strong> the calls (RAG), but I needed an AI to <strong>reason</strong> across all of them (CAG) to find the patterns. I wrote a parsing script to chop the data for ChatGPT, and that script evolved into LMTokenCook.
                                        </p>
                                        <p>
                                            At DropShock Digital, my goal isn't just to build software. It is to ensure my clients achieve the best production results. If you are comfortable with less than friendly WebUIs, I highly recommend using <strong>Google AI Studio</strong> since it natively supports massive context. However, for those who prefer the standard ChatGPT workflow, have a strictly limited API budget, or need to process sensitive data offline before it touches the web, LMTokenCook remains the essential bridge.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                            >
                                Close Message
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
