import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Play, FileText, Settings, Activity, Cpu, Download } from 'lucide-react'
import clsx from 'clsx'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getFilesRecursively, verifyPermission } from './lib/fs-handler'
import { processFileContent, countTokens } from './lib/chunker'
import { LandingPage } from './components/LandingPage'
import { Tooltip } from './components/Tooltip'

function App() {
    // Modes: 'landing' or 'app'
    const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing')

    const [status, setStatus] = useState<"idle" | "cooking" | "done" | "error">("idle")
    const [message, setMessage] = useState("System Standby - Client Side Mode")

    // FSA State
    const [isFSASupported, setIsFSASupported] = useState(true)
    const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null)
    const [outputDirHandle, setOutputDirHandle] = useState<FileSystemDirectoryHandle | null>(null)

    // Fallback State
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fallbackFiles, setFallbackFiles] = useState<FileList | null>(null)

    // UI Display
    const [inputPathName, setInputPathName] = useState("")
    const [outputPathName, setOutputPathName] = useState("")
    const [chunkSize, setChunkSize] = useState(28000)
    const [stats, setStats] = useState({ files: 0, tokens: 0, chunks: 0 })

    // Advanced Settings
    const [config, setConfig] = useState({
        smartPrompts: true,
        fileMap: true,
        lineNumbers: false,
        skipEmptyLines: false, // Legacy: "Skip Empty Lines"
        keepMaster: false,
    });

    useEffect(() => {
        // @ts-ignore
        if (!window.showDirectoryPicker) {
            setIsFSASupported(false)
            setMessage("Browser doesn't support Direct Access. Using Fallback Mode.")
        }
    }, [])

    const toggleConfig = (key: keyof typeof config) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSelectInput = async () => {
        if (isFSASupported) {
            try {
                // @ts-ignore
                const handle = await window.showDirectoryPicker()
                setDirHandle(handle)
                setInputPathName(handle.name)
                setMessage("Input Directory Selected")
            } catch (e) {
                setMessage("Selection Cancelled")
            }
        } else {
            // Trigger hidden input
            fileInputRef.current?.click()
        }
    }

    const handleFallbackFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFallbackFiles(e.target.files)
            setInputPathName(`${e.target.files.length} files selected`)
            setOutputPathName("Download as ZIP")
            setMessage("Files Loaded. Ready to Cook.")
        }
    }

    const handleSelectOutput = async () => {
        if (!isFSASupported) return // Auto-set to Zip Download

        try {
            // @ts-ignore
            const handle = await window.showDirectoryPicker()
            setOutputDirHandle(handle)
            setOutputPathName(handle.name)
            setMessage("Output Directory Selected")
        } catch (e) {
            setMessage("Selection Cancelled")
        }
    }

    const handleCook = async () => {
        if (isFSASupported) {
            if (!dirHandle || !outputDirHandle) {
                setMessage("Please select both Input and Output directories.")
                return
            }
        } else {
            if (!fallbackFiles) {
                setMessage("Please select files first.")
                return
            }
        }

        setStatus("cooking")
        setMessage("Processing Files...")

        try {
            let totalTokens = 0
            let filesToProcess: { path: string, content: Promise<string> }[] = []

            // 1. Gather Content
            if (isFSASupported && dirHandle) {
                const fsFiles = await getFilesRecursively(dirHandle)
                // Use explicit any for handle to avoid missing type definition issues in CI
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filesToProcess = fsFiles.map((f: { path: string, handle: any }) => ({
                    path: f.path,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content: f.handle.getFile().then((file: any) => file.text())
                }))
            } else if (fallbackFiles) {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filesToProcess = Array.from(fallbackFiles).map((f: any) => ({
                    path: f.webkitRelativePath || f.name,
                    content: f.text()
                })).filter((f: { path: string }) => !f.path.match(/\.(png|jpg|exe|bin)$/))
            }

            setMessage(`Analyzing ${filesToProcess.length} files...`)

            // 2. Pre-Analysis (Token Counting for Map + Totals)
            const processedDocs: { path: string, content: string, tokens: number }[] = []
            let projectTotalTokens = 0

            for (const item of filesToProcess) {
                const text = await item.content
                // Quick token count on raw text (approx logic for map)
                const tokens = countTokens(text)
                processedDocs.push({ path: item.path, content: text, tokens })
                projectTotalTokens += tokens
            }

            // 3. Generate File Map (if enabled)
            let fileMapContent = ""
            if (config.fileMap) {
                fileMapContent = "# Project Structure & Token Map\n"
                fileMapContent += processedDocs.map(d => `- ${d.path} (${d.tokens} tokens)`).join('\n')
                fileMapContent += `\n\nTotal Project Tokens: ${projectTotalTokens}\n`
                fileMapContent += `Total Files: ${processedDocs.length}\n`
                fileMapContent += "-".repeat(40) + "\n\n"
            }

            // Estimate total chunks (rough)
            const estimatedTotalChunks = Math.ceil(projectTotalTokens / chunkSize) + (config.fileMap ? 1 : 0)

            // 4. Chunk & Write
            if (isFSASupported && outputDirHandle) {
                // Verify Write Permission
                const hasPerm = await verifyPermission(outputDirHandle, true)
                if (!hasPerm) {
                    setStatus("error")
                    setMessage("Write Permission Denied")
                    return
                }
            }

            const zip = !isFSASupported ? new JSZip() : null
            let globalChunkIndex = 1

            // Helper to write a chunk
            const saveChunk = async (filename: string, content: string) => {
                let finalContent = content

                // Smart Prompts Injection
                if (config.smartPrompts) {
                    const header = `# [LMTokenCook] Chunk ${globalChunkIndex} of ~${estimatedTotalChunks}. Do not respond yet.`
                    const footer = globalChunkIndex === estimatedTotalChunks
                        ? `\n# [LMTokenCook] Final Chunk. Summarize all data provided. Ask me what I want to do now that we are on the same page.`
                        : `\n# [LMTokenCook] End of Chunk ${globalChunkIndex}. Await next chunk.`
                    finalContent = `${header}\n\n${content}\n${footer}`
                }

                if (isFSASupported && outputDirHandle) {
                    // @ts-ignore
                    const fileHandle = await outputDirHandle.getFileHandle(filename, { create: true })
                    // @ts-ignore
                    const writable = await fileHandle.createWritable()
                    await writable.write(finalContent)
                    await writable.close()
                } else if (zip) {
                    zip.file(filename, finalContent)
                }
                globalChunkIndex++
            }

            // Write File Map first if enabled
            if (config.fileMap) {
                await saveChunk("000_structure_map.txt", fileMapContent)
            }

            for (const doc of processedDocs) {
                const chunks = await processFileContent(doc.content, {
                    chunkSize,
                    encodingName: "cl100k_base",
                    addLineNumbers: config.lineNumbers,
                    skipEmptyLines: config.skipEmptyLines
                })

                totalTokens += chunks.reduce((acc: number, c: string) => acc + countTokens(c), 0)

                for (let i = 0; i < chunks.length; i++) {
                    const chunkName = `serving_${globalChunkIndex}_${doc.path.replace(/[\/\\]/g, '_')}.txt`
                    const content = `// Source: ${doc.path}\n\n` + chunks[i]
                    await saveChunk(chunkName, content)
                }
            }

            if (zip) {
                const content = await zip.generateAsync({ type: "blob" })
                saveAs(content, "cooked_context.zip")
            }

            setStats({
                files: processedDocs.length,
                tokens: totalTokens,
                chunks: globalChunkIndex - 1
            })

            // Report Stats to Backend (Fire & Forget)
            // Use relative path so Vite proxy (dev) or Nginx (prod) can route to backend
            fetch('/stats/increment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokens: totalTokens,
                    chunks: globalChunkIndex - 1,
                    runs: 1
                })
            }).catch((err: unknown) => console.error("Stats reporting failed (Backend offline?)", err));

            setStatus("done")
            setMessage(`Cooking Complete! ${globalChunkIndex - 1} chunks created.`)

        } catch (e: unknown) {
            console.error(e)
            setStatus("error")
            setMessage("Error during processing. See console.")
        }
    }

    if (viewMode === 'landing') {
        return <LandingPage onStart={() => setViewMode('app')} />
    }

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden font-sans text-neutral-200">
            {/* Hidden Input for Fallback */}
            <input
                type="file"
                ref={fileInputRef}
                // @ts-ignore
                webkitdirectory=""
                directory=""
                multiple
                className="hidden"
                onChange={handleFallbackFileSelect}
            />
            {/* Background & Decor */}
            <div className="absolute inset-0 bg-neutral-950 -z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-950 to-neutral-950 -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="liquid-card w-full max-w-5xl md:w-[900px] mx-4 p-4 md:p-8 relative z-10 flex flex-col gap-6"
            >
                {/* Header Section */}
                <div className="flex items-start justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                            <img src="/LMTC_Icon.png" alt="LMTokenCook Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-400 to-amber-600">
                                LMTokenCook
                            </h1>
                            <p className="text-white/40 text-sm mt-1 flex items-center gap-2">
                                <Cpu className="w-3 h-3" /> Browser-Native Engine
                                {!isFSASupported && <span className="text-amber-500 font-bold ml-2">[Fallback Mode]</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setViewMode('landing')} className="text-xs text-white/30 hover:text-white transition-colors">
                            Back to Home
                        </button>
                        <div className={clsx(
                            "px-3 py-1 rounded-full text-xs font-mono border",
                            status === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                status === 'done' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                    "bg-neutral-800/50 border-white/10 text-neutral-500"
                        )}>
                            {status.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-2">

                    {/* Left Col: Paths */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-white/30 font-semibold flex items-center gap-2">
                                <FolderOpen className="w-3 h-3" /> Input Source
                            </label>
                            <div
                                onClick={handleSelectInput}
                                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white/70 hover:bg-white/5 cursor-pointer transition-colors font-mono truncate"
                            >
                                {inputPathName || (isFSASupported ? "Click to Select Input Folder..." : "Click to Upload Folder...")}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-white/30 font-semibold flex items-center gap-2">
                                {isFSASupported ? <FileText className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                                {isFSASupported ? "Output Destination" : "Output Format"}
                            </label>
                            <div
                                onClick={handleSelectOutput}
                                className={clsx(
                                    "w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white/70 transition-colors font-mono truncate",
                                    isFSASupported ? "hover:bg-white/5 cursor-pointer" : "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {outputPathName || (isFSASupported ? "Click to Select Output Folder..." : "Download as ZIP Archive")}
                            </div>
                        </div>

                        {/* Token Slider */}
                        <div className="space-y-4 pt-4">
                            <Tooltip content="Define the maximum number of tokens per file serving. Match this to your AI's context window.">
                                <div className="flex justify-between text-xs text-white/50 uppercase tracking-wider font-bold cursor-help mb-2">
                                    <span>Max Tokens Per Serving: </span>
                                    <span className="font-mono text-amber-400 text-sm">{chunkSize.toLocaleString()}</span>
                                </div>
                            </Tooltip>

                            {/* Presets */}
                            <div className="flex gap-3 mb-2">
                                <Tooltip content="Gemini Advanced WebUI often limits input to ~60k tokens despite the 1M+ context window. (Subject to change)">
                                    <button
                                        onClick={() => setChunkSize(60000)}
                                        className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-white/5 text-[10px] text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 transition-all font-mono"
                                    >
                                        Gemini (60k)
                                    </button>
                                </Tooltip>
                                <Tooltip content="ChatGPT WebUI typically limits input to ~28k - 32k tokens per message. (Subject to change)">
                                    <button
                                        onClick={() => setChunkSize(28000)}
                                        className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-white/5 text-[10px] text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 transition-all font-mono"
                                    >
                                        ChatGPT (28k)
                                    </button>
                                </Tooltip>
                            </div>

                            <input
                                type="range"
                                min="1" max="1000000" step="100"
                                value={chunkSize}
                                onChange={(e) => setChunkSize(Number(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-white/20 font-mono">
                                <span>1 Token</span>
                                <span>1 Million Tokens</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Advanced Settings */}
                    <div className="md:col-span-5 bg-neutral-900/30 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-amber-500/80 mb-6">
                            <Settings className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Cook Configuration</span>
                        </div>

                        <div className="space-y-4"> {/* Reduced spacing to fit more items if needed */}
                            <Tooltip content="Automatically adds 'Chunk X of Y' headers and 'Do not respond yet' footers to each file part. This instructs the AI to wait for the full context before processing, preventing premature or hallucinatory responses." side="left">
                                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors gap-4">
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">Smart Context Headers</span>
                                    <div onClick={() => toggleConfig('smartPrompts')} className={clsx("w-10 h-5 rounded-full relative transition-colors flex-shrink-0", config.smartPrompts ? "bg-amber-600" : "bg-white/10")}>
                                        <div className={clsx("absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform", config.smartPrompts ? "translate-x-5" : "translate-x-0")} />
                                    </div>
                                </label>
                            </Tooltip>

                            <Tooltip content="Creates a comprehensive '000_structure_map.txt' file that lists every file and its token count. This acts as a Table of Contents, giving the AI a high-level map of your repository before it dives into the code." side="left">
                                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors gap-4">
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">Generate File Map</span>
                                    <div onClick={() => toggleConfig('fileMap')} className={clsx("w-10 h-5 rounded-full relative transition-colors flex-shrink-0", config.fileMap ? "bg-amber-600" : "bg-white/10")}>
                                        <div className={clsx("absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform", config.fileMap ? "translate-x-5" : "translate-x-0")} />
                                    </div>
                                </label>
                            </Tooltip>

                            <Tooltip content="Prepends line numbers (e.g., '0042: ') to every line of code. This is crucial when you want to ask the AI to 'Refactor lines 40 through 60', allowing for precise, surgical code edits." side="left">
                                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors gap-4">
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">Add Line Numbers</span>
                                    <div onClick={() => toggleConfig('lineNumbers')} className={clsx("w-10 h-5 rounded-full relative transition-colors flex-shrink-0", config.lineNumbers ? "bg-amber-600" : "bg-white/10")}>
                                        <div className={clsx("absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform", config.lineNumbers ? "translate-x-5" : "translate-x-0")} />
                                    </div>
                                </label>
                            </Tooltip>

                            <Tooltip content="Removes purely empty lines from your source files. This optimizes token usage, squeezing more code into each prompt window without sacrificing readability." side="left">
                                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors gap-4">
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">Skip Empty Lines</span>
                                    <div onClick={() => toggleConfig('skipEmptyLines')} className={clsx("w-10 h-5 rounded-full relative transition-colors flex-shrink-0", config.skipEmptyLines ? "bg-amber-600" : "bg-white/10")}>
                                        <div className={clsx("absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform", config.skipEmptyLines ? "translate-x-5" : "translate-x-0")} />
                                    </div>
                                </label>
                            </Tooltip>

                            <Tooltip content="Copies all processing files into a single, massive 'master file' in addition to the chunked output. Useful if you have a model with a massive context window (like Gemini 1.5 Pro) and want to upload just one file." side="left">
                                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors gap-4">
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">Deliver Master File</span>
                                    <div onClick={() => toggleConfig('keepMaster')} className={clsx("w-10 h-5 rounded-full relative transition-colors flex-shrink-0", config.keepMaster ? "bg-amber-600" : "bg-white/10")}>
                                        <div className={clsx("absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform", config.keepMaster ? "translate-x-5" : "translate-x-0")} />
                                    </div>
                                </label>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Footer / Action */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/30">
                        <Activity className="w-3 h-3" />
                        {/* Stats Inline */}
                        {status === 'done' ? (
                            <span className="text-emerald-500">Done: {stats.chunks} chunks / {stats.tokens.toLocaleString()} tokens</span>
                        ) : (
                            <span>{message}</span>
                        )}
                    </div>

                    <button
                        onClick={handleCook}
                        disabled={status === 'cooking'}
                        className="flex items-center gap-2 px-10 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFSASupported ? <Play className="w-4 h-4 fill-white" /> : <Download className="w-4 h-4 fill-white" />}
                        <span>{status === 'cooking' ? 'Processing...' : (isFSASupported ? 'Local Cook' : 'Process & Download')}</span>
                    </button>
                </div>

            </motion.div>
        </div>
    )
}

export default App
