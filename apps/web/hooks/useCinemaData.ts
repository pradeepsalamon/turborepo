'use client';

import { useEffect, useState } from 'react';
import { homeApi } from '../lib/home-api';
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

export function useCinemaData(enabled: boolean) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setActionError(null);
    setActionSuccess(null);
  };

  const refreshAll = async () => {
    setDataLoading(true);

    try {
      const [movieList, theatreList, screenList, showList] = await Promise.all([
        homeApi.getMovies(),
        homeApi.getTheatres(),
        homeApi.getScreens(),
        homeApi.getShows(),
      ]);

      setMovies(movieList);
      setTheatres(theatreList);
      setScreens(screenList);
      setShows(showList);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      void refreshAll();
    }
  }, [enabled]);

  const runAction = async (action: () => Promise<void>) => {
    clearMessages();

    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Request failed');
    }
  };

  return {
    movies,
    theatres,
    screens,
    shows,
    dataLoading,
    actionError,
    actionSuccess,
    clearMessages,
    refreshAll,
    createMovie: async (payload: MovieFormValues) => {
      await runAction(async () => {
        await homeApi.createMovie(payload);
        setActionSuccess(`Movie "${payload.title}" added successfully.`);
        await refreshAll();
      });
    },
    deleteMovie: async (id: string) => {
      await runAction(async () => {
        await homeApi.deleteMovie(id);
        setActionSuccess('Movie deleted successfully.');
        await refreshAll();
      });
    },
    createTheatre: async (payload: TheatreFormValues) => {
      await runAction(async () => {
        await homeApi.createTheatre(payload);
        setActionSuccess(`Theatre "${payload.name}" added successfully.`);
        await refreshAll();
      });
    },
    deleteTheatre: async (id: string) => {
      await runAction(async () => {
        await homeApi.deleteTheatre(id);
        setActionSuccess('Theatre deleted successfully.');
        await refreshAll();
      });
    },
    createScreen: async (payload: ScreenFormValues) => {
      await runAction(async () => {
        await homeApi.createScreen(payload);
        setActionSuccess(`Screen "${payload.name}" added successfully.`);
        await refreshAll();
      });
    },
    deleteScreen: async (id: string) => {
      await runAction(async () => {
        await homeApi.deleteScreen(id);
        setActionSuccess('Screen deleted successfully.');
        await refreshAll();
      });
    },
    createShow: async (payload: ShowFormValues) => {
      await runAction(async () => {
        await homeApi.createShow(payload);
        setActionSuccess('Showtime added successfully.');
        await refreshAll();
      });
    },
    deleteShow: async (id: string) => {
      await runAction(async () => {
        await homeApi.deleteShow(id);
        setActionSuccess('Showtime deleted successfully.');
        await refreshAll();
      });
    },
  };
}
