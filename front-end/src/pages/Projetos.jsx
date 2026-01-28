import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Search,
  Edit2,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import ModalProjeto from "../components/ModalProjeto";
import { formatarDataBR } from "../utils/dateUtils";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const [resProjetos, resClientes] = await Promise.all([
        api.get("/projetos"),
        api.get("/clientes"),
      ]);
      setProjetos(resProjetos.data);
      setClientes(resClientes.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  };

  const projetosFiltrados = projetos.filter(
    (proj) =>
      proj.nome.toLowerCase().includes(busca.toLowerCase()) ||
      proj.cliente?.nome?.toLowerCase().includes(busca.toLowerCase()),
  );

  const handleSalvar = async (dados) => {
    try {
      const payload = {
        ...dados,
        valor_contrato: parseFloat(dados.valor_contrato),
        custo_hora_base: parseFloat(dados.custo_hora_base),
        cliente_id: parseInt(dados.cliente_id),
      };

      if (projetoParaEditar) {
        await api.put(`/projetos/${projetoParaEditar.id}`, payload);
      } else {
        await api.post("/projetos", payload);
      }

      fetchDados();
      setIsModalOpen(false);
      setProjetoParaEditar(null);
    } catch (err) {
      console.error("Erro ao salvar:", err.response?.data);
      alert(err.response?.data?.error || "Erro ao salvar projeto.");
    }
  };

  const deletarProjeto = async (id) => {
    if (window.confirm("Deseja realmente excluir este projeto?")) {
      try {
        await api.delete(`/projetos/${id}`);
        setProjetos(projetos.filter((p) => p.id !== id));
      } catch (err) {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="text-indigo-500" /> Projetos
          </h1>
          <p className="text-slate-400 mt-1">
            Gerenciamento de contratos e performance.
          </p>
        </div>
        <button
          onClick={() => {
            setProjetoParaEditar(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> Novo Projeto
        </button>
      </header>

      {/* BARRA DE PESQUISA */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-slate-500" size={18} />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por projeto ou cliente..."
          className="w-full bg-[#1e293b] border border-slate-800 text-white rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xl"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetosFiltrados.map((proj) => (
          <div
            key={proj.id}
            className="bg-[#1e293b] border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-indigo-500/50 transition-all group relative"
          >
            {/* ÍCONES DE AÇÃO (Lápis e Lixeira) */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setProjetoParaEditar(proj);
                  setIsModalOpen(true);
                }}
                className="p-2 bg-slate-700 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => deletarProjeto(proj.id)}
                className="p-2 bg-slate-700 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                {proj.status?.replace("_", " ")}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{proj.nome}</h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
              <User size={14} className="text-indigo-400" />
              {proj.cliente?.nome || "Cliente Indefinido"}
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar size={14} className="text-white" /> Início:
                </span>
                <span className="text-slate-300 font-bold">
                  {formatarDataBR(proj.data_inicio)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar size={14} className="text-white" /> Término:
                </span>
                <span className="text-slate-300 font-bold">
                  {formatarDataBR(proj.data_fim) === "--/--/----"
                    ? "Não definida"
                    : formatarDataBR(proj.data_fim)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <DollarSign size={14} /> Contrato:
                </span>
                <span className="text-emerald-400 font-bold">
                  R${" "}
                  {Number(proj.valor_contrato || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalProjeto
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        clientes={clientes}
        projetoParaEditar={projetoParaEditar}
      />
    </div>
  );
}
