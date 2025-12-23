// app/movies/page.tsx
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default async function MoviesPage() {
  const { data: movies, error } = await supabase
    .from('movies')
    .select('id, title, overview, release_date, poster_url, watch_url')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Movies fetch error:', error)
  }

  return (
    <main className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Movies</h1>

          <Link href="/movies/new" className="btn btn-primary">
            + Add movie
          </Link>
        </div>

        {!movies?.length && !error && (
          <p className="text-sm text-base-content/60">
            No movies found. Add one using the button above.
          </p>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {movies?.map((m) => (
            <div key={m.id} className="card bg-base-100 shadow-xl">
              {m.poster_url && (
                <figure className="aspect-[2/3] overflow-hidden">
                  <img
                    src={m.poster_url}
                    alt={m.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">
                  {m.title}
                  {m.release_date && (
                    <span className="badge badge-outline badge-sm ml-2">
                      {new Date(m.release_date).getFullYear()}
                    </span>
                  )}
                </h2>
                <p className="line-clamp-3 text-sm text-base-content/70">
                  {m.overview}
                </p>
                <div className="card-actions justify-between mt-4">
                  <Link
                    href={`/movies/${m.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Details & Reviews
                  </Link>
                  {m.watch_url && (
                    <a
                      href={m.watch_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline"
                    >
                      Watch
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
