import { useEffect, useState } from "react";

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/odds")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
        ⚽ Odds da Copa do Mundo 2026
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-center text-white mb-3">
              {game.home_team} <span className="text-yellow-400">x</span> {game.away_team}
            </h2>

            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-400 text-center mb-2">Odds Médias</p>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-gray-400">{game.home_team}</p>
                  <p className="text-green-400 font-bold">{game.homeTeamPrice?.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Empate</p>
                  <p className="text-green-400 font-bold">{game.drawPrice?.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">{game.away_team}</p>
                  <p className="text-green-400 font-bold">{game.awayTeamPrice?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-2">Casas de aposta:</p>
            <div className="space-y-2">
              {game.bookmakers.map((bookmaker, j) => (
                <div key={j} className="bg-gray-900 rounded-lg p-2">
                  <p className="text-yellow-400 text-sm font-semibold mb-1">{bookmaker.title}</p>
                  <div className="flex justify-between text-xs text-gray-300">
                    {bookmaker.markets[0].outcomes.map((outcome, k) => (
                      <span key={k}>{outcome.name}: <span className="text-white font-bold">{outcome.price}</span></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;