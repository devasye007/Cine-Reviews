# CineReviews

CineReviews is a full‑stack movie review application built with Next.js App Router, Supabase, and Python. It lets users browse movies, view posters, add new titles, and write ratings and reviews in a clean, responsive interface.[web:254][web:253]

## Features

- Browse a grid of movies with posters, title, overview, release date, and external watch link.[web:253]
- View a dedicated detail page for each movie with community reviews and star ratings.
- Add new movies from an admin‑style form, including release date, poster URL, and watch URL.
- Optional poster upload from the device using Supabase Storage, storing the public URL in the `movies` table.[web:235]
- Row‑level security policies in Supabase to safely allow public viewing and controlled inserts.[web:178]

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, daisyUI.[web:254][web:215]
- **Backend:** Supabase (PostgreSQL, Auth, Storage).[web:254][web:235]
- **Extras:** Python service hooks (optional) for AI‑style helpers such as review translation or analysis.

## Getting Started

### Prerequisites

- Node.js (LTS)
- A Supabase project with:
  - `movies` table: `id`, `title`, `overview`, `release_date`, `poster_url`, `watch_url`, `created_at`.
  - `reviews` table: `id`, `movie_id`, `rating`, `review_text`, `created_at`.
  - RLS policies that allow public `select` on `movies` and `reviews`, and controlled `insert` for reviews (and movies if you want open submissions).[web:178]
- A Storage bucket (for example `posters`) marked public for movie poster images.[web:235]

### Environment Variables

Create a `.env.local` file in the project root:


Add any additional keys you need later (for example, if you wire AI translation).

### Installation


Then open `http://localhost:3000` in your browser.

## Project Structure


- `app/movies/page.tsx` fetches and renders the movie grid as a server component.[web:254]
- `app/movies/[id]/page.tsx` fetches a single movie and its reviews for the detail page.
- Client components handle interactive pieces like forms and buttons.

## Supabase Setup (Summary)

1. Create the `movies` and `reviews` tables in Supabase.
2. Enable **Row‑Level Security** on both tables.
3. Add policies such as:
5. Create a `posters` bucket in Supabase Storage and mark it public for poster hosting.[web:178][web:235]

## Poster Upload Flow

- User can either:
- Paste a direct image URL into the Poster URL field, or
- Select a file and upload it to the `posters` bucket.
- After upload, the app reads the public URL from Storage and fills the Poster URL input.
- On submit, that URL is stored in `movies.poster_url` and rendered on the list and detail pages.[web:235]

## Roadmap

- User profiles and authentication‑gated actions (edit/delete own reviews).
- Search and filtering for movies.
- Real AI‑powered translation/summarization of reviews via external LLM APIs.
- Admin tools for moderating movies and reviews.

## License

This project is released under the MIT License. You are free to use it as a reference or starter for your own movie or review‑based applications.
