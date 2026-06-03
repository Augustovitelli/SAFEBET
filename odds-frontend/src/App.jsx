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
          <h2>{game.home_team} x {game.away_team}</h2>
          <strong>Esporte:</strong> {game.sportKey} <br />
          <strong>Preços:</strong>
          <p>{game.home_team}: {game.homeTeamPrice.toFixed(2)}</p>
          <p>{game.away_team}: {game.awayTeamPrice.toFixed(2)}</p>
          <p>Empate: {game.drawPrice.toFixed(2)}</p>
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