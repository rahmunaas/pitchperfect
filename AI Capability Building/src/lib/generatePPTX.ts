import pptxgen from 'pptxgenjs'
import type { SlideData } from './mockAI'
import type { Template } from './templates'
import { DEFAULT_TEMPLATES } from './templates'

const FONT = 'Calibri'
const W = 13.33
const H = 7.5

function addFooter(slide: pptxgen.Slide, slideNum: number, colors: Template['colors']) {
  slide.addShape('rect', {
    x: 0, y: H - 0.42, w: W, h: 0.42,
    fill: { color: colors.primary },
  })
  slide.addText('RESTRICTED \\ NON-SENSITIVE', {
    x: 0.5, y: H - 0.38, w: 5, h: 0.34,
    fontSize: 8, color: colors.headerText, fontFace: FONT,
  })
  slide.addText(String(slideNum), {
    x: W - 1.2, y: H - 0.38, w: 0.8, h: 0.34,
    fontSize: 8, color: colors.headerText, fontFace: FONT, align: 'right',
  })
}

function addAccentBar(slide: pptxgen.Slide, colors: Template['colors']) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.08, h: H - 0.42,
    fill: { color: colors.accent }, line: { color: colors.accent },
  })
}

function addTitleSlide(prs: pptxgen, data: SlideData, slideNum: number, colors: Template['colors']) {
  const slide = prs.addSlide()

  slide.addShape('rect', { x: 0, y: 0, w: W, h: H * 0.55, fill: { color: colors.primary } })
  slide.addShape('rect', { x: 0, y: H * 0.55, w: W, h: H * 0.45, fill: { color: 'F5F5F5' } })
  slide.addShape('rect', { x: 0, y: 0, w: 0.12, h: H, fill: { color: colors.accent }, line: { color: colors.accent } })

  slide.addText('PRESENTATION', {
    x: 0.5, y: 0.3, w: 10, h: 0.35,
    fontSize: 10, color: colors.highlight, fontFace: FONT, bold: true, charSpacing: 3,
  })
  slide.addText(data.title, {
    x: 0.5, y: 0.85, w: 11.5, h: 2.4,
    fontSize: 34, color: colors.headerText, fontFace: FONT, bold: true, valign: 'top', wrap: true,
  })
  slide.addShape('rect', { x: 0.5, y: H * 0.55 + 0.2, w: 4, h: 0.04, fill: { color: colors.accent }, line: { color: colors.accent } })

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5, y: H * 0.55 + 0.38, w: 11, h: 0.6,
      fontSize: 16, color: '6B6B6B', fontFace: FONT,
    })
  }

  addFooter(slide, slideNum, colors)
}

function addSectionSlide(prs: pptxgen, data: SlideData, slideNum: number, colors: Template['colors']) {
  const slide = prs.addSlide()

  slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: colors.primary } })
  slide.addShape('rect', { x: 0, y: 0, w: 0.12, h: H, fill: { color: colors.accent }, line: { color: colors.accent } })
  slide.addText(data.title, {
    x: 1, y: H / 2 - 0.7, w: 10, h: 1.4,
    fontSize: 36, color: colors.headerText, fontFace: FONT, bold: true, valign: 'middle',
  })

  addFooter(slide, slideNum, colors)
}

function addContentSlide(prs: pptxgen, data: SlideData, slideNum: number, colors: Template['colors']) {
  const slide = prs.addSlide()

  slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: colors.background } })
  slide.addShape('rect', { x: 0, y: 0, w: W, h: 1.05, fill: { color: colors.primary } })
  addAccentBar(slide, colors)
  slide.addShape('rect', { x: 0, y: 1.05, w: W, h: 0.05, fill: { color: colors.highlight }, line: { color: colors.highlight } })

  slide.addText(data.title, {
    x: 0.3, y: 0.12, w: 11.5, h: 0.8,
    fontSize: 22, color: colors.headerText, fontFace: FONT, bold: true, valign: 'middle',
  })

  if (data.sectionLabel) {
    slide.addText(data.sectionLabel.toUpperCase(), {
      x: 0.3, y: 0.05, w: 8, h: 0.2,
      fontSize: 7, color: colors.highlight, fontFace: FONT, bold: true, charSpacing: 1.5,
    })
  }

  if (data.bullets && data.bullets.length > 0) {
    const bulletItems = data.bullets.map((b) => ({
      text: b,
      options: { bullet: { type: 'bullet' as const }, fontSize: 16, color: colors.text, paraSpaceAfter: 8 },
    }))
    slide.addText(bulletItems, {
      x: 0.5, y: 1.25, w: 12, h: 5.5,
      fontFace: FONT, fontSize: 16, color: colors.text,
      valign: 'top', bullet: { type: 'bullet' }, lineSpacingMultiple: 1.4,
    })
  }

  if (data.body && (!data.bullets || data.bullets.length === 0)) {
    slide.addText(data.body, {
      x: 0.5, y: 1.3, w: 12, h: 5.5,
      fontFace: FONT, fontSize: 15, color: colors.text,
      valign: 'top', wrap: true, lineSpacingMultiple: 1.5,
    })
  }

  addFooter(slide, slideNum, colors)
}

export async function generatePPTX(
  slides: SlideData[],
  filename = 'PitchPerfect_Slides.pptx',
  template?: Template
) {
  const t = template ?? DEFAULT_TEMPLATES[0]
  const prs = new pptxgen()
  prs.layout = 'LAYOUT_WIDE'

  slides.forEach((slide, i) => {
    const slideNum = i + 1
    switch (slide.type) {
      case 'title':   addTitleSlide(prs, slide, slideNum, t.colors); break
      case 'section': addSectionSlide(prs, slide, slideNum, t.colors); break
      default:        addContentSlide(prs, slide, slideNum, t.colors)
    }
  })

  await prs.writeFile({ fileName: filename })
}
