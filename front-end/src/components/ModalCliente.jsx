import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalCliente({ isOpen, onClose, onSave, clienteParaEditar }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    ativo: true
  });

  useEffect(() => {
    if (clienteParaEditar) setFormData(clienteParaEditar);
    else setFormData({ nome: '', email: '', telefone: '', ativo: true });
  }, [clienteParaEditar, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave({...formData, id: formData.id || Date.now()}); onClose(); }}>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Nome Completo *</label>
            <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Ex: João Silva" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">E-mail *</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="joao@empresa.com" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Telefone (Opcional)</label>
            <input type="text" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="(11) 99999-9999" />
          </div>

          {/* CAMPO ATIVO */}
          <div className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-xl border border-slate-800">
            <input 
              type="checkbox" 
              id="ativo"
              checked={formData.ativo} 
              onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
              className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="ativo" className="text-sm font-medium text-slate-300 cursor-pointer">
              Cliente Ativo
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}