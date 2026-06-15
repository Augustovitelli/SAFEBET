import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_LABEL = {
  OPEN: { label: "Aberta", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
  WON: { label: "Ganha", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
  LOST: { label: "Perdida", color: "bg-red-500/20 text-red-400 border border-red-500/30" },
};

const RESULT_LABEL = {
  OPEN: { label: "Em aberto", color: "text-blue-400" },
  WON: { label: "Ganha", color: "text-emerald-400" },
  LOST: { label: "Perdida", color: "text-red-400" },
};

function MinhasBets() {
  const [bets, setBets] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:8080/bet/minhas-apostas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setBets(data);
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao carregar apostas.");
        setLoading(false);
      });
  }, [navigate]);

  const betsFiltradas =
    filtro === "TODAS" ? bets : bets.filter((b) => b.status === filtro);

  const tabs = [
    { key: "TODAS", label: "Todas" },
    { key: "OPEN", label: "Abertas" },
    { key: "WON", label: "Ganhas" },
    { key: "LOST", label: "Perdidas" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* NAVBAR */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
            >
              ← Voltar
            </button>
            <div className="w-px h-5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-2xl font-black tracking-tight">SAFE</span>
              <span className="text-white text-2xl font-black tracking-tight">BET</span>
            </div>
          </div>
          <h1 className="text-sm font-semibold text-zinc-300">Minhas Apostas</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Tabs de filtro */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => {
            const count =
              tab.key === "TODAS"
                ? bets.length
                : bets.filter((b) => b.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setFiltro(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  filtro === tab.key
                    ? "bg-emerald-500 border-emerald-400 text-white"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-xs ${filtro === tab.key ? "text-emerald-100" : "text-zinc-600"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Estados */}
        {loading && (
          <p className="text-zinc-500 text-center py-16">Carregando apostas...</p>
        )}

        {erro && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm text-center">{erro}</p>
          </div>
        )}

        {!loading && !erro && betsFiltradas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg mb-4">Nenhuma aposta encontrada.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
            >
              Fazer uma aposta
            </button>
          </div>
        )}

        {/* Cards de apostas */}
        <div className="space-y-4">
          {betsFiltradas.map((bet) => {
            const statusInfo = STATUS_LABEL[bet.status] ?? {
              label: bet.status,
              color: "bg-zinc-700 text-zinc-300 border border-zinc-600",
            };

            return (
              <div
                key={bet.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all"
              >
                {/* Cabeçalho do card */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                  <span className="text-zinc-500 text-xs font-medium">Aposta #{bet.id}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Seleções */}
                <div className="px-5 py-3 space-y-2">
                  {bet.selections.map((sel, i) => {
                    const resultInfo = RESULT_LABEL[sel.result] ?? {
                      label: sel.result,
                      color: "text-zinc-400",
                    };
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          {sel.gameName && (
                            <p className="text-[11px] text-zinc-500 truncate">{sel.gameName}</p>
                          )}
                          <p className="text-sm text-white font-medium mt-0.5">{sel.selection}</p>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <p className="text-emerald-400 font-bold text-sm">
                            {Number(sel.oddAtBetTime).toFixed(2)}
                          </p>
                          {sel.result && (
                            <p className={`text-xs font-semibold ${resultInfo.color}`}>
                              {resultInfo.label}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumo financeiro */}
                <div className="px-5 py-3 border-t border-zinc-800 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Apostado</p>
                    <p className="text-white font-semibold text-sm">
                      R$ {Number(bet.valorApostado).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Odd Total</p>
                    <p className="text-emerald-400 font-bold text-sm">
                      {Number(bet.oddTotal).toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Retorno Poss.</p>
                    <p
                      className={`font-semibold text-sm ${
                        bet.status === "WON" ? "text-emerald-400" : "text-zinc-300"
                      }`}
                    >
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
