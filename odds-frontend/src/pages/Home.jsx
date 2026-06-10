import { useEffect, useState } from "react";

function Home() {
  const [games, setGames] = useState([]);
  const [betSlip, setBetSlip] = useState([]); // seleções no painel
  const [valorApostado, setValorApostado] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/odds")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  function adicionarSelecao(outcomeId, name, price, gameName) {
    const jaExiste = betSlip.find((s) => s.outcomeId === outcomeId);
    if (jaExiste) {
      setBetSlip(betSlip.filter((s) => s.outcomeId !== outcomeId));
    } else {
      setBetSlip([...betSlip, { outcomeId, name, price, gameName }]);
    }
  }

  function estaSelecionado(outcomeId) {
    return betSlip.some((s) => s.outcomeId === outcomeId);
  }

  function calcularOddTotal() {
    return betSlip.reduce((acc, s) => acc * s.price, 1).toFixed(2);
  }

  function calcularRetorno() {
    return (parseFloat(valorApostado || 0) * calcularOddTotal()).toFixed(2);
  }

  async function fazerAposta() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMensagem("Você precisa estar logado para apostar!");
      return;
    }
    if (betSlip.length === 0) {
      setMensagem("Adicione pelo menos uma seleção!");
      return;
    }
    if (!valorApostado || parseFloat(valorApostado) <= 0) {
      setMensagem("Digite um valor válido!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valorApostado: parseFloat(valorApostado),
          selections: betSlip.map((s) => ({
            outcomeId: s.outcomeId,
            odd: s.price,
          })),
        }),
      });

      if (res.ok) {
        setMensagem("Aposta realizada com sucesso! ✅");
        setBetSlip([]);
        setValorApostado("");
      } else {
        setMensagem("Erro ao realizar aposta. Verifique seu saldo!");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-6">
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
                    <div className="flex justify-between text-xs gap-1">
                      {bookmaker.markets[0].outcomes.map((outcome, k) => (
                        <button
                          key={k}
                          onClick={() => adicionarSelecao(
                            outcome.id,
                            outcome.name,
                            outcome.price,
                            `${game.home_team} x ${game.away_team}`
                          )}
                          className={`flex-1 rounded px-2 py-1 text-center transition ${
                            estaSelecionado(outcome.id)
                              ? "bg-yellow-400 text-gray-900 font-bold"
                              : "bg-gray-700 text-white hover:bg-gray-600"
                          }`}
                        >
                          <span className="block">{outcome.name}</span>
                          <span className="font-bold">{outcome.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAINEL LATERAL */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-yellow-400 mb-4">🎯 Boletim de Apostas</h2>

        {betSlip.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-4">
            Clique em uma odd para adicionar
          </p>
        ) : (
          <div className="flex-1 space-y-2 overflow-y-auto">
            {betSlip.map((s, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-3">
                <p className="text-xs text-gray-400">{s.gameName}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white text-sm font-semibold">{s.name}</p>
                  <p className="text-yellow-400 font-bold">{s.price}</p>
                </div>
                <button
                  onClick={() => adicionarSelecao(s.outcomeId, s.name, s.price, s.gameName)}
                  className="text-red-400 text-xs mt-1 hover:text-red-300"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {betSlip.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Odd Total:</span>
              <span className="text-yellow-400 font-bold">{calcularOddTotal()}</span>
            </div>

            <input
              type="number"
              value={valorApostado}
              onChange={(e) => setValorApostado(e.target.value)}
              placeholder="Valor apostado (R$)"
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {valorApostado && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Retorno possível:</span>
                <span className="text-green-400 font-bold">R$ {calcularRetorno()}</span>
              </div>
            )}

            <button
              onClick={fazerAposta}
              className="w-full bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Apostar
            </button>

            {mensagem && (
              <p className="text-sm text-center text-green-400">{mensagem}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;