export type SlideType = 'title' | 'section' | 'content' | 'bullets'

export interface SlideData {
  type: SlideType
  title: string
  subtitle?: string
  sectionLabel?: string
  bullets?: string[]
  body?: string
}

// Simulates what Claude AI would return when parsing raw text into slides
export async function mockParseContent(rawText: string): Promise<SlideData[]> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1800))

  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const slides: SlideData[] = []

  // Slide 1: Title slide — use first non-empty line as title
  const titleLine = lines[0] || 'Presentation Title'
  const subtitleLine = lines[1] || 'Ministry of Education'
  slides.push({
    type: 'title',
    title: titleLine,
    subtitle: subtitleLine,
  })

  // Group remaining lines into logical sections
  // Detect section headers: short lines (< 60 chars) that look like headings
  const body = lines.slice(2)
  let currentSection: string | null = null
  let currentBullets: string[] = []

  const flushSection = () => {
    if (currentSection && currentBullets.length > 0) {
      slides.push({
        type: 'content',
        title: currentSection,
        sectionLabel: currentSection,
        bullets: currentBullets.slice(0, 6),
      })
      currentSection = null
      currentBullets = []
    }
  }

  for (const line of body) {
    const isHeading =
      line.length < 80 &&
      !line.startsWith('-') &&
      !line.startsWith('•') &&
      !line.match(/^\d+\./) &&
      line === line.split('.')[0] // no period mid-sentence indicator

    if (isHeading && currentBullets.length === 0) {
      // Start new section
      if (currentSection) flushSection()
      currentSection = line
    } else {
      // Treat as bullet content — strip leading dashes/bullets
      const cleaned = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')
      if (cleaned.length > 10) {
        currentBullets.push(cleaned)
        // Auto-flush at 6 bullets to avoid overcrowded slides
        if (currentBullets.length >= 6) {
          flushSection()
        }
      }
    }
  }

  flushSection()

  // If nothing parsed beyond title, generate sensible demo slides
  if (slides.length <= 1) {
    slides.push(
      {
        type: 'content',
        title: 'Background & Context',
        bullets: [
          'Current workflow requires significant manual effort',
          'Officers spend 30–50% of time on formatting compliance',
          'Multiple revision cycles focused on presentation, not substance',
          'Inconsistent slide quality across teams',
        ],
      },
      {
        type: 'content',
        title: 'Proposed Approach',
        bullets: [
          'AI-assisted content-to-slide conversion',
          'Automatic MOE template application',
          'Formatting & compliance auto-checks',
          'Fully editable PowerPoint output',
        ],
      },
      {
        type: 'content',
        title: 'Expected Impact',
        bullets: [
          '40–60% reduction in time spent on formatting',
          'Fewer iteration cycles on formatting issues',
          'More consistent slide quality across teams',
          'Officers can focus on analysis and communication',
        ],
      }
    )
  }

  return slides
}
