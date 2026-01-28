import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Edit2, Trash2, Users } from 'lucide-react';
import api from '../services/api'; // Certifique-se de criar este arquivo
import ModalCliente from '../components/ModalCliente';

export default function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);
  const [busca, setBusca] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR CLIENTES DO BANCO
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        // Usa a rota GET /api/clientes do seu Laravel
        const response = await api.get('/clientes', {
          params: { search: busca } // Passa a busca para o seu Controller
        });
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [busca]); // Recarrega sempre que o usuário digitar na busca

  // 2. SALVAR OU ATUALIZAR
  const salvarCliente = async (dados) => {
    try {
      if (clienteParaEditar) {
        // Rota PUT /api/clientes/{id}
        const response = await api.put(`/clientes/${clienteParaEditar.id}`, dados);
        setClientes(clientes.map(c => c.id === clienteParaEditar.id ? response.data : c));
      } else {
        // Rota POST /api/clientes
        const response = await api.post('/clientes', dados);
        setClientes([...clientes, response.data]);
      }
      setIsModalOpen(false);
      setClienteParaEditar(null);
    } catch (error) {
      // Captura o erro de e-mail único do Laravel
      const msg = error.response?.data?.message || "Erro ao salvar cliente";
      alert(msg);
    }
  };

  // 3. EXCLUIR CLIENTE
  const deletarCliente = async (id) => {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes(clientes.filter(c => c.id !== id));
      } catch (error) {
        alert("Erro ao excluir cliente.");
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-indigo-500" /> Clientes
          </h1>
          <p className="text-slate-400 mt-1">Dados vindos direto do banco de dados.</p>
        </div>
        <button 
          onClick={() => { setClienteParaEditar(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </header>

      {/* Barra de Pesquisa */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-[#1e293b] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
        />
      </div>

      {/* Listagem */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-black">Cliente</th>
              <th className="px-6 py-4 font-black">Contato</th>
              <th className="px-6 py-4 font-black">Status</th>
              <th className="px-6 py-4 font-black text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-slate-500">Carregando...</td></tr>
            ) : clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-100">{cliente.nome}</div>
                  <div className="text-[10px] text-slate-500 font-mono">ID: {cliente.id}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-300"><Mail size={14} className="text-slate-500"/> {cliente.email}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300"><Phone size={14} className="text-slate-500"/> {cliente.telefone || '---'}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    cliente.ativo 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {cliente.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setClienteParaEditar(cliente); setIsModalOpen(true); }}
                      className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deletarCliente(cliente.id)}
                      className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCliente 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={salvarCliente}
        clienteParaEditar={clienteParaEditar}
      />
    </div>
  );
}