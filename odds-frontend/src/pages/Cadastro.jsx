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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* NAVBAR */}
      <header className="border-b border-zinc-800/60 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center text-white font-black text-xs">
              S
            </div>
            <span className="text-white font-black text-base tracking-tight">SafeBet</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-sm">Já tem conta?</span>
            <button
              onClick={() => navigate("/login")}
              className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Criar sua conta</h1>
            <p className="text-zinc-500 text-sm mt-2">Cadastre-se grátis e comece a apostar agora</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-2xl shadow-black/40">

            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-red-400 text-sm">{erro}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Nome de usuário</label>
                <input
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 mt-1.5 outline-none transition-colors text-sm placeholder:text-zinc-600"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 mt-1.5 outline-none transition-colors text-sm placeholder:text-zinc-600"
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
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 mt-1.5 outline-none transition-colors text-sm placeholder:text-zinc-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm mt-2"
              >
                Criar conta
              </button>
            </form>
          </div>

          <p className="text-zinc-600 text-sm text-center mt-6">
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
  );
}

export default Cadastro;
