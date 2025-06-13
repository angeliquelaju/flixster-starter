import React from "react";
import "./App.css";

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <img
          className="modalMoviePicture"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={`${movie.title} backdrop`}
        />
        <div className="modal-details">
          <h2>{movie.title}</h2>
          <p className="modal-release">
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p className="modal-runtime">
            <strong>Runtime:</strong> {movie.runtime} mins
          </p>
          <p className="modal-genre">
            <strong>Genres:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
          <p className="modal-overview">
             <strong>Overview:</strong> {movie.overview}
          </p>
        </div>
        {movie.trailerKey && (
          <div className="trailer-container">
            <h3 className="trailer">Trailer</h3>
            <iframe
              width="90%"
              height="400"
              src={`https://www.youtube.com/embed/${movie.trailerKey}`}
              title="YouTube trailer"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
