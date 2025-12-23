// app/movies/[id]/ReviewList.tsx
'use client'

import { useState } from 'react'

type Review = {
  id: number
  rating: number
  review_text: string
  created_at: string
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const [translated, setTranslated] = useState<Record<number, string>>({})
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [language, setLanguage] = useState<Record<number, string>>({})

  const handleTranslate = async (review: Review, lang: string) => {
    try {
      setLoadingId(review.id)

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: review.review_text,
          lang,
        }),
      })

      if (!res.ok) {
        throw new Error('Translation request failed')
      }

      const data: { translated: string } = await res.json()

      setTranslated((prev) => ({
        ...prev,
        [review.id]: data.translated,
      }))
    } catch (err) {
      console.error(err)
      setTranslated((prev) => ({
        ...prev,
        [review.id]: 'Translation failed. Please try again.',
      }))
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {reviews.map((r) => (
        <li
          key={r.id}
          className="border border-base-200 rounded-lg p-3 space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="rating rating-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  className="mask mask-star-2 bg-yellow-400"
                  checked={r.rating === star}
                  readOnly
                />
              ))}
            </div>
            <span className="text-[11px] text-base-content/60">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-base-content/80">{r.review_text}</p>

          <div className="flex items-center gap-2">
            <select
              className="select select-xs select-bordered"
              value={language[r.id] || 'en'}
              onChange={(e) =>
                setLanguage((prev) => ({
                  ...prev,
                  [r.id]: e.target.value,
                }))
              }
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
            <button
              type="button"
              className={`btn btn-xs btn-outline ${
                loadingId === r.id ? 'btn-disabled' : ''
              }`}
              onClick={() =>
                handleTranslate(r, language[r.id] || 'en')
              }
            >
              {loadingId === r.id ? 'Translating…' : 'Translate with AI'}
            </button>
          </div>

          {translated[r.id] && (
            <p className="text-xs text-base-content/70 mt-1 italic">
              {translated[r.id]}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
