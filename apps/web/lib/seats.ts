import type { Movie, Screen, Show, Theatre } from '../types';

export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function generateOccupiedSeats(showId: string) {
  const seats: string[] = [];

  SEAT_ROWS.forEach((row) => {
    for (let col = 1; col <= 8; col += 1) {
      const seatId = `${row}${col}`;
      const hashStr = `${showId}${seatId}`;
      let hash = 0;

      for (let index = 0; index < hashStr.length; index += 1) {
        hash = hashStr.charCodeAt(index) + ((hash << 5) - hash);
      }

      if (Math.abs(hash % 5) === 0 || Math.abs(hash % 7) === 0) {
        seats.push(seatId);
      }
    }
  });

  return seats;
}

export function enrichShows(
  shows: Show[],
  movies: Movie[],
  screens: Screen[],
  theatres: Theatre[],
) {
  return shows.map((show) => {
    const screen = screens.find((item) => item.id === show.screenId);
    const theatre = screen ? theatres.find((item) => item.id === screen.theatreId) : undefined;
    const movie = movies.find((item) => item.id === show.movieId);

    return {
      ...show,
      movie,
      screen: screen ? { ...screen, theatre } : undefined,
    };
  });
}

export function groupShowsByTheatre(shows: Show[]) {
  return shows.reduce<Record<string, { theatre: Theatre; shows: Show[] }>>((acc, show) => {
    const theatre = show.screen?.theatre ?? {
      id: 'unknown',
      name: 'Grand Cinema',
      location: 'Main Arena',
    };

    const theatreShows = (acc[theatre.id] ??= { theatre, shows: [] });
    theatreShows.shows.push(show);
    return acc;
  }, {});
}
