import React from "react";

const MovieCard = ({
  title,
  posterPath,
  voteAverage,
  onClick,
  isFavorited,
  toggleFavorite,
  isWatched,
  toggleWatched,
}) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  let favouriteButton = "favoriteButton";
  if (isFavorited) {
    favouriteButton += " favorited";
  }
  let watchButton = "watchedButton";
  if (isWatched) {
    watchButton += " watched";
  }

  return (
    <article className="movie-card" onClick={onClick}>
      <img src={`${imageBaseUrl}${posterPath}`} alt={`${title} poster`} />
      <h3 className="movie-title">{title}</h3>
      <p className="rating">Rating: {voteAverage}</p>
      <div className="heartNWatch">
        <button
          className={favouriteButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {isFavorited ? "❤️" : "🖤"}
        </button>
        <button
          className={watchButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatched();
          }}
        >
          {isWatched ? "✅" : "👁️"}
        </button>
      </div>
    </article>
  );
};

export default MovieCard;
