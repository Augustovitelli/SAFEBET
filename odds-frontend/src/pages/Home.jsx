import { useEffect, useRef, useState } from "react";
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

/* Botão de odd com animação pop */
function OddBtn({ label, price, selected, onClick, disabled }) {
  const ref = useRef(null);

  function handleClick() {
    if (disabled || !onClick) return;
    ref.current?.classList.remove("odd-pop");
    void ref.current?.offsetWidth; // reflow para reiniciar animação
    ref.current?.classList.add("odd-pop");
    onClick();
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative rounded-xl py-3.5 flex flex-col items-center
        transition-all duration-150 border select-none
        ${selected
          ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_18px_rgba(16,185,129,0.40)] ring-1 ring-emerald-400/60"
          : disabled
            ? "bg-zinc-800/40 border-zinc-800 text-zinc-700 cursor-not-allowed"
            : "bg-zinc-800/80 border-zinc-700/60 hover:border-emerald-500/50 hover:bg-zinc-800 text-zinc-200 hover:text-white cursor-pointer"
        }
      `}
    >
      {selected && (
        <span className="absolute top-1.5 right-2 text-emerald-200 text-[8px]">✓</span>
      )}
      <span className={`text-[10px] mb-1 font-semibold uppercase tracking-wider ${selected ? "text-emerald-100" : "text-zinc-500"}`}>
        {label}
      </span>
      <span className="font-black text-sm">
        {price ? price.toFixed(2) : "–"}
      </span>
    </button>
  );
}

/* Card de seleção no bilhete */
function SlipCard({ selecao, onRemove }) {
  return (
    <div className="slip-in bg-zinc-800/60 border border-zinc-700/40 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between gap-2 p-3 border-l-2 border-l-emerald-500">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-500 truncate leading-tight">{selecao.gameName}</p>
          <p className="text-xs font-bold text-white mt-0.5 truncate">{selecao.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-emerald-400 font-black text-sm leading-none">{selecao.price.toFixed(2)}</span>
          <button
            onClick={onRemove}
            className="text-zinc-600 hover:text-red-400 text-[10px] transition-colors leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [games, setGames] = useState([]);
  const [betSlip, setBetSlip] = useState([]);
  const [valorApostado, setValorApostado] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [saldo, setSaldo] = useState(null);
  const [apostando, setApostando] = useState(false);
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
    setMensagem({ texto: "", tipo: "" });
    setBetSlip((prev) => {
      const existe = prev.find((s) => s.outcomeId === outcomeId);
      return existe ? prev.filter((s) => s.outcomeId !== outcomeId) : [...prev, { outcomeId, name, price, gameName }];
    });
  }

  function removerSelecao(outcomeId) {
    setBetSlip((prev) => {
      const novo = prev.filter((s) => s.outcomeId !== outcomeId);
      if (novo.length === 0) { setValorApostado(""); setMensagem({ texto: "", tipo: "" }); }
      return novo;
    });
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
    if (betSlip.length === 0) { setMensagem({ texto: "Adicione uma seleção.", tipo: "erro" }); return; }
    if (!valorApostado || parseFloat(valorApostado) <= 0) { setMensagem({ texto: "Digite um valor válido.", tipo: "erro" }); return; }

    setApostando(true);
    try {
      const res = await fetch("http://localhost:8080/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          valorApostado: parseFloat(valorApostado),
          selections: betSlip.map((s) => ({ outcomeId: s.outcomeId, odd: s.price })),
        }),
      });

      if (res.ok) {
        setMensagem({ texto: "Aposta confirmada!", tipo: "ok" });
        setBetSlip([]);
        setValorApostado("");
        fetch("http://localhost:8080/usuario/saldo", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }).then((r) => r.json()).then((data) => setSaldo(data));
      } else {
        setMensagem({ texto: "Saldo insuficiente.", tipo: "erro" });
      }
    } catch {
      setMensagem({ texto: "Erro de conexão.", tipo: "erro" });
    } finally {
      setApostando(false);
    }
  }

  const token = sessionStorage.getItem("token");
  const retorno = parseFloat(calcularRetorno());
  const oddTotal = parseFloat(calcularOddTotal());

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── NAVBAR ── */}
      <header className="border-b border-white/5 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center text-white font-black text-xs shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                S
              </div>
              <span className="text-white font-black text-base tracking-tight">SafeBet</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-white text-sm font-semibold cursor-pointer">Esportes</span>
              {["Ao Vivo", "Destaques", "Promoções"].map((l) => (
                <span key={l} className="text-zinc-500 hover:text-zinc-200 text-sm cursor-pointer transition-colors duration-150">{l}</span>
              ))}
            </nav>
          </div>

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
                <button onClick={() => navigate("/login")} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors px-2">
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

      {/* ── LAYOUT ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex gap-5 items-start">

        {/* ── ESQUERDA ── */}
        <div className="flex-1 min-w-0">

          {/* HERO */}
          <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.18),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.10),transparent_55%)]" />
            <div className="relative px-10 py-12">
              <div className="inline-flex items-center gap-2 bg-black/30 border border-white/10 rounded-full px-3 py-1.5 text-xs text-zinc-300 mb-7 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                {games.length} jogos disponíveis — Copa 2026
              </div>
              <h1 className="text-4xl font-black text-white mb-4 leading-[1.1] tracking-tight">
                Aposte com inteligência<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                  nas maiores ligas do mundo
                </span>
              </h1>
              <p className="text-zinc-400 text-sm mb-8 max-w-lg leading-relaxed">
                Odds em tempo real, mercados completos e uma experiência clean para você focar no que importa: a sua estratégia.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500">
                {[
                  { icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>, label: "Saques via Pix" },
                  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, label: "Plataforma segura" },
                  { icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>, label: "Melhores odds" },
                ].map(({ icon, label }) => (
                  <span key={label} className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">{icon}</svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-2 mb-5">
            <button className="bg-emerald-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-[0_0_14px_rgba(16,185,129,0.35)]">
              Todos
            </button>
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white text-sm px-5 py-2 rounded-full transition-colors">
              Futebol
            </button>
            <span className="ml-auto text-xs text-zinc-600 font-medium">{games.length} partidas</span>
          </div>

          {/* JOGOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {games.map((game, i) => (
              <div
                key={i}
                className="group bg-zinc-900 border border-white/5 hover:border-emerald-500/20 rounded-2xl p-5 transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]"
              >
                {/* Data */}
                {formatarData(game.commenceTime) && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span className="text-[10px] text-zinc-600">{formatarData(game.commenceTime)}</span>
                  </div>
                )}

                {/* Times */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-bold text-zinc-100 truncate max-w-[40%]">{game.home_team}</span>
                  <span className="text-[10px] text-zinc-600 font-black px-2 bg-zinc-800 rounded-md py-0.5 mx-1">VS</span>
                  <span className="text-sm font-bold text-zinc-100 truncate max-w-[40%] text-right">{game.away_team}</span>
                </div>

                {/* Odds principais */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Casa", name: game.home_team, price: game.homeTeamPrice },
                    { label: "Empate", name: "Empate", price: game.drawPrice },
                    { label: "Fora", name: game.away_team, price: game.awayTeamPrice },
                  ].map((item, k) => {
                    const outcome = game.bookmakers?.[0]?.markets?.[0]?.outcomes?.find(
                      (o) => o.name === item.name || (item.label === "Empate" && o.name === "Draw")
                    );
                    const outcomeId = outcome?.id;
                    return (
                      <OddBtn
                        key={k}
                        label={item.label}
                        price={item.price}
                        selected={!!outcomeId && estaSelecionado(outcomeId)}
                        disabled={!outcomeId}
                        onClick={() => outcomeId && adicionarSelecao(outcomeId, item.name, item.price, `${game.home_team} x ${game.away_team}`)}
                      />
                    );
                  })}
                </div>

                {/* Casas de apostas */}
                {game.bookmakers?.length > 0 && (
                  <details>
                    <summary className="text-[11px] text-zinc-600 cursor-pointer hover:text-zinc-400 select-none transition-colors">
                      Ver por casa ({game.bookmakers.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {game.bookmakers.map((bk, j) => (
                        <div key={j} className="bg-zinc-800/40 border border-white/5 rounded-xl p-3">
                          <p className="text-[11px] text-zinc-500 font-semibold mb-2">{bk.title}</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {bk.markets[0]?.outcomes.map((outcome, k) => (
                              <OddBtn
                                key={k}
                                label={outcome.name}
                                price={outcome.price}
                                selected={estaSelecionado(outcome.id)}
                                onClick={() => adicionarSelecao(outcome.id, outcome.name, outcome.price, `${game.home_team} x ${game.away_team}`)}
                              />
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

        {/* ── SIDEBAR BILHETE ── */}
        <div className="w-72 shrink-0 sticky top-20">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]">

            {/* Header do bilhete */}
            <div className="px-4 py-3.5 border-b border-white/5 bg-gradient-to-r from-zinc-900 to-zinc-800/60 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span className="text-sm font-bold text-white">Meu Bilhete</span>
              {betSlip.length > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                  {betSlip.length}
                </span>
              )}
            </div>

            {/* Vazio */}
            {betSlip.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
                <div className="w-12 h-12 bg-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <p className="text-zinc-300 font-bold text-sm mb-1.5">Bilhete vazio</p>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  Clique em uma odd para adicionar ao bilhete.
                </p>
              </div>
            )}

            {/* Com seleções */}
            {betSlip.length > 0 && (
              <>
                {/* Seleções */}
                <div className="max-h-60 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin">
                  {betSlip.map((s) => (
                    <SlipCard key={s.outcomeId} selecao={s} onRemove={() => removerSelecao(s.outcomeId)} />
                  ))}
                </div>

                {/* Resumo + ação */}
                <div className="px-3 pb-4 pt-3 border-t border-white/5 space-y-3">

                  {/* Odd total */}
                  <div className="flex items-center justify-between bg-zinc-800/60 border border-white/5 rounded-xl px-3 py-2.5">
                    <span className="text-xs text-zinc-400 font-medium">Odd total</span>
                    <span className="text-white font-black text-sm">{calcularOddTotal()}×</span>
                  </div>

                  {/* Input valor */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">R$</span>
                    <input
                      type="number"
                      value={valorApostado}
                      onChange={(e) => setValorApostado(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-zinc-800 border border-zinc-700/60 focus:border-emerald-500/70 focus:shadow-[0_0_12px_rgba(16,185,129,0.2)] text-white rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold outline-none transition-all placeholder:text-zinc-600 placeholder:font-normal"
                    />
                  </div>

                  {/* Retorno possível */}
                  {retorno > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-emerald-400/80 font-medium">Retorno possível</span>
                        <span className="text-emerald-400 font-black text-base">R$ {calcularRetorno()}</span>
                      </div>
                      {oddTotal > 1 && (
                        <div className="mt-1 flex items-center gap-1">
                          <div className="flex-1 h-0.5 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((oddTotal / 10) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-zinc-500">{oddTotal}×</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botão confirmar */}
                  <button
                    onClick={fazerAposta}
                    disabled={apostando}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white font-black py-3 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_28px_rgba(16,185,129,0.50)] active:scale-[0.98]"
                  >
                    {apostando ? "Confirmando..." : "Confirmar Aposta"}
                  </button>

                  {/* Limpar */}
                  <button
                    onClick={() => { setBetSlip([]); setValorApostado(""); setMensagem({ texto: "", tipo: "" }); }}
                    className="w-full text-zinc-600 hover:text-zinc-400 text-[11px] transition-colors text-center py-0.5"
                  >
                    Limpar bilhete
                  </button>

                  {/* Mensagem */}
                  {mensagem.texto && (
                    <div className={`rounded-xl px-3 py-2 text-xs text-center font-semibold ${
                      mensagem.tipo === "ok"
                        ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                        : "bg-red-500/15 border border-red-500/25 text-red-400"
                    }`}>
                      {mensagem.texto}
                    </div>
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
