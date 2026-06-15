import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  OPEN:  { label: "Aberta",   color: "bg-blue-500/15 text-blue-400 border border-blue-500/25" },
  WON:   { label: "Ganha",    color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
  LOST:  { label: "Perdida",  color: "bg-red-500/15 text-red-400 border border-red-500/25" },
};

const RESULT_CONFIG = {
  OPEN:  { label: "Em aberto", color: "text-blue-400" },
  WON:   { label: "Ganha",     color: "text-emerald-400" },
  LOST:  { label: "Perdida",   color: "text-red-400" },
};

function MinhasBets() {
  const [bets, setBets] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch("http://localhost:8080/bet/minhas-apostas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => { setBets(data); setLoading(false); })
      .catch(() => { setErro("Erro ao carregar apostas."); setLoading(false); });
  }, [navigate]);

  const betsFiltradas = filtro === "TODAS" ? bets : bets.filter((b) => b.status === filtro);

  const tabs = [
    { key: "TODAS",  label: "Todas" },
    { key: "OPEN",   label: "Abertas" },
    { key: "WON",    label: "Ganhas" },
    { key: "LOST",   label: "Perdidas" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* NAVBAR */}
      <header className="border-b border-zinc-800/60 bg-zinc-950 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-8">

          <div className="flex items-center gap-5">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center text-white font-black text-xs">
                S
              </div>
              <span className="text-white font-black text-base tracking-tight">SafeBet</span>
            </button>

            <div className="w-px h-5 bg-zinc-800" />

            <nav className="hidden md:flex items-center gap-5">
              <span
                onClick={() => navigate("/")}
                className="text-zinc-500 hover:text-white text-sm cursor-pointer transition-colors"
              >
                Esportes
              </span>
              <span className="text-zinc-500 hover:text-white text-sm cursor-pointer transition-colors">Ao Vivo</span>
              <span className="text-zinc-500 hover:text-white text-sm cursor-pointer transition-colors">Destaques</span>
              <span className="text-zinc-500 hover:text-white text-sm cursor-pointer transition-colors">Promoções</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">Minhas Apostas</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-6 py-8 flex-1">

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-white tracking-tight">Minhas Apostas</h1>
          <p className="text-zinc-500 text-sm mt-1">{bets.length} apostas no total</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => {
            const count = tab.key === "TODAS" ? bets.length : bets.filter((b) => b.status === tab.key).length;
            const ativo = filtro === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFiltro(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  ativo
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-xs ${ativo ? "text-emerald-100" : "text-zinc-600"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Estados */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-zinc-500 text-sm">Carregando apostas...</p>
          </div>
        )}

        {erro && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-red-400 text-sm">{erro}</p>
          </div>
        )}

        {!loading && !erro && betsFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <p className="text-zinc-300 font-semibold text-sm mb-1">Nenhuma aposta encontrada</p>
            <p className="text-zinc-600 text-xs mb-5">
              {filtro === "TODAS" ? "Você ainda não fez nenhuma aposta." : `Sem apostas com status "${tabs.find(t => t.key === filtro)?.label}".`}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2 rounded-xl transition-all text-sm"
            >
              Fazer uma aposta
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-3">
          {betsFiltradas.map((bet) => {
            const statusInfo = STATUS_CONFIG[bet.status] ?? {
              label: bet.status,
              color: "bg-zinc-700/50 text-zinc-400 border border-zinc-700",
            };

            return (
              <div
                key={bet.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all"
              >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                  <span className="text-zinc-600 text-xs font-medium">Aposta #{bet.id}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Seleções */}
                <div className="px-5 py-3 space-y-2">
                  {bet.selections.map((sel, i) => {
                    const resultInfo = RESULT_CONFIG[sel.result] ?? { label: sel.result, color: "text-zinc-400" };
                    return (
                      <div key={i} className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-2.5">
                        <div className="min-w-0 flex-1">
                          {sel.gameName && (
                            <p className="text-[11px] text-zinc-600 truncate">{sel.gameName}</p>
                          )}
                          <p className="text-sm text-white font-medium mt-0.5">{sel.selection}</p>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <p className="text-emerald-400 font-bold text-sm">
                            {Number(sel.oddAtBetTime).toFixed(2)}
                          </p>
                          {sel.result && (
                            <p className={`text-xs font-semibold ${resultInfo.color}`}>{resultInfo.label}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumo financeiro */}
                <div className="px-5 py-3 border-t border-zinc-800 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[11px] text-zinc-600 mb-1">Apostado</p>
                    <p className="text-white font-semibold text-sm">
                      R$ {Number(bet.valorApostado).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-600 mb-1">Odd Total</p>
                    <p className="text-emerald-400 font-bold text-sm">
                      {Number(bet.oddTotal).toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-600 mb-1">Retorno Poss.</p>
                    <p className={`font-semibold text-sm ${bet.status === "WON" ? "text-emerald-400" : "text-zinc-300"}`}>
                      R$ {Number(bet.possibleReturn).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default MinhasBets;
