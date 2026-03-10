import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface PayoffModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PayoffModal({ isOpen, onClose }: PayoffModalProps) {
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
                        className="fixed inset-0 m-auto w-full max-w-6xl h-fit max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 sticky top-0 bg-neutral-900/95 backdrop-blur z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-white">The Payoff</h2>
                                <p className="text-amber-500 font-bold uppercase tracking-widest text-xs">Context Augmented Generation</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">Deep Reasoning</h4>
                                    <ul className="text-xs text-neutral-400 space-y-3 list-disc pl-4 marker:text-amber-500">
                                        <li>True reasoning requires global context. The AI "reads" the whole book, rather than searching for keywords.</li>
                                        <li>Identify hidden trends and correlations scattered across hundreds of separate files.</li>
                                        <li>Eliminate "Lossy Summarization" by feeding raw source material directly.</li>
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

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
