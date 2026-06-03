'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';

interface Movie {
  id: string;
  title: string;
  duration: number;
  language: string;
}

interface Theatre {
  id: string;
  name: string;
  location: string;
  screens?: Screen[];
}

interface Screen {
  id: string;
  name: string;
  totalSeats: number;
  theatreId: string;
  theatre?: Theatre;
}

interface Show {
  id: string;
  startTime: string;
  price: number;
  movieId: string;
  screenId: string;
  movie?: Movie;
  screen?: Screen;
}

interface Booking {
  id: string;
  movieTitle: string;
  theatreName: string;
  screenName: string;
  startTime: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:5000';

export default function HomePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Navigation / Views State
  const [currentView, setView] = useState<string>('MOVIES'); // MOVIES, MOVIE_DETAILS, SEAT_SELECTION, BOOKINGS, ADMIN
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showTicketModal, setShowTicketModal] = useState<Booking | null>(null);

  // Admin Tab State
  const [adminTab, setAdminTab] = useState<string>('MOVIES'); // MOVIES, THEATRES, SCREENS, SHOWS

  // Data States
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  // Loading States
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form States
  const [movieForm, setMovieForm] = useState({ title: '', duration: 120, language: 'English' });
  const [theatreForm, setTheatreForm] = useState({ name: '', location: '' });
  const [screenForm, setScreenForm] = useState({ name: 'Screen 1', totalSeats: 64, theatreId: '' });
  const [showForm, setShowForm] = useState({ movieId: '', screenId: '', startTime: '', price: 250 });

  // 64-seat layout seed for show occupied seats
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load Initial Data & Bookings
  useEffect(() => {
    if (user) {
      fetchMovies();
      fetchTheatres();
      fetchScreens();
      fetchShows();
      loadBookings();
    }
  }, [user]);

  // Read bookings history from localStorage
  const loadBookings = () => {
    const stored = localStorage.getItem('bms_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse bookings:', err);
      }
    }
  };

  // Occupied seats generator for seat layout
  useEffect(() => {
    if (selectedShow) {
      // Simulate occupied seats using show id as a seed
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seats: string[] = [];
      // Pick random seats to be occupied
      rows.forEach((row) => {
        for (let col = 1; col <= 8; col++) {
          const seatId = `${row}${col}`;
          // Deterministic hash based on show id + seat id
          const hashStr = selectedShow.id + seatId;
          let hash = 0;
          for (let i = 0; i < hashStr.length; i++) {
            hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
          }
          if (Math.abs(hash % 5) === 0 || Math.abs(hash % 7) === 0) {
            seats.push(seatId);
          }
        }
      });
      setOccupiedSeats(seats);
      setSelectedSeats([]);
    }
  }, [selectedShow]);

  // API Call Handlers
  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API_URL}/movies`);
      if (res.ok) setMovies(await res.json());
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
  };

  const fetchTheatres = async () => {
    try {
      const res = await fetch(`${API_URL}/theatre`);
      if (res.ok) setTheatres(await res.json());
    } catch (err) {
      console.error('Failed to fetch theatres:', err);
    }
  };

  const fetchScreens = async () => {
    try {
      const res = await fetch(`${API_URL}/screen`);
      if (res.ok) setScreens(await res.json());
    } catch (err) {
      console.error('Failed to fetch screens:', err);
    }
  };

  const fetchShows = async () => {
    try {
      const res = await fetch(`${API_URL}/show`);
      if (res.ok) setShows(await res.json());
    } catch (err) {
      console.error('Failed to fetch shows:', err);
    }
  };

  // Form Submission handlers
  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieForm),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Movie "${movieForm.title}" added successfully!`);
        setMovieForm({ title: '', duration: 120, language: 'English' });
        fetchMovies();
      } else {
        setActionError(data.message || 'Failed to add movie');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleDeleteMovie = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    if (!confirm('Are you sure you want to delete this movie?')) return;
    try {
      const res = await fetch(`${API_URL}/movies/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setActionSuccess('Movie deleted successfully');
        fetchMovies();
        fetchShows();
      } else {
        setActionError('Failed to delete movie');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleAddTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`${API_URL}/theatre`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theatreForm),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Theatre "${theatreForm.name}" added successfully!`);
        setTheatreForm({ name: '', location: '' });
        fetchTheatres();
      } else {
        setActionError(data.message || 'Failed to add theatre');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleDeleteTheatre = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    if (!confirm('Are you sure you want to delete this theatre?')) return;
    try {
      const res = await fetch(`${API_URL}/theatre/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setActionSuccess('Theatre deleted successfully');
        fetchTheatres();
        fetchScreens();
        fetchShows();
      } else {
        setActionError('Failed to delete theatre');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleAddScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    if (!screenForm.theatreId) {
      setActionError('Please select a theatre');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: screenForm.name,
          totalSeats: Number(screenForm.totalSeats),
          theatreId: screenForm.theatreId,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Screen "${screenForm.name}" added successfully!`);
        setScreenForm({ name: 'Screen 1', totalSeats: 64, theatreId: '' });
        fetchScreens();
      } else {
        setActionError(data.message || 'Failed to add screen');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleDeleteScreen = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    if (!confirm('Are you sure you want to delete this screen?')) return;
    try {
      const res = await fetch(`${API_URL}/screen/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setActionSuccess('Screen deleted successfully');
        fetchScreens();
        fetchShows();
      } else {
        setActionError('Failed to delete screen');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    if (!showForm.movieId || !showForm.screenId) {
      setActionError('Please select a movie and a screen');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/show`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: new Date(showForm.startTime).toISOString(),
          price: Number(showForm.price),
          movieId: showForm.movieId,
          screenId: showForm.screenId,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess('Show time added successfully!');
        setShowForm({ movieId: '', screenId: '', startTime: '', price: 250 });
        fetchShows();
      } else {
        setActionError(data.message || 'Failed to add showtime');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  const handleDeleteShow = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    if (!confirm('Are you sure you want to delete this showtime?')) return;
    try {
      const res = await fetch(`${API_URL}/show/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setActionSuccess('Showtime deleted successfully');
        fetchShows();
      } else {
        setActionError('Failed to delete showtime');
      }
    } catch (err) {
      setActionError('Network request failed');
    }
  };

  // Seat selection toggle
  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Simulated Booking flow
  const handleCheckout = () => {
    if (selectedSeats.length === 0 || !selectedShow) return;

    const basePrice = selectedSeats.length * selectedShow.price;
    const convenienceFee = 45; // Simulated flat service fee
    const totalPrice = basePrice + convenienceFee;

    const newBooking: Booking = {
      id: 'BMS-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      movieTitle: selectedShow.movie?.title || selectedMovie?.title || 'Unknown Movie',
      theatreName: selectedShow.screen?.theatre?.name || 'Grand Cinema',
      screenName: selectedShow.screen?.name || 'Screen 1',
      startTime: selectedShow.startTime,
      seats: [...selectedSeats].sort(),
      totalPrice,
      bookingDate: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('bms_bookings', JSON.stringify(updatedBookings));

    setShowTicketModal(newBooking);
    setSelectedSeats([]);
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your space...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        setView={(view) => {
          setView(view);
          setActionError(null);
          setActionSuccess(null);
        }}
        user={user}
        logout={logout}
      />

      <main className="content-area">
        {/* VIEW 1: MOVIES LISTING */}
        {currentView === 'MOVIES' && (
          <div>
            <div className="section-title">
              <h2>Now Showing</h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {movies.length} Movies Available
              </span>
            </div>

            {movies.length === 0 ? (
              <div className="dashboard-card" style={{ margin: '3rem auto', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  No movies are currently in the system database.
                </p>
                <button onClick={() => setView('ADMIN')} className="btn-primary" style={{ maxWidth: '240px' }}>
                  Go to Admin Panel & Add Movies
                </button>
              </div>
            ) : (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setView('MOVIE_DETAILS');
                    }}
                  >
                    <div className="movie-poster-placeholder">
                      <span className="movie-icon">🎬</span>
                      <span className="movie-lang-tag">{movie.language}</span>
                    </div>
                    <div className="movie-card-body">
                      <h3 className="movie-card-title">{movie.title}</h3>
                      <div className="movie-card-info">
                        <span>⌛ {movie.duration} mins</span>
                        <span>{movie.language}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MOVIE DETAILS & SHOWTIMES */}
        {currentView === 'MOVIE_DETAILS' && selectedMovie && (
          <div>
            <button className="btn-back" onClick={() => setView('MOVIES')}>
              ← Back to Movies
            </button>

            <div className="movie-detail-header">
              <div className="movie-detail-poster">
                <span className="movie-icon" style={{ fontSize: '5rem' }}>🎬</span>
              </div>
              <div className="movie-detail-info">
                <h2>{selectedMovie.title}</h2>
                <div className="movie-metadata-pills">
                  <span className="metadata-pill">⌛ {selectedMovie.duration} Minutes</span>
                  <span className="metadata-pill">🌐 {selectedMovie.language}</span>
                  <span className="metadata-pill">UA / 13+</span>
                </div>
                <p className="movie-desc">
                  Immerse yourself in this thrilling cinematic journey. Book tickets now to experience it on the big screen with premium Dolby Atmos sound in top theatres near you.
                </p>
              </div>
            </div>

            <div className="section-title">
              <h3>Available Showtimes</h3>
            </div>

            <div className="showtimes-container">
              {(() => {
                // Filter and group shows for this movie by theatre
                const movieShows = shows.filter((s) => s.movieId === selectedMovie.id);
                if (movieShows.length === 0) {
                  return (
                    <div className="no-showtimes">
                      <p>No showtimes available for this movie right now.</p>
                      <button 
                        onClick={() => {
                          setShowForm({ ...showForm, movieId: selectedMovie.id });
                          setAdminTab('SHOWS');
                          setView('ADMIN');
                        }} 
                        className="btn-primary" 
                        style={{ marginTop: '1.5rem', maxWidth: '240px' }}
                      >
                        Create a Showtime
                      </button>
                    </div>
                  );
                }

                // Group by Theatre ID
                const groupedByTheatre: { [key: string]: { theatre: Theatre; shows: Show[] } } = {};
                movieShows.forEach((show) => {
                  const screenDetail = screens.find((sc) => sc.id === show.screenId);
                  const theatreDetail = screenDetail
                    ? theatres.find((th) => th.id === screenDetail.theatreId)
                    : null;
                  
                  const theatreId = theatreDetail?.id || 'unknown';
                  const theatreName = theatreDetail?.name || 'Grand Cinema';
                  const theatreLoc = theatreDetail?.location || 'Main Arena';

                  // Attach relations to show object for display
                  show.screen = screenDetail;
                  if (show.screen) show.screen.theatre = theatreDetail || undefined;
                  show.movie = selectedMovie;

                  if (!groupedByTheatre[theatreId]) {
                    groupedByTheatre[theatreId] = {
                      theatre: { id: theatreId, name: theatreName, location: theatreLoc },
                      shows: [],
                    };
                  }
                  groupedByTheatre[theatreId].shows.push(show);
                });

                return Object.values(groupedByTheatre).map(({ theatre, shows: theatreShows }) => (
                  <div key={theatre.id} className="theatre-showtime-row">
                    <div className="theatre-info-col">
                      <h3>{theatre.name}</h3>
                      <p>📍 {theatre.location}</p>
                    </div>
                    <div className="showtimes-grid-col">
                      {theatreShows.sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((show) => (
                        <button
                          key={show.id}
                          className="showtime-pill-btn"
                          onClick={() => {
                            setSelectedShow(show);
                            setView('SEAT_SELECTION');
                          }}
                        >
                          <span className="showtime-time">
                            {new Date(show.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                          <span className="showtime-price">₹{show.price}</span>
                          <span className="showtime-screen">{show.screen?.name || 'Screen 1'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* VIEW 3: SEAT SELECTION */}
        {currentView === 'SEAT_SELECTION' && selectedShow && (
          <div>
            <button className="btn-back" onClick={() => setView('MOVIE_DETAILS')}>
              ← Back to Showtimes
            </button>

            <div className="section-title">
              <div>
                <h2>Select Seats</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginTop: '0.2rem' }}>
                  {selectedShow.movie?.title} • {selectedShow.screen?.theatre?.name} ({selectedShow.screen?.name}) • {formatDate(selectedShow.startTime)}
                </p>
              </div>
            </div>

            <div className="seat-booking-layout">
              {/* Seating Grid */}
              <div className="seating-section">
                <div className="screen-indicator"></div>
                <div className="screen-text">All eyes this way (Screen)</div>

                <div className="seating-grid">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((row) => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
                        const seatId = `${row}${col}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={col}
                            disabled={isOccupied}
                            className={`seat-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSeat(seatId)}
                          >
                            {col}
                          </button>
                        );
                      })}
                      <span className="row-label" style={{ marginLeft: '0.5rem' }}>{row}</span>
                    </div>
                  ))}
                </div>

                <div className="legend-container">
                  <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color occupied"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Checkout panel */}
              <div className="checkout-panel">
                <h3 className="checkout-title">Ticket Summary</h3>

                {selectedSeats.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>
                    Select seats from the grid to proceed with checkout.
                  </p>
                ) : (
                  <>
                    <div className="checkout-row">
                      <span className="label">Movie</span>
                      <span className="val">{selectedShow.movie?.title}</span>
                    </div>
                    <div className="checkout-row">
                      <span className="label">Cinema</span>
                      <span className="val">{selectedShow.screen?.theatre?.name}</span>
                    </div>
                    <div className="checkout-row">
                      <span className="label">Seats selected ({selectedSeats.length})</span>
                      <span className="val">
                        <div className="checkout-seats-list">
                          {selectedSeats.map((seat) => (
                            <span key={seat} className="checkout-seat-badge">{seat}</span>
                          ))}
                        </div>
                      </span>
                    </div>
                    <div className="checkout-row" style={{ marginTop: '1rem' }}>
                      <span className="label">Ticket Price (Base)</span>
                      <span className="val">₹{selectedShow.price} x {selectedSeats.length}</span>
                    </div>
                    <div className="checkout-row">
                      <span className="label">Base Amount</span>
                      <span className="val">₹{selectedShow.price * selectedSeats.length}</span>
                    </div>
                    <div className="checkout-row">
                      <span className="label">Convenience Fees</span>
                      <span className="val">₹45.00</span>
                    </div>

                    <div className="checkout-total-row">
                      <span>Total Amount</span>
                      <span className="total-val">₹{(selectedShow.price * selectedSeats.length) + 45}</span>
                    </div>

                    <button onClick={handleCheckout} className="btn-primary">
                      Confirm & Pay Securely
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MY BOOKINGS LIST */}
        {currentView === 'BOOKINGS' && (
          <div>
            <div className="section-title">
              <h2>My Tickets History</h2>
            </div>

            {bookings.length === 0 ? (
              <div className="dashboard-card" style={{ margin: '3rem auto', textAlign: 'center' }}>
                <span className="movie-icon" style={{ fontSize: '4rem' }}>🎟️</span>
                <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0' }}>
                  You haven't booked any movie tickets yet.
                </p>
                <button onClick={() => setView('MOVIES')} className="btn-primary" style={{ maxWidth: '240px' }}>
                  Explore Movies Now
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-item-card">
                    <div className="booking-item-left">
                      <h3 className="booking-item-title">{booking.movieTitle}</h3>
                      <div className="booking-item-meta">
                        <span>📍 {booking.theatreName} ({booking.screenName})</span>
                        <span>📅 {formatDate(booking.startTime)}</span>
                        <span>🎟️ Seats: {booking.seats.join(', ')}</span>
                      </div>
                    </div>
                    <div className="booking-item-right">
                      <span className="booking-item-price">₹{booking.totalPrice}</span>
                      <span className="booking-item-id">ID: {booking.id}</span>
                      <button 
                        onClick={() => setShowTicketModal(booking)}
                        className="btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: 'auto', marginTop: '0.5rem', boxShadow: 'none' }}
                      >
                        Show Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ADMIN PORTAL */}
        {currentView === 'ADMIN' && (
          <div>
            <div className="section-title">
              <h2>Database Administration Panel</h2>
            </div>

            <div className="admin-tabs">
              <button
                className={`admin-tab-btn ${adminTab === 'MOVIES' ? 'active' : ''}`}
                onClick={() => { setAdminTab('MOVIES'); setActionError(null); setActionSuccess(null); }}
              >
                Manage Movies
              </button>
              <button
                className={`admin-tab-btn ${adminTab === 'THEATRES' ? 'active' : ''}`}
                onClick={() => { setAdminTab('THEATRES'); setActionError(null); setActionSuccess(null); }}
              >
                Manage Theatres
              </button>
              <button
                className={`admin-tab-btn ${adminTab === 'SCREENS' ? 'active' : ''}`}
                onClick={() => { setAdminTab('SCREENS'); setActionError(null); setActionSuccess(null); }}
              >
                Manage Screens
              </button>
              <button
                className={`admin-tab-btn ${adminTab === 'SHOWS' ? 'active' : ''}`}
                onClick={() => { setAdminTab('SHOWS'); setActionError(null); setActionSuccess(null); }}
              >
                Manage Shows
              </button>
            </div>

            {/* Error/Success Feedback */}
            {actionError && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{actionError}</div>}
            {actionSuccess && <div className="auth-success" style={{ marginBottom: '1.5rem' }}>{actionSuccess}</div>}

            <div className="admin-layout">
              {/* TAB 1: MOVIES MANAGEMENT */}
              {adminTab === 'MOVIES' && (
                <>
                  <div className="admin-main-section">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Duration</th>
                          <th>Language</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movies.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="empty-state">No movies found in database.</td>
                          </tr>
                        ) : (
                          movies.map((movie) => (
                            <tr key={movie.id}>
                              <td><strong>{movie.title}</strong></td>
                              <td>{movie.duration} mins</td>
                              <td>{movie.language}</td>
                              <td>
                                <button className="btn-delete" onClick={() => handleDeleteMovie(movie.id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-form-section">
                    <h3 className="admin-form-title">➕ Add New Movie</h3>
                    <form onSubmit={handleAddMovie}>
                      <div className="form-group">
                        <label className="form-label">Movie Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Inception"
                          className="form-input"
                          value={movieForm.title}
                          onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Duration (minutes)</label>
                        <input
                          type="number"
                          required
                          min={1}
                          className="form-input"
                          value={movieForm.duration}
                          onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Language</label>
                        <select
                          className="form-input"
                          value={movieForm.language}
                          onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="Japanese">Japanese</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-primary">Create Movie</button>
                    </form>
                  </div>
                </>
              )}

              {/* TAB 2: THEATRES MANAGEMENT */}
              {adminTab === 'THEATRES' && (
                <>
                  <div className="admin-main-section">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Theatre Name</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {theatres.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="empty-state">No theatres found in database.</td>
                          </tr>
                        ) : (
                          theatres.map((th) => (
                            <tr key={th.id}>
                              <td><strong>{th.name}</strong></td>
                              <td>{th.location}</td>
                              <td>
                                <button className="btn-delete" onClick={() => handleDeleteTheatre(th.id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-form-section">
                    <h3 className="admin-form-title">➕ Add New Theatre</h3>
                    <form onSubmit={handleAddTheatre}>
                      <div className="form-group">
                        <label className="form-label">Theatre Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. IMAX Grand City"
                          className="form-input"
                          value={theatreForm.name}
                          onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location / Address</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Connaught Place, New Delhi"
                          className="form-input"
                          value={theatreForm.location}
                          onChange={(e) => setTheatreForm({ ...theatreForm, location: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-primary">Create Theatre</button>
                    </form>
                  </div>
                </>
              )}

              {/* TAB 3: SCREENS MANAGEMENT */}
              {adminTab === 'SCREENS' && (
                <>
                  <div className="admin-main-section">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Screen Name</th>
                          <th>Total Seats</th>
                          <th>Theatre Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {screens.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="empty-state">No screens found in database.</td>
                          </tr>
                        ) : (
                          screens.map((sc) => {
                            const theatreParent = theatres.find((t) => t.id === sc.theatreId);
                            return (
                              <tr key={sc.id}>
                               <td><strong>{sc.name}</strong></td>
                               <td>{sc.totalSeats} seats</td>
                               <td>{theatreParent ? `${theatreParent.name} (${theatreParent.location})` : 'Unknown'}</td>
                               <td>
                                 <button className="btn-delete" onClick={() => handleDeleteScreen(sc.id)}>
                                   Delete
                                 </button>
                               </td>
                             </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-form-section">
                    <h3 className="admin-form-title">➕ Add Screen to Theatre</h3>
                    <form onSubmit={handleAddScreen}>
                      <div className="form-group">
                        <label className="form-label">Select Parent Theatre</label>
                        <select
                          className="form-input"
                          value={screenForm.theatreId}
                          onChange={(e) => setScreenForm({ ...screenForm, theatreId: e.target.value })}
                          required
                        >
                          <option value="">-- Choose Theatre --</option>
                          {theatres.map((th) => (
                            <option key={th.id} value={th.id}>{th.name} ({th.location})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Screen Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Screen 1 (Dolby)"
                          className="form-input"
                          value={screenForm.name}
                          onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Capacity (Total Seats)</label>
                        <input
                          type="number"
                          required
                          min={10}
                          max={200}
                          className="form-input"
                          value={screenForm.totalSeats}
                          onChange={(e) => setScreenForm({ ...screenForm, totalSeats: Number(e.target.value) })}
                        />
                      </div>
                      <button type="submit" className="btn-primary" disabled={theatres.length === 0}>
                        Create Screen
                      </button>
                    </form>
                  </div>
                </>
              )}

              {/* TAB 4: SHOWS MANAGEMENT */}
              {adminTab === 'SHOWS' && (
                <>
                  <div className="admin-main-section">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Movie</th>
                          <th>Screen / Theatre</th>
                          <th>Start Time</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shows.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="empty-state">No showtimes found in database.</td>
                          </tr>
                        ) : (
                          shows.map((sh) => {
                            const movieParent = movies.find((m) => m.id === sh.movieId);
                            const screenParent = screens.find((sc) => sc.id === sh.screenId);
                            const theatreParent = screenParent ? theatres.find((t) => t.id === screenParent.theatreId) : null;
                            return (
                              <tr key={sh.id}>
                               <td><strong>{movieParent?.title || 'Unknown Movie'}</strong></td>
                               <td>
                                 {screenParent?.name || 'Unknown Screen'} 
                                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                   {theatreParent?.name || 'Unknown Theatre'}
                                 </div>
                               </td>
                               <td>{formatDate(sh.startTime)}</td>
                               <td style={{ color: '#86efac', fontWeight: 'bold' }}>₹{sh.price}</td>
                               <td>
                                 <button className="btn-delete" onClick={() => handleDeleteShow(sh.id)}>
                                   Delete
                                 </button>
                               </td>
                             </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-form-section">
                    <h3 className="admin-form-title">➕ Create Showtime</h3>
                    <form onSubmit={handleAddShow}>
                      <div className="form-group">
                        <label className="form-label">Select Movie</label>
                        <select
                          className="form-input"
                          value={showForm.movieId}
                          onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                          required
                        >
                          <option value="">-- Choose Movie --</option>
                          {movies.map((m) => (
                            <option key={m.id} value={m.id}>{m.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Select Screen</label>
                        <select
                          className="form-input"
                          value={showForm.screenId}
                          onChange={(e) => setShowForm({ ...showForm, screenId: e.target.value })}
                          required
                        >
                          <option value="">-- Choose Screen --</option>
                          {screens.map((sc) => {
                            const th = theatres.find((t) => t.id === sc.theatreId);
                            return (
                              <option key={sc.id} value={sc.id}>
                                {sc.name} — {th?.name || 'Grand Cinema'} ({th?.location})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Start Date & Time</label>
                        <input
                          type="datetime-local"
                          required
                          className="form-input"
                          value={showForm.startTime}
                          onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Ticket Price (INR)</label>
                        <input
                          type="number"
                          required
                          min={50}
                          className="form-input"
                          value={showForm.price}
                          onChange={(e) => setShowForm({ ...showForm, price: Number(e.target.value) })}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={movies.length === 0 || screens.length === 0}
                      >
                        Schedule Show
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL OVERLAY: Cinema ticket receipt */}
      {showTicketModal && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <div className="ticket-header">
              <h3 className="ticket-header-title">Booking Successful!</h3>
              <p className="ticket-header-subtitle">Your cinema ticket is confirmed</p>
            </div>
            
            <div className="ticket-body">
              <div className="ticket-row">
                <div className="ticket-field">
                  <span className="ticket-label">Movie</span>
                  <span className="ticket-value" style={{ fontSize: '1.15rem' }}>{showTicketModal.movieTitle}</span>
                </div>
              </div>

              <div className="ticket-row">
                <div className="ticket-field">
                  <span className="ticket-label">Cinema</span>
                  <span className="ticket-value">{showTicketModal.theatreName}</span>
                </div>
                <div className="ticket-field right">
                  <span className="ticket-label">Auditorium</span>
                  <span className="ticket-value">{showTicketModal.screenName}</span>
                </div>
              </div>

              <div className="ticket-row">
                <div className="ticket-field">
                  <span className="ticket-label">Show Date & Time</span>
                  <span className="ticket-value">{formatDate(showTicketModal.startTime)}</span>
                </div>
              </div>

              <div className="ticket-divider">
                <div className="ticket-divider-line"></div>
              </div>

              <div className="ticket-row">
                <div className="ticket-field">
                  <span className="ticket-label">Selected Seats</span>
                  <span className="ticket-value" style={{ color: '#818cf8' }}>{showTicketModal.seats.join(', ')}</span>
                </div>
                <div className="ticket-field right">
                  <span className="ticket-label">Paid Amount</span>
                  <span className="ticket-value accent">₹{showTicketModal.totalPrice}</span>
                </div>
              </div>

              <div className="ticket-row">
                <div className="ticket-field">
                  <span className="ticket-label">Booking Reference</span>
                  <span className="ticket-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {showTicketModal.id}
                  </span>
                </div>
              </div>

              {/* QR Code Mock */}
              <div className="ticket-qr-placeholder">
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
                  {/* Generated mini QR code grid */}
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="20" height="20" fill="black" />
                  <rect x="15" y="15" width="10" height="10" fill="white" />
                  <rect x="70" y="10" width="20" height="20" fill="black" />
                  <rect x="75" y="15" width="10" height="10" fill="white" />
                  <rect x="10" y="70" width="20" height="20" fill="black" />
                  <rect x="15" y="75" width="10" height="10" fill="white" />
                  {/* Random pixels */}
                  <rect x="35" y="10" width="5" height="5" fill="black" />
                  <rect x="45" y="10" width="5" height="10" fill="black" />
                  <rect x="55" y="15" width="10" height="5" fill="black" />
                  <rect x="35" y="25" width="10" height="5" fill="black" />
                  <rect x="50" y="25" width="15" height="5" fill="black" />
                  
                  <rect x="10" y="35" width="5" height="10" fill="black" />
                  <rect x="20" y="45" width="10" height="5" fill="black" />
                  <rect x="15" y="55" width="5" height="10" fill="black" />
                  
                  <rect x="35" y="35" width="20" height="5" fill="black" />
                  <rect x="40" y="45" width="5" height="10" fill="black" />
                  <rect x="50" y="40" width="10" height="15" fill="black" />
                  
                  <rect x="70" y="35" width="10" height="5" fill="black" />
                  <rect x="85" y="40" width="5" height="15" fill="black" />
                  <rect x="75" y="50" width="10" height="5" fill="black" />
                  
                  <rect x="35" y="70" width="5" height="15" fill="black" />
                  <rect x="45" y="75" width="15" height="5" fill="black" />
                  <rect x="50" y="85" width="10" height="5" fill="black" />
                  
                  <rect x="70" y="70" width="15" height="5" fill="black" />
                  <rect x="75" y="80" width="5" height="10" fill="black" />
                  <rect x="85" y="75" width="5" height="15" fill="black" />
                </svg>
              </div>

              <button 
                onClick={() => {
                  setShowTicketModal(null);
                  setView('BOOKINGS');
                }} 
                className="btn-close-ticket"
              >
                Close & Go to My Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
