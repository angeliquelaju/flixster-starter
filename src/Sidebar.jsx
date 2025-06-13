import React from "react";

const Sidebar = ({ navigate, currentView }) => {
  let homeClass = "";
  let favoritesClass = "";
  let watchedClass = "";

  if (currentView === "home") {
    homeClass = "active";
  }
  if (currentView === "favorites") {
    favoritesClass = "active";
  }
  if (currentView === "watched") {
    watchedClass = "active";
  }

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li className={homeClass} onClick={() => navigate("home")}>
            Home
          </li>
          <li className={favoritesClass} onClick={() => navigate("favorites")}>
            Favorites
          </li>
          <li className={watchedClass} onClick={() => navigate("watched")}>
            Watched
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
