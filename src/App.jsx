import { useState } from 'react'
import './App.css'
import MovieList from './MovieList.jsx';

const App = () => {
  return (
    <>
      <div className="App">
        <header>
          <h1 id = "headerTitle">🎥 Flixster 🎬</h1>
        </header>
        <MovieList />

        <footer className="app-footer">
          <p>valerie laju</p>
        </footer>
      </div>
    </>
  )
}

export default App