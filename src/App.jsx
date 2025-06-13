import { useState } from "react";
import "./App.css";
import MovieList from "./MovieList.jsx";

const App = () => {
  return (
    <>
      <div className="App">
        <header>
          <h1 id="headerTitle">🎥 Flixster 🎬</h1>
        </header>
        <MovieList />

        <footer>
          <p className="footer">valerie laju</p>
        </footer>
      </div>
    </>
  );
};

export default App;
