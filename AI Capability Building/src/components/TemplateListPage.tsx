import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Lock } from 'lucide-react'
import { type Template } from '@/lib/templates'

const NAVY = '#1A2B4A'

interface Props {
  templates: Template[]
  selectedId: string
  onSelect: (id: string) => void
  onTemplatesChange: (templates: Template[]) => void
}

interface FormState {
  name: string
  description: string
  primary: string
  accent: string
  highlight: string
  background: string
  text: string
  headerText: string
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  primary: '#1B3A6B',
  accent: '#F26B43',
  highlight: '#5ACBF0',
  background: '#FFFFFF',
  text: '#1A1A1A',
  headerText: '#FFFFFF',
}

function ColorSwatch({ hex }: { hex: string }) {
  const color = hex.startsWith('#') ? hex : `#${hex}`
  return <span className="inline-block w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ background: color }} />
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onDelete,
}: {
  template: Template
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const c = template.colors
  const primary = c.primary.startsWith('#') ? c.primary : `#${c.primary}`
  const accent = c.accent.startsWith('#') ? c.accent : `#${c.accent}`
  const highlight = c.highlight.startsWith('#') ? c.highlight : `#${c.highlight}`
  const bg = c.background.startsWith('#') ? c.background : `#${c.background}`

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all"
      style={{
        border: isSelected ? `2px solid ${accent}` : '2px solid #e2e8f0',
        background: '#fff',
      }}
      onClick={onSelect}
    >
      {/* Mini slide preview */}
      <div className="relative h-24 overflow-hidden" style={{ background: bg }}>
        {/* Header bar */}
        <div className="absolute top-0 left-0 right-0 h-7" style={{ background: primary }} />
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: accent }} />
        {/* Highlight underline */}
        <div className="absolute top-7 left-0 right-0 h-0.5" style={{ background: highlight }} />
        {/* Fake title text */}
        <div className="absolute top-1.5 left-4 right-4 h-2 rounded" style={{ background: 'rgba(255,255,255,0.5)' }} />
        {/* Fake bullet lines */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute left-5 right-4 h-1.5 rounded" style={{ background: `${primary}22`, top: `${36 + i * 12}px` }} />
        ))}
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: primary, opacity: 0.7 }} />

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-1.5 right-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: accent }} />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-semibold text-sm truncate" style={{ color: NAVY }}>{template.name}</p>
              {template.isBuiltIn && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
            </div>
            <p className="text-xs text-slate-400 leading-snug line-clamp-2">{template.description}</p>
          </div>
          {!template.isBuiltIn && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Colour swatches */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <ColorSwatch hex={c.primary} />
          <ColorSwatch hex={c.accent} />
          <ColorSwatch hex={c.highlight} />
          <ColorSwatch hex={c.background} />
          {isSelected && (
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${accent}22`, color: accent }}>
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function AddTemplateModal({ onSave, onClose }: { onSave: (t: Template) => void; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState('')

  const set = (key: keyof FormState, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.name.trim()) { setError('Template name is required.'); return }
    const toHex = (v: string) => v.replace('#', '')
    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim() || 'Custom template',
      isBuiltIn: false,
      colors: {
        primary: toHex(form.primary),
        accent: toHex(form.accent),
        highlight: toHex(form.highlight),
        background: toHex(form.background),
        text: toHex(form.text),
        headerText: toHex(form.headerText),
      },
    }
    onSave(newTemplate)
  }

  const fields: { key: keyof FormState; label: string; isColor: boolean }[] = [
    { key: 'name', label: 'Template Name', isColor: false },
    { key: 'description', label: 'Description (optional)', isColor: false },
    { key: 'primary', label: 'Header / Background', isColor: true },
    { key: 'accent', label: 'Accent Colour', isColor: true },
    { key: 'highlight', label: 'Highlight Colour', isColor: true },
    { key: 'background', label: 'Slide Background', isColor: true },
    { key: 'text', label: 'Body Text', isColor: true },
    { key: 'headerText', label: 'Header Text', isColor: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-base" style={{ color: NAVY }}>Add New Template</h3>
          <p className="text-xs text-slate-400 mt-0.5">Define colours for your organisation's slide template</p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {fields.map(({ key, label, isColor }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
              {isColor ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-slate-400"
                    placeholder="#000000"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400"
                  placeholder={key === 'name' ? 'e.g. My Team Template' : 'Optional description'}
                />
              )}
            </div>
          ))}

          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ background: NAVY }}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  )
}

export function TemplateListPage({ templates, selectedId, onSelect, onTemplatesChange }: Props) {
  const [showModal, setShowModal] = useState(false)

  const handleDelete = (id: string) => {
    const updated = templates.filter((t) => t.id !== id)
    onTemplatesChange(updated)
    if (selectedId === id) onSelect(updated[0]?.id ?? '')
  }

  const handleSave = (t: Template) => {
    const updated = [...templates, t]
    onTemplatesChange(updated)
    onSelect(t.id)
    setShowModal(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-200 bg-white">
        <div>
          <h2 className="font-semibold text-sm" style={{ color: NAVY }}>Template List</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {templates.length} templates · click a card to select it for slide generation
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-xl transition-colors"
          style={{ background: '#8CC63F' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#7ab534')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#8CC63F')}
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isSelected={t.id === selectedId}
              onSelect={() => onSelect(t.id)}
              onDelete={() => handleDelete(t.id)}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-6 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Built-in templates cannot be removed.
        </p>
      </div>

      {showModal && <AddTemplateModal onSave={handleSave} onClose={() => setShowModal(false)} />}
    </div>
  )
}
