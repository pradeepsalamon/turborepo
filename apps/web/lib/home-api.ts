import { apiRequest } from './api-client';
import type {
  Movie,
  MovieFormValues,
  Screen,
  ScreenFormValues,
  Show,
  ShowFormValues,
  Theatre,
  TheatreFormValues,
} from '../types';

export const homeApi = {
  getMovies: () => apiRequest<Movie[]>('/movies'),
  createMovie: (payload: MovieFormValues) =>
    apiRequest<Movie>('/movies', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteMovie: (id: string) =>
    apiRequest<void>(`/movies/${id}`, {
      method: 'DELETE',
      skipJson: true,
    }),
  getTheatres: () => apiRequest<Theatre[]>('/theatre'),
  createTheatre: (payload: TheatreFormValues) =>
    apiRequest<Theatre>('/theatre', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteTheatre: (id: string) =>
    apiRequest<void>(`/theatre/${id}`, {
      method: 'DELETE',
      skipJson: true,
    }),
  getScreens: () => apiRequest<Screen[]>('/screen'),
  createScreen: (payload: ScreenFormValues) =>
    apiRequest<Screen>('/screen', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        totalSeats: Number(payload.totalSeats),
      }),
    }),
  deleteScreen: (id: string) =>
    apiRequest<void>(`/screen/${id}`, {
      method: 'DELETE',
      skipJson: true,
    }),
  getShows: () => apiRequest<Show[]>('/show'),
  createShow: (payload: ShowFormValues) =>
    apiRequest<Show>('/show', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        startTime: new Date(payload.startTime).toISOString(),
        price: Number(payload.price),
      }),
    }),
  deleteShow: (id: string) =>
    apiRequest<void>(`/show/${id}`, {
      method: 'DELETE',
      skipJson: true,
    }),
};
