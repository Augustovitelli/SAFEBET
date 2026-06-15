import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const [form, setForm] = useState({ userName: "", email: "", senha: "" });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-emerald-400 text-3xl font-black tracking-tight">SAFE</span>
          <span className="text-white text-3xl font-black tracking-tight">BET</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h1 className="text-xl font-bold text-white mb-6">Criar conta</h1>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-red-400 text-sm">{erro}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Nome de usuário</label>
              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 mt-1.5 outline-none transition-colors text-sm"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 mt-1.5 outline-none transition-colors text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Senha</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 mt-1.5 outline-none transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm mt-2"
            >
              Criar conta
            </button>

            <p className="text-zinc-500 text-sm text-center pt-2">
              Já tem conta?{" "}
              <span
                className="text-emerald-400 cursor-pointer hover:text-emerald-300 font-medium transition-colors"
                onClick={() => navigate("/login")}
              >
                Entrar
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
