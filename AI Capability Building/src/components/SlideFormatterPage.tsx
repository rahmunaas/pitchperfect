import { useState, useRef } from 'react'
import { FileDown, Sparkles, ChevronRight, RotateCcw, Upload, X } from 'lucide-react'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import { mockParseContent, type SlideData } from '@/lib/mockAI'
import { generatePPTX } from '@/lib/generatePPTX'
import type { Template } from '@/lib/templates'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const NAVY = '#1A2B4A'

const PLACEHOLDER = `How to use PitchPerfect:

1. Write or paste your raw content below — notes, bullet points, or a Word dump.
2. Use short lines as section headings (e.g. "Background", "Key Findings").
3. Follow each heading with bullet points or sentences as the slide body.
4. Click "Generate Slides" — AI will structure your content into compliant slides.
5. Preview the slides on the right, then click "Download PPTX" to get your file.

────────────────────────────────────────
Start typing or paste your content below:
────────────────────────────────────────

`

type AppState = 'idle' | 'processing' | 'done'

function SlidePreviewCard({ slide, index, template }: { slide: SlideData; index: number; template: Template }) {
  const isTitle = slide.type === 'title'
  const isSection = slide.type === 'section'
  const isDark = isTitle || isSection
  const c = template.colors
  const primary = c.primary.startsWith('#') ? c.primary : `#${c.primary}`
  const accent = c.accent.startsWith('#') ? c.accent : `#${c.accent}`
  const highlight = c.highlight.startsWith('#') ? c.highlight : `#${c.highlight}`
  const bg = c.background.startsWith('#') ? c.background : `#${c.background}`
  const textColor = c.text.startsWith('#') ? c.text : `#${c.text}`

  return (
    <div
      className="rounded-xl overflow-hidden shadow-md"
      style={{ background: isDark ? primary : bg, border: isDark ? 'none' : '1px solid #e2e8f0' }}
    >
      <div className="h-1" style={{ background: `linear-gradient(to right, ${accent}, ${highlight})` }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}>
            Slide {index + 1}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
            style={{ background: `${accent}25`, color: accent }}>
            {slide.type}
          </span>
        </div>

        <h3 className="font-bold leading-snug mb-2"
          style={{ fontSize: isTitle ? '1.1rem' : '0.95rem', color: isDark ? '#ffffff' : primary }}>
          {slide.title}
        </h3>

        {slide.subtitle && (
          <p className="text-sm mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b' }}>
            {slide.subtitle}
          </p>
        )}

        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="mt-3 space-y-2">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                <span className="text-sm leading-snug"
                  style={{ color: isDark ? 'rgba(255,255,255,0.8)' : textColor }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-4 py-1.5 flex justify-between items-center"
        style={{ background: isDark ? 'rgba(0,0,0,0.25)' : '#f8fafc' }}>
        <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : '#94a3b8' }}>
          RESTRICTED \ NON-SENSITIVE
        </span>
        <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : '#94a3b8' }}>
          {index + 1}
        </span>
      </div>
    </div>
  )
}

interface Props {
  selectedTemplate: Template
}

export function SlideFormatterPage({ selectedTemplate }: Props) {
  const [input, setInput] = useState('')
  const [state, setState] = useState<AppState>('idle')
  const [isDownloading, setIsDownloading] = useState(false)
  const [slides, setSlides] = useState<SlideData[]>([])
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'txt' && ext !== 'docx' && ext !== 'pdf') {
      setError('Only .txt, .docx, and .pdf files are supported.')
      return
    }
    try {
      let text = ''
      if (ext === 'txt') {
        text = await file.text()
      } else if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const pages = await Promise.all(
          Array.from({ length: pdf.numPages }, (_, i) =>
            pdf.getPage(i + 1).then((page) => page.getTextContent())
          )
        )
        text = pages
          .map((content) => content.items.map((item: any) => ('str' in item ? item.str : '')).join(' '))
          .join('\n')
      }
      setInput(text)
      setUploadedFile(file.name)
    } catch {
      setError('Failed to read file. Please try again.')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const clearFile = () => { setUploadedFile(null); setInput('') }

  const handleGenerate = async () => {
    if (!input.trim()) return
    setState('processing')
    setError('')
    try {
      const result = await mockParseContent(input)
      setSlides(result)
      setState('done')
    } catch {
      setError('Something went wrong. Please try again.')
      setState('idle')
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await generatePPTX(slides, 'PitchPerfect_Slides.pptx', selectedTemplate)
    } catch {
      setError('Failed to generate PPTX. Please try again.')
    }
    setIsDownloading(false)
  }

  const handleReset = () => { setSlides([]); setState('idle'); setInput(''); setError('') }

  const accent = selectedTemplate.colors.accent.startsWith('#')
    ? selectedTemplate.colors.accent
    : `#${selectedTemplate.colors.accent}`

  return (
    <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">

      {/* Left panel */}
      <div className="w-full lg:w-[45%] flex flex-col" style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h2 className="font-semibold text-sm" style={{ color: NAVY }}>Your Content</h2>
          <p className="text-xs mt-0.5 text-slate-400">Paste raw notes, bullet points, or upload a file</p>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          <input ref={fileInputRef} type="file" accept=".txt,.docx,.pdf" className="hidden" onChange={handleFileInput} />

          {uploadedFile ? (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: `${accent}18`, border: `1.5px solid ${accent}`, color: NAVY }}>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" style={{ color: accent }} />
                <span className="truncate max-w-[220px]">{uploadedFile}</span>
              </div>
              <button onClick={clearFile} className="ml-2 hover:opacity-70 transition-opacity">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl cursor-pointer transition-all"
              style={{
                border: `2px dashed ${isDragging ? accent : '#cbd5e1'}`,
                background: isDragging ? `${accent}08` : '#f8fafc',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-5 h-5" style={{ color: isDragging ? accent : '#94a3b8' }} />
              <p className="text-xs text-slate-500">
                <span className="font-semibold" style={{ color: NAVY }}>Upload a file</span>{' '}or drag & drop
              </p>
              <p className="text-[11px] text-slate-400">.docx, .pdf, or .txt supported</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or type / paste below</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <textarea
            className="flex-1 min-h-[260px] w-full rounded-xl p-4 text-sm resize-none leading-relaxed font-mono focus:outline-none"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#334155', transition: 'border-color 0.2s' }}
            onFocus={(e) => (e.target.style.borderColor = accent)}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            placeholder={PLACEHOLDER}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={state === 'processing'}
          />

          <div className="flex gap-3">
            {state !== 'done' ? (
              <button
                onClick={handleGenerate}
                disabled={!input.trim() || state === 'processing'}
                className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: NAVY }}
              >
                {state === 'processing' ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />AI is structuring your slides…</>
                ) : (
                  <><Sparkles className="w-4 h-4" style={{ color: accent }} />Generate Slides</>
                )}
              </button>
            ) : (
              <button onClick={handleReset}
                className="flex items-center justify-center gap-2 text-sm font-medium py-3 px-4 rounded-xl"
                style={{ background: '#f1f5f9', color: '#475569' }}>
                <RotateCcw className="w-4 h-4" />Start Over
              </button>
            )}
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </div>
      </div>

      {/* Right panel — preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between shrink-0"
          style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: NAVY }}>Slide Preview</h2>
            <p className="text-xs mt-0.5 text-slate-400">
              {slides.length > 0
                ? `${slides.length} slides — ${selectedTemplate.name} applied`
                : 'Your structured slides will appear here'}
            </p>
          </div>

          {state === 'done' && slides.length > 0 && (
            <button onClick={handleDownload} disabled={isDownloading}
              className="flex items-center gap-2 text-white text-sm font-bold py-2 px-4 rounded-xl shadow transition-all disabled:opacity-50"
              style={{ background: accent }}>
              {isDownloading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
              ) : (
                <><FileDown className="w-4 h-4" />Download PPTX</>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {state === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: NAVY }}>
                <Sparkles className="w-8 h-8" style={{ color: accent }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: NAVY }}>No slides yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">Paste your content on the left and click "Generate Slides" to get started</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: NAVY }} /> Raw text</span>
                <ChevronRight className="w-3 h-3" />
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#5ACBF0' }} /> AI structures</span>
                <ChevronRight className="w-3 h-3" />
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: accent }} /> PPTX download</span>
              </div>
            </div>
          )}

          {state === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: NAVY }}>
                <span className="w-9 h-9 rounded-full border-4 animate-spin"
                  style={{ borderColor: `${accent}40`, borderTopColor: accent }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: NAVY }}>AI is processing your content…</p>
                <p className="text-xs text-slate-400 mt-1">Structuring slides and applying {selectedTemplate.name}</p>
              </div>
            </div>
          )}

          {state === 'done' && slides.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {slides.map((slide, i) => (
                <SlidePreviewCard key={i} slide={slide} index={i} template={selectedTemplate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
