import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalLancamento({
  isOpen,
  onClose,
  onSave,
  projetos,
  lancamentoParaEditar,
}) {
  // Função para pegar a data local no formato YYYY-MM-DD
  const obterDataLocal = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const [formData, setFormData] = useState({
    projeto_id: "",
    colaborador: "",
    data: obterDataLocal(),
    horas: "",
    tipo: "evolutiva",
    descricao: "",
  });

  useEffect(() => {
    if (lancamentoParaEditar) setFormData(lancamentoParaEditar);
    else
      setFormData({
        projeto_id: "",
        colaborador: "",
        data: obterDataLocal(),
        horas: "",
        tipo: "evolutiva",
        descricao: "",
      });
  }, [lancamentoParaEditar, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">🚀 Lançar Horas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="p-6 overflow-y-auto space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...formData, id: formData.id || Date.now() });
            onClose();
          }}
        >
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
              Projeto *
            </label>
            <select
              required
              value={formData.projeto_id}
              onChange={(e) =>
                setFormData({ ...formData, projeto_id: e.target.value })
              }
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Selecione o projeto...</option>
              {projetos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
              Colaborador *
            </label>
            <input
              type="text"
              required
              value={formData.colaborador}
              onChange={(e) =>
                setFormData({ ...formData, colaborador: e.target.value })
              }
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 outline-none"
              placeholder="Nome do dev"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                Horas (ex: 1.5) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.horas}
                onChange={(e) =>
                  setFormData({ ...formData, horas: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 outline-none"
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
              Tipo de Demanda *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 outline-none"
            >
              <option value="corretiva">🛠️ Corretiva</option>
              <option value="evolutiva">🚀 Evolutiva</option>
              <option value="implantacao">📦 Implantação</option>
              <option value="legislativa">⚖️ Legislativa</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
              Descrição (Opcional)
            </label>
            <textarea
              rows="2"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 outline-none resize-none"
              placeholder="O que foi feito?"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
