export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Movie {
  id: string;
  title: string;
  duration: number;
  language: string;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
}

export interface Screen {
  id: string;
  name: string;
  totalSeats: number;
  theatreId: string;
  theatre?: Theatre;
}

export interface Show {
  id: string;
  startTime: string;
  price: number;
  movieId: string;
  screenId: string;
  movie?: Movie;
  screen?: Screen;
}

export interface Booking {
  id: string;
  movieTitle: string;
  theatreName: string;
  screenName: string;
  startTime: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
}

export type View = 'MOVIES' | 'MOVIE_DETAILS' | 'SEAT_SELECTION' | 'BOOKINGS' | 'ADMIN';

export type AdminTab = 'MOVIES' | 'THEATRES' | 'SCREENS' | 'SHOWS';

export interface MovieFormValues {
  title: string;
  duration: number;
  language: string;
}

export interface TheatreFormValues {
  name: string;
  location: string;
}

export interface ScreenFormValues {
  name: string;
  totalSeats: number;
  theatreId: string;
}

export interface ShowFormValues {
  movieId: string;
  screenId: string;
  startTime: string;
  price: number;
}
