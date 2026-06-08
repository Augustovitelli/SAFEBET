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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-yellow-400 text-center mb-6">Cadastro</h1>

        {erro && <p className="text-red-400 text-sm text-center mb-4">{erro}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Nome de usuário</label>
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Senha</label>
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Cadastrar
          </button>

          <p className="text-gray-400 text-sm text-center">
            Já tem conta?{" "}
            <span
              className="text-yellow-400 cursor-pointer hover:underline"
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