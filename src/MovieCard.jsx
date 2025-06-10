import React from 'react';

const MovieCard = ({ title, posterPath, voteAverage, onClick }) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  return (
    <article className="movie-card" onClick = {onClick}>
      <img src={`${imageBaseUrl}${posterPath}`} alt={`${title} poster`} />
      <h3 className = "movie-title">{title}</h3>
      <p className = "rating">Rating: {voteAverage}</p>
    </article>
  );
};

export default MovieCard;