export interface Template {
  id: string
  name: string
  description: string
  isBuiltIn?: boolean
  colors: {
    primary: string      // header / title background
    accent: string       // accent bar, bullets, CTA button
    highlight: string    // secondary accent (teal, etc.)
    background: string   // slide body background
    text: string         // body text
    headerText: string   // text on dark header
  }
}

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'moe-corporate-2025',
    name: 'MOE Corporate 2025',
    description: 'Official Ministry of Education corporate template with navy, orange, and teal.',
    isBuiltIn: true,
    colors: {
      primary: '1B3A6B',
      accent: 'F26B43',
      highlight: '5ACBF0',
      background: 'FFFFFF',
      text: '1A1A1A',
      headerText: 'FFFFFF',
    },
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Simple black-and-white layout for clean, distraction-free presentations.',
    isBuiltIn: true,
    colors: {
      primary: '1A1A1A',
      accent: '6366F1',
      highlight: 'A5B4FC',
      background: 'FFFFFF',
      text: '1A1A1A',
      headerText: 'FFFFFF',
    },
  },
  {
    id: 'gov-blue',
    name: 'Government Blue',
    description: 'Classic government-style template in deep blue and gold.',
    isBuiltIn: true,
    colors: {
      primary: '003087',
      accent: 'C9A84C',
      highlight: '6BAED6',
      background: 'F7F9FC',
      text: '1A1A1A',
      headerText: 'FFFFFF',
    },
  },
  {
    id: 'dark-executive',
    name: 'Dark Executive',
    description: 'Bold dark theme for leadership and executive briefings.',
    isBuiltIn: true,
    colors: {
      primary: '0F172A',
      accent: '22D3EE',
      highlight: '818CF8',
      background: '1E293B',
      text: 'E2E8F0',
      headerText: 'FFFFFF',
    },
  },
]

function templatesKey(userId: string) {
  return `pitchperfect_templates_${userId}`
}

function selectedKey(userId: string) {
  return `pitchperfect_selected_template_${userId}`
}

export function loadTemplates(userId: string): Template[] {
  try {
    const stored = localStorage.getItem(templatesKey(userId))
    if (!stored) return DEFAULT_TEMPLATES
    const custom: Template[] = JSON.parse(stored)
    const customOnly = custom.filter((t) => !t.isBuiltIn)
    return [...DEFAULT_TEMPLATES, ...customOnly]
  } catch {
    return DEFAULT_TEMPLATES
  }
}

export function saveTemplates(userId: string, templates: Template[]) {
  const custom = templates.filter((t) => !t.isBuiltIn)
  localStorage.setItem(templatesKey(userId), JSON.stringify(custom))
}

export function loadSelectedTemplateId(userId: string): string {
  return localStorage.getItem(selectedKey(userId)) ?? 'moe-corporate-2025'
}

export function saveSelectedTemplateId(userId: string, id: string) {
  localStorage.setItem(selectedKey(userId), id)
}
