import { useEffect, useState } from "react";

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/odds")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div>
      <h1>Odds da Copa do Mundo</h1>
      {games.map((game, i) => (
        <div key={i}>
          <h2>{game.homeTeam} x {game.awayTeam}</h2>
          {game.bookmakers.map((bookmaker, j) => (
            <div key={j}>
              <strong>{bookmaker.title}</strong>
              {bookmaker.markets[0].outcomes.map((outcome, k) => (
                <p key={k}>{outcome.name}: {outcome.price}</p>
              ))}
            </div>
          ))}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;