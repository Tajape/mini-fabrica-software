// Modal para criar/editar Projeto
// Recebe: isOpen, onClose, onSave, clientes, projetoParaEditar
// useEffect popula formData quando projetoParaEditar muda
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalProjeto({
  isOpen,
  onClose,
  onSave,
  clientes,
  projetoParaEditar,
}) {
  const [formData, setFormData] = useState({
    cliente_id: "",
    nome: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    valor_contrato: "",
    custo_hora_base: "",
    status: "planejado",
  });

  // Normaliza datas para o formato esperado pelo input type="date" (YYYY-MM-DD)
  const formatarDataParaInput = (data) => {
    if (!data) return "";
    return data.split("T")[0];
  };

  // Quando projetoParaEditar muda, popula o formulário com seus dados
  // Caso contrário, reseta o formulário para vazio
  useEffect(() => {
    if (projetoParaEditar) {
      setFormData({
        ...projetoParaEditar,
        data_inicio: formatarDataParaInput(projetoParaEditar.data_inicio),
        data_fim: formatarDataParaInput(projetoParaEditar.data_fim),
      });
    } else {
      setFormData({
        cliente_id: "",
        nome: "",
        descricao: "",
        data_inicio: "",
        data_fim: "",
        valor_contrato: "",
        custo_hora_base: "",
        status: "planejado",
      });
    }
  }, [projetoParaEditar, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Cabeçalho do modal com título e botão fechar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {projetoParaEditar ? "📝 Editar Projeto" : "🚀 Novo Projeto"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área com scroll para o formulário */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form
            id="project-form"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              // Chama onSave com os dados do formulário e fecha o modal
              onSave(formData);
              onClose();
            }}
          >
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Cliente Responsável *
              </label>
              <select
                required
                value={formData.cliente_id}
                onChange={(e) =>
                  setFormData({ ...formData, cliente_id: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"
              >
                <option value="">Selecione o dono do projeto...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Nome do Projeto *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                placeholder="Ex: E-commerce Vanguarda"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Descrição (Opcional)
              </label>
              <textarea
                rows="2"
                value={formData.descricao || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                placeholder="Detalhes do escopo..."
              />
            </div>

            {/* CAMPOS DE DATA */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Data Início *
              </label>
              <input
                type="date"
                required
                value={formData.data_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, data_inicio: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Data Fim (Opcional)
              </label>
              <input
                type="date"
                value={formData.data_fim || ""}
                onChange={(e) =>
                  setFormData({ ...formData, data_fim: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Valor Contrato (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.valor_contrato}
                onChange={(e) =>
                  setFormData({ ...formData, valor_contrato: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="15000.00"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Custo/Hora Base *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.custo_hora_base}
                onChange={(e) =>
                  setFormData({ ...formData, custo_hora_base: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="45.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
                Status do Projeto
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="planejado">🗓️ Planejado</option>
                <option value="em_andamento">🚀 Em Andamento</option>
                <option value="pausado">⏸️ Pausado</option>
                <option value="finalizado">✅ Finalizado</option>
              </select>
            </div>
          </form>
        </div>

        {/* Rodapé do modal com botões Cancelar e Salvar */}
        <div className="p-6 border-t border-slate-800 flex gap-4 shrink-0 bg-[#1e293b]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="project-form"
            className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
          >
            Salvar Projeto
          </button>
        </div>
      </div>
    </div>
  );
}
