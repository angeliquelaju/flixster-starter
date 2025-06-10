import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard.jsx';
import MovieModal from './MovieModal.jsx';

const MovieList = () => {
  const [view, setView] = useState('nowPlaying');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    if (view === 'nowPlaying') {
      fetchNowPlaying(page);
    }
  }, [page, view]);

  useEffect(() => {
    if (view === 'search' && searchQuery !== '') {
      searchMovies();
    } else if (searchQuery === '') {
      setSearchResults([]);
    }
  }, [searchQuery, view]);

  const handleMovieClick = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`
      );
      const data = await res.json();
      setSelectedMovie(data);
    } catch {
      setError('Failed to fetch movie details.');
    }
  };

  const fetchNowPlaying = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${pageNum}`
      );
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => {
          const newMovies = data.results.filter(
            movie => !prev.some(existing => existing.id === movie.id)
          );
          return [...prev, ...newMovies];
        });
      }
    } catch {
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1`
      );
      const data = await res.json();
      setSearchResults(data.results);
    } catch {
      setError('Failed to search movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (view === 'nowPlaying' && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setError(null);

    if (newView === 'nowPlaying') {
      setMovies([]);
      setPage(1);
      setHasMore(true);
    } else {
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const sortMovies = (movieArray) => {
    if (!sortOption) return movieArray;

    const sorted = [...movieArray];
    switch (sortOption) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));

      case 'release_date':
        return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

      case 'vote_average':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);

      default:
        return movieArray;
    }
  };

  return (
    <main>
      <form className="searchNSort" onSubmit={(e) => {
        e.preventDefault();
        if (searchQuery !== '') {
          setView('search');
          searchMovies();
        }
      }}
      >
        <button type = "button" className = "playingButton" onClick={() => handleViewChange('nowPlaying')} disabled={view === 'nowPlaying'}>Now Playing</button>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search movies..." className = "searchBar"/>
        <button type="submit" className="searchButton">Search</button>

        <button type = "button" className = "clearButton" onClick={() => {
          setSearchQuery('');   
          setSearchResults([]);  
          handleViewChange('nowPlaying'); 
        }}>Clear
        </button>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sortDrop">
          <option value="">Sort by...</option>
          <option value="title">Title</option>
          <option value="release_date">Release Date</option>
          <option value="vote_average">Vote Average</option>
        </select>
      </form>

      <section className="movie-list">
        {(view === 'nowPlaying' ? sortMovies(movies) : sortMovies(searchResults)).map(movie => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            voteAverage={movie.vote_average}
            onClick={() => handleMovieClick(movie.id)}
          />
        ))}
      </section>
      
      <div className = "loadButton">
        {view === 'nowPlaying' && hasMore && !loading && (
        <button onClick={handleLoadMore}>Load More</button>
        )}
      </div>

      {view === 'search' && !loading && searchResults.length === 0 && (
        <p>No results found for "{searchQuery}".</p>
      )}

      {selectedMovie && (<MovieModal movie={selectedMovie} 
      onClose={() => setSelectedMovie(null)} />)}
    </main>
  );
};

export default MovieList;

