import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_LABEL = {
  OPEN: { label: "Aberta", color: "bg-blue-500 text-white" },
  WON: { label: "Ganha", color: "bg-green-500 text-white" },
  LOST: { label: "Perdida", color: "bg-red-500 text-white" },
};

const RESULT_LABEL = {
  OPEN: { label: "Aberta", color: "text-blue-400" },
  WON: { label: "Ganha", color: "text-green-400" },
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
        if (!res.ok) throw new Error("Erro ao carregar apostas");
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm transition"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Minhas Apostas</h1>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        {/* Tabs de filtro */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFiltro(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filtro === tab.key
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.label}
              {tab.key !== "TODAS" && (
                <span className="ml-2 text-xs opacity-70">
                  ({bets.filter((b) => b.status === tab.key).length})
                </span>
              )}
              {tab.key === "TODAS" && (
                <span className="ml-2 text-xs opacity-70">({bets.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {loading && (
          <p className="text-gray-400 text-center py-12">Carregando apostas...</p>
        )}

        {erro && (
          <p className="text-red-400 text-center py-12">{erro}</p>
        )}

        {!loading && !erro && betsFiltradas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhuma aposta encontrada.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Fazer uma aposta
            </button>
          </div>
        )}

        <div className="space-y-4">
          {betsFiltradas.map((bet) => {
            const statusInfo = STATUS_LABEL[bet.status] ?? {
              label: bet.status,
              color: "bg-gray-500 text-white",
            };

            return (
              <div
                key={bet.id}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                {/* Cabeçalho do card */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Aposta #{bet.id}</span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Seleções */}
                <div className="px-5 py-3 space-y-2">
                  {bet.selections.map((sel, i) => {
                    const resultInfo = RESULT_LABEL[sel.result] ?? {
                      label: sel.result,
                      color: "text-gray-400",
                    };
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2"
                      >
                        <div>
                          {sel.gameName && (
                            <p className="text-xs text-gray-500">{sel.gameName}</p>
                          )}
                          <p className="text-sm text-white font-medium">{sel.selection}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold text-sm">
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
                <div className="px-5 py-3 bg-gray-750 border-t border-gray-700 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Apostado</p>
                    <p className="text-white font-semibold text-sm">
                      R$ {Number(bet.valorApostado).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Odd Total</p>
                    <p className="text-yellow-400 font-bold text-sm">
                      {Number(bet.oddTotal).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Retorno Poss.</p>
                    <p
                      className={`font-semibold text-sm ${
                        bet.status === "WON" ? "text-green-400" : "text-gray-300"
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
      </div>
    </div>
  );
}

export default MinhasBets;
