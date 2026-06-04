import type { Movie } from '../../types';

interface MovieListViewProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenAdmin: () => void;
}

export function MovieListView({ movies, onSelectMovie, onOpenAdmin }: MovieListViewProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Now showing</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-white">Pick your next big-screen night</h2>
        </div>
        <p className="text-sm text-slate-300">{movies.length} movies available</p>
      </div>

      {movies.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 p-10 text-center">
          <p className="text-lg font-semibold text-white">No movies are available yet.</p>
          <p className="mt-2 text-sm text-slate-400">Add your first title from the admin portal to populate the catalogue.</p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-100"
          >
            Open Admin Portal
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => onSelectMovie(movie)}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/8"
            >
              <div className="relative flex h-72 items-end overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_35%),linear-gradient(160deg,_rgba(15,23,42,0.8),_rgba(2,6,23,1))] p-6">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                  {movie.language}
                </span>
                <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{movie.duration} mins</span>
                  <span>{movie.language}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
