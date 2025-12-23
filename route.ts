// app/api/translate/route.ts
import { NextResponse } from 'next/server'

type Body = {
  text: string
  lang: string   // 'en', 'hi', 'es', 'fr', 'de', 'ja'
}

const libreLangMap: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ja: 'ja',
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()
    const { text, lang } = body

    const target = libreLangMap[lang] ?? 'en'

    if (!text || !text.trim()) {
      return NextResponse.json(
        { translated: 'No text provided.' },
        { status: 400 }
      )
    }

    // Public LibreTranslate-compatible instance
    const res = await fetch('https://translate.astian.org/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target,
        format: 'text',
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('LibreTranslate error:', res.status, errorText)
      return NextResponse.json(
        { translated: `Translation error: ${res.status}` },
        { status: 500 }
      )
    }

    const data = (await res.json()) as { translatedText: string }

    return NextResponse.json(
      { translated: data.translatedText },
      { status: 200 }
    )
  } catch (err) {
    console.error('Translate route error:', err)
    return NextResponse.json(
      { translated: 'Translation error on server.' },
      { status: 500 }
    )
  }
}
