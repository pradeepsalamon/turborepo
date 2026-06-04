import type { Booking, Movie, Show } from '../types';

const STORAGE_KEY = 'bms_bookings';

export function loadStoredBookings() {
  if (typeof window === 'undefined') {
    return [] as Booking[];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [] as Booking[];
  }

  try {
    return JSON.parse(stored) as Booking[];
  } catch {
    return [] as Booking[];
  }
}

export function saveStoredBookings(bookings: Booking[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function createBooking(params: {
  seats: string[];
  show: Show;
  selectedMovie: Movie | null;
}): Booking {
  const { seats, show, selectedMovie } = params;
  const basePrice = seats.length * show.price;
  const convenienceFee = 45;

  return {
    id: `BMS-${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
    movieTitle: show.movie?.title ?? selectedMovie?.title ?? 'Unknown Movie',
    theatreName: show.screen?.theatre?.name ?? 'Grand Cinema',
    screenName: show.screen?.name ?? 'Screen 1',
    startTime: show.startTime,
    seats: [...seats].sort(),
    totalPrice: basePrice + convenienceFee,
    bookingDate: new Date().toISOString(),
  };
}
