// app/movies/[id]/ReviewForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ReviewForm({ movieId }: { movieId: number }) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Login required')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('reviews').insert({
      movie_id: movieId,
      user_id: user.id,
      rating,
      review_text: text,
    })
    setLoading(false)

    if (error) {
      alert(error.message)
      console.error(error)
      return
    }

    setText('')
    alert('Review added')
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      {/* Star rating */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Rating</span>
        </label>
        <div className="rating rating-md">
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-yellow-400"
              aria-label={`${star} star`}
              checked={rating === star}
              onChange={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      {/* Text review */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Review</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-28"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts about this movie..."
        />
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
      >
        {loading ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}
