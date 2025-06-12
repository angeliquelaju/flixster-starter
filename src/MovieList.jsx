import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard.jsx';
import MovieModal from './MovieModal.jsx';
import Sidebar from './Sidebar.jsx';

const MovieList = () => {
  const [view, setView] = useState('nowPlaying');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [watched, setWatched] = useState(new Set());
  const [allMoviesMap, setAllMoviesMap] = useState(new Map());

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
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=98270f6957c4765c491b8888543df0e2&language=en-US`
    );
    const videosRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=98270f6957c4765c491b8888543df0e2&language=en-US`
    );

    const data = await res.json();
    const videosData = await videosRes.json();

    const trailer = videosData.results.find(
      (video) =>
        video.site === "YouTube" && (video.type === "Trailer") && video.official === true
    );

    let trailerKey = null;
    if (trailer) {
      trailerKey = trailer.key;
    }

    const movieWithTrailer = {...data, trailerKey: trailerKey};
    setSelectedMovie(movieWithTrailer);
    setAllMoviesMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(movieWithTrailer.id, movieWithTrailer);
      return newMap;
    });
  };

  const fetchNowPlaying = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=98270f6957c4765c491b8888543df0e2&language=en-US&page=${pageNum}`);
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => {
          const newMovies = data.results.filter(
            movie => !prev.some(existing => existing.id === movie.id)
          );

          setAllMoviesMap(prevMap => {
            const newMap = new Map(prevMap);
            newMovies.forEach(movie => newMap.set(movie.id, movie));
            return newMap;
          });
          return [...prev, ...newMovies];
        });
      }
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };


  const searchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=98270f6957c4765c491b8888543df0e2&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1`
      );
      const data = await res.json();
      setSearchResults(data.results);
      setAllMoviesMap(prevMap => {
        const newMap = new Map(prevMap);
        data.results.forEach(movie => newMap.set(movie.id, movie));
        return newMap;
      });
    } catch (error) {
      console.error('Failed to search movies:', error);
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
    if (newView === 'nowPlaying' || newView === 'home') {
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

  const toggleFavorite = (movieId) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(movieId)) {
        updated.delete(movieId);
      } else {
        updated.add(movieId);
      }
      return updated;
    });
  };

  const toggleWatched = (movieId) => {
    setWatched(prev => {
      const updated = new Set(prev);
      if (updated.has(movieId)) {
        updated.delete(movieId);
      } else {
        updated.add(movieId);
      }
      return updated;
    });
  };
  
  return (
    <main className = "app-layout">
      <Sidebar currentView = {view} navigate = {(v) => setView(v)} />

      <div className = "main-content">
        <form className = "searchNSort"
          onSubmit = {(e) => {
            e.preventDefault();
            if (searchQuery !== '') {
              searchMovies();
              setView('search');
            }
          }}
        >
          <div className = "left">
            <button type = "button"
              className = "playingButton"
              onClick = {() => handleViewChange('nowPlaying')}
              disabled = {view === 'nowPlaying'}
            >
              Now Playing
            </button>
          </div>

          <div className = "center">
            <input
              type = "text"
              value = {searchQuery}
              onChange = {(e) => setSearchQuery(e.target.value)}
              placeholder = "Search movies..."
              className="searchBar"
            />
            <button type = "submit" className = "searchButton">Search</button>
            <button
              type = "button"
              className = "clearButton"
              onClick = {() => {
                setSearchQuery('');
                setSearchResults([]);
                handleViewChange('nowPlaying');
              }}
            >
              Clear
            </button>
          </div>

          <div className = "right">
            <select
              value = {sortOption}
              onChange = {(e) => setSortOption(e.target.value)}
              className = "sortDrop"
            >
              <option value = "">Sort by...</option>
              <option value = "title">Title</option>
              <option value = "release_date">Release Date</option>
              <option value = "vote_average">Vote Average</option>
            </select>
          </div>
        </form>

        <section className = "movie-list">
          {view === 'favorites' && (
            [...favorites].map(movieId => {
              const movie = allMoviesMap.get(movieId);
              return movie ? (
                <MovieCard
                  key = {movie.id}
                  title = {movie.title}
                  posterPath = {movie.poster_path}
                  voteAverage = {movie.vote_average}
                  onClick = {() => handleMovieClick(movie.id)}
                  isFavorited = {favorites.has(movie.id)}
                  toggleFavorite = {() => toggleFavorite(movie.id)}
                  isWatched = {watched.has(movie.id)}
                  toggleWatched = {() => toggleWatched(movie.id)}
                />
              ) : null;
            })
          )}

          {view === 'watched' && (
            [...watched].map(movieId => {
              const movie = allMoviesMap.get(movieId);
              return movie ? (
                <MovieCard
                  key = {movie.id}
                  title = {movie.title}
                  posterPath = {movie.poster_path}
                  voteAverage = {movie.vote_average}
                  onClick = {() => handleMovieClick(movie.id)}
                  isFavorited = {favorites.has(movie.id)}
                  toggleFavorite = {() => toggleFavorite(movie.id)}
                  isWatched = {watched.has(movie.id)}
                  toggleWatched = {() => toggleWatched(movie.id)}
                />
              ) : null;
            })
          )}

          {(view === 'nowPlaying' || view === 'home') && (
            sortMovies(movies).map((movie) => (
              <MovieCard
                key = {movie.id}
                title = {movie.title}
                posterPath = {movie.poster_path}
                voteAverage = {movie.vote_average}
                onClick = {() => handleMovieClick(movie.id)}
                isFavorited = {favorites.has(movie.id)}
                toggleFavorite = {() => toggleFavorite(movie.id)}
                isWatched = {watched.has(movie.id)}
                toggleWatched = {() => toggleWatched(movie.id)}
              />
            ))
          )}

          {view === 'search' && (
            sortMovies(searchResults).map((movie) => (
              <MovieCard
                key = {movie.id}
                title = {movie.title}
                posterPath = {movie.poster_path}
                voteAverage = {movie.vote_average}
                onClick = {() => handleMovieClick(movie.id)}
                isFavorited = {favorites.has(movie.id)}
                toggleFavorite = {() => toggleFavorite(movie.id)}
                isWatched = {watched.has(movie.id)}
                toggleWatched = {() => toggleWatched(movie.id)}
              />
            ))
          )}
        </section>


        {view === 'nowPlaying' && hasMore && !loading && (
          <div id="load">
            <button className = "loadButton" onClick = {handleLoadMore}>
              Load More
            </button>
          </div>
        )}

        {view === 'home' && hasMore && !loading && (
          <div id="load">
            <button className = "loadButton" onClick = {handleLoadMore}>
              Load More
            </button>
          </div>
        )}

        {view === 'search' && !loading && searchResults.length === 0 && (
          <p>No results found for "{searchQuery}".</p>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose = {() => setSelectedMovie(null)} />
      )}
    </main>

  );
};

export default MovieList;