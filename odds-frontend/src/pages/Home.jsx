import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatarData(commenceTime) {
  if (!commenceTime) return null;
  const data = new Date(commenceTime);
  return data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Home() {
  const [games, setGames] = useState([]);
  const [betSlip, setBetSlip] = useState([]);
  const [valorApostado, setValorApostado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [saldo, setSaldo] = useState(null);
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
      setBetSlip(betSlip.filter((s) => s.outcomeId !== outcomeId));
    } else {
      setBetSlip([...betSlip, { outcomeId, name, price, gameName }]);
    }
    setMensagem("");
  }

  function removerSelecao(outcomeId) {
    const novo = betSlip.filter((s) => s.outcomeId !== outcomeId);
    setBetSlip(novo);
    if (novo.length === 0) {
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
    if (!token) { navigate("/login"); return; }
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
        setMensagem("Aposta realizada com sucesso!");
        setBetSlip([]);
        setValorApostado("");
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

  const token = sessionStorage.getItem("token");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* NAVBAR */}
      <header className="border-b border-zinc-800/60 bg-zinc-950 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-8">

          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center text-white font-black text-xs">
                S
              </div>
              <span className="text-white font-black text-base tracking-tight">SafeBet</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <span className="text-white text-sm font-medium cursor-pointer">Esportes</span>
              <span className="text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer transition-colors">Ao Vivo</span>
              <span className="text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer transition-colors">Destaques</span>
              <span className="text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer transition-colors">Promoções</span>
            </nav>
          </div>

          {/* Direita */}
          <div className="flex items-center gap-3 shrink-0">
            {saldo !== null && (
              <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                <span className="text-zinc-500 text-xs">Saldo</span>
                <span className="text-emerald-400 font-bold text-sm">R$ {Number(saldo).toFixed(2)}</span>
              </div>
            )}
            {token ? (
              <button
                onClick={() => navigate("/minhas-apostas")}
                className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
              >
                Minhas Apostas
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-zinc-300 hover:text-white text-sm font-medium transition-colors px-2"
                >
                  Entrar
                </button>
                <button
                  onClick={() => navigate("/cadastro")}
                  className="bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-lg px-4 py-1.5 text-sm transition-all flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex gap-5 items-start">

        {/* COLUNA ESQUERDA */}
        <div className="flex-1 min-w-0">

          {/* HERO */}
          <div className="relative rounded-2xl overflow-hidden mb-6 border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/25 via-transparent to-blue-900/15" />
            <div className="relative px-10 py-12">
              <div className="inline-flex items-center gap-2 bg-zinc-900/70 border border-zinc-700/60 rounded-full px-3 py-1.5 text-xs text-zinc-300 mb-7 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Mais de 48 jogos disponíveis — Copa 2026
              </div>
              <h1 className="text-4xl font-black text-white mb-4 leading-[1.1] tracking-tight">
                Aposte com inteligência<br />nas maiores ligas do mundo
              </h1>
              <p className="text-zinc-400 text-sm mb-8 max-w-lg leading-relaxed">
                Odds em tempo real, mercados completos e uma experiência clean para você focar no que importa: a sua estratégia.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
                <span className="flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Saques instantâneos via Pix
                </span>
                <span className="flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Plataforma segura e regulamentada
                </span>
                <span className="flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  As melhores odds do mercado
                </span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-2 mb-5">
            <button className="bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
              Todos
            </button>
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-full transition-colors">
              Futebol
            </button>
            <span className="ml-auto text-xs text-zinc-600">{games.length} partidas</span>
          </div>

          {/* JOGOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {games.map((game, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all"
              >
                {formatarData(game.commenceTime) && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span className="text-[11px] text-zinc-500">{formatarData(game.commenceTime)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-white truncate max-w-[40%]">{game.home_team}</span>
                  <span className="text-xs text-zinc-600 font-medium px-2">VS</span>
                  <span className="text-sm font-semibold text-white truncate max-w-[40%] text-right">{game.away_team}</span>
                </div>

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
                          outcomeId, item.name, item.price,
                          `${game.home_team} x ${game.away_team}`
                        )}
                        className={`rounded-xl py-3 flex flex-col items-center transition-all border ${
                          selecionado
                            ? "bg-emerald-500 border-emerald-400 text-white"
                            : "bg-zinc-800 border-zinc-700/50 hover:border-zinc-600 text-zinc-200 hover:text-white"
                        }`}
                      >
                        <span className={`text-[10px] mb-1 font-medium ${selecionado ? "text-emerald-100" : "text-zinc-500"}`}>
                          {item.label}
                        </span>
                        <span className="font-bold text-sm">
                          {item.price ? item.price.toFixed(2) : "–"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {game.bookmakers?.length > 0 && (
                  <details className="group">
                    <summary className="text-[11px] text-zinc-600 cursor-pointer hover:text-zinc-400 select-none transition-colors">
                      Ver por casa de apostas ({game.bookmakers.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {game.bookmakers.map((bk, j) => (
                        <div key={j} className="bg-zinc-800/50 rounded-xl p-3">
                          <p className="text-[11px] text-zinc-500 font-medium mb-2">{bk.title}</p>
                          <div className="grid grid-cols-3 gap-1">
                            {bk.markets[0]?.outcomes.map((outcome, k) => (
                              <button
                                key={k}
                                onClick={() => adicionarSelecao(
                                  outcome.id, outcome.name, outcome.price,
                                  `${game.home_team} x ${game.away_team}`
                                )}
                                className={`rounded-lg py-2 text-center text-xs transition-all border ${
                                  estaSelecionado(outcome.id)
                                    ? "bg-emerald-500 border-emerald-400 text-white font-bold"
                                    : "bg-zinc-800 border-zinc-700/50 hover:border-zinc-600 text-zinc-300"
                                }`}
                              >
                                <span className="block text-zinc-500 text-[10px]">{outcome.name}</span>
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
        </div>

        {/* SIDEBAR — MEU BILHETE */}
        <div className="w-72 shrink-0 sticky top-20">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span className="text-sm font-semibold text-white">Meu Bilhete</span>
              {betSlip.length > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {betSlip.length}
                </span>
              )}
            </div>

            {/* Vazio */}
            {betSlip.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <p className="text-zinc-300 font-semibold text-sm mb-1">Bilhete vazio</p>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  Selecione as odds nos jogos para montar sua aposta.
                </p>
              </div>
            )}

            {/* Com seleções */}
            {betSlip.length > 0 && (
              <>
                <div className="max-h-64 overflow-y-auto px-3 py-3 space-y-2">
                  {betSlip.map((s, i) => (
                    <div key={i} className="bg-zinc-800 rounded-xl p-3 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-500 truncate">{s.gameName}</p>
                        <p className="text-xs font-semibold text-white mt-0.5 truncate">{s.name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-emerald-400 font-bold text-xs">{s.price.toFixed(2)}</span>
                        <button
                          onClick={() => removerSelecao(s.outcomeId)}
                          className="text-zinc-600 hover:text-red-400 text-[10px] transition-colors"
                        >
                          remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-3 pb-4 space-y-3 border-t border-zinc-800 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Odd total</span>
                    <span className="text-white font-bold">{calcularOddTotal()}x</span>
                  </div>

                  <input
                    type="number"
                    value={valorApostado}
                    onChange={(e) => setValorApostado(e.target.value)}
                    placeholder="Valor (R$)"
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs outline-none transition-colors"
                  />

                  {valorApostado > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Retorno possível</span>
                      <span className="text-emerald-400 font-bold">R$ {calcularRetorno()}</span>
                    </div>
                  )}

                  <button
                    onClick={fazerAposta}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all text-xs"
                  >
                    Confirmar Aposta
                  </button>

                  <button
                    onClick={() => { setBetSlip([]); setValorApostado(""); setMensagem(""); }}
                    className="w-full text-zinc-600 hover:text-zinc-400 text-[11px] transition-colors text-center"
                  >
                    Limpar bilhete
                  </button>

                  {mensagem && (
                    <p className={`text-[11px] text-center ${mensagem.includes("sucesso") ? "text-emerald-400" : "text-red-400"}`}>
                      {mensagem}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
