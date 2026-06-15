import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [games, setGames] = useState([]);
  const [betSlip, setBetSlip] = useState([]);
  const [valorApostado, setValorApostado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [saldo, setSaldo] = useState(null);
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/odds")
      .then((res) => res.json())
      .then((data) => setGames(data));

    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8080/usuario/saldo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setSaldo(data));
    }
  }, []);

  function adicionarSelecao(outcomeId, name, price, gameName) {
    const jaExiste = betSlip.find((s) => s.outcomeId === outcomeId);
    if (jaExiste) {
      const novo = betSlip.filter((s) => s.outcomeId !== outcomeId);
      setBetSlip(novo);
      if (novo.length === 0) setBetSlipOpen(false);
    } else {
      setBetSlip([...betSlip, { outcomeId, name, price, gameName }]);
      setBetSlipOpen(true);
    }
  }

  function removerSelecao(outcomeId) {
    const novo = betSlip.filter((s) => s.outcomeId !== outcomeId);
    setBetSlip(novo);
    if (novo.length === 0) {
      setBetSlipOpen(false);
      setValorApostado("");
      setMensagem("");
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
    if (!token) { setMensagem("Faça login para apostar."); return; }
    if (betSlip.length === 0) { setMensagem("Adicione uma seleção."); return; }
    if (!valorApostado || parseFloat(valorApostado) <= 0) { setMensagem("Digite um valor válido."); return; }

    try {
      const res = await fetch("http://localhost:8080/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valorApostado: parseFloat(valorApostado),
          selections: betSlip.map((s) => ({ outcomeId: s.outcomeId, odd: s.price })),
        }),
      });

      if (res.ok) {
        setMensagem("Aposta realizada!");
        setBetSlip([]);
        setValorApostado("");
        setBetSlipOpen(false);
        fetch("http://localhost:8080/usuario/saldo", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }).then((r) => r.json()).then((data) => setSaldo(data));
      } else {
        setMensagem("Saldo insuficiente.");
      }
    } catch {
      setMensagem("Erro de conexão.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* NAVBAR */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-2xl font-black tracking-tight">SAFE</span>
            <span className="text-white text-2xl font-black tracking-tight">BET</span>
            <span className="ml-2 text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Copa 2026</span>
          </div>

          <div className="flex items-center gap-3">
            {saldo !== null && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2">
                <span className="text-zinc-400 text-xs uppercase tracking-wider">Saldo</span>
                <span className="text-emerald-400 font-bold">R$ {Number(saldo).toFixed(2)}</span>
              </div>
            )}
            {sessionStorage.getItem("token") ? (
              <button
                onClick={() => navigate("/minhas-apostas")}
                className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
              >
                Minhas Apostas
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-200">Jogos Disponíveis</h2>
          <p className="text-zinc-500 text-sm mt-1">{games.length} partidas · Clique em uma odd para apostar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {games.map((game, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition-all"
            >
              {/* Times */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-white truncate max-w-[40%]">{game.home_team}</span>
                <span className="text-xs text-zinc-500 font-medium px-2">VS</span>
                <span className="text-sm font-semibold text-white truncate max-w-[40%] text-right">{game.away_team}</span>
              </div>

              {/* Odds médias */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "1", name: game.home_team, price: game.homeTeamPrice },
                  { label: "X", name: "Empate", price: game.drawPrice },
                  { label: "2", name: game.away_team, price: game.awayTeamPrice },
                ].map((item, k) => {
                  const outcome = game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find(
                    (o) => o.name === item.name || (item.label === "X" && o.name === "Draw")
                  );
                  const outcomeId = outcome?.id;
                  const selecionado = outcomeId && estaSelecionado(outcomeId);

                  return (
                    <button
                      key={k}
                      onClick={() => outcomeId && adicionarSelecao(
                        outcomeId,
                        item.name,
                        item.price,
                        `${game.home_team} x ${game.away_team}`
                      )}
                      className={`rounded-xl py-3 flex flex-col items-center transition-all border ${
                        selecionado
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : "bg-zinc-800 border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white"
                      }`}
                    >
                      <span className="text-xs text-zinc-400 mb-1 font-medium">{item.label}</span>
                      <span className="font-bold text-sm">
                        {item.price ? item.price.toFixed(2) : "–"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bookmakers */}
              {game.bookmakers?.length > 0 && (
                <details className="group">
                  <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400 select-none">
                    Ver por casa ({game.bookmakers.length})
                  </summary>
                  <div className="mt-3 space-y-2">
                    {game.bookmakers.map((bk, j) => (
                      <div key={j} className="bg-zinc-800/50 rounded-xl p-3">
                        <p className="text-xs text-zinc-400 font-medium mb-2">{bk.title}</p>
                        <div className="grid grid-cols-3 gap-1">
                          {bk.markets[0]?.outcomes.map((outcome, k) => (
                            <button
                              key={k}
                              onClick={() => adicionarSelecao(
                                outcome.id,
                                outcome.name,
                                outcome.price,
                                `${game.home_team} x ${game.away_team}`
                              )}
                              className={`rounded-lg py-2 text-center text-xs transition-all border ${
                                estaSelecionado(outcome.id)
                                  ? "bg-emerald-500 border-emerald-400 text-white font-bold"
                                  : "bg-zinc-800 border-zinc-700 hover:border-zinc-500 text-zinc-300"
                              }`}
                            >
                              <span className="block text-zinc-400 text-[10px]">{outcome.name}</span>
                              <span className="font-bold">{outcome.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* BET SLIP — canto inferior direito */}
      <div
        className={`fixed bottom-6 right-6 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/60 z-50 transition-all duration-300 ease-out ${
          betSlipOpen && betSlip.length > 0
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        {/* Header do betslip */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {betSlip.length}
            </span>
            <span className="text-sm font-semibold text-white">Boletim de Apostas</span>
          </div>
          <button
            onClick={() => { setBetSlip([]); setBetSlipOpen(false); setValorApostado(""); setMensagem(""); }}
            className="text-zinc-500 hover:text-zinc-300 text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Seleções */}
        <div className="max-h-52 overflow-y-auto px-4 py-3 space-y-2">
          {betSlip.map((s, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl p-3 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 truncate">{s.gameName}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{s.name}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-emerald-400 font-bold text-sm">{s.price}</span>
                <button
                  onClick={() => removerSelecao(s.outcomeId)}
                  className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                >
                  remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-800 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Odd total</span>
            <span className="text-white font-bold">{calcularOddTotal()}x</span>
          </div>

          <input
            type="number"
            value={valorApostado}
            onChange={(e) => setValorApostado(e.target.value)}
            placeholder="Valor (R$)"
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-sm outline-none transition-colors"
          />

          {valorApostado > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Retorno possível</span>
              <span className="text-emerald-400 font-bold">R$ {calcularRetorno()}</span>
            </div>
          )}

          <button
            onClick={fazerAposta}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
          >
            Confirmar Aposta
          </button>

          {mensagem && (
            <p className={`text-xs text-center ${mensagem.includes("realizada") ? "text-emerald-400" : "text-red-400"}`}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
