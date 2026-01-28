import { useState, useEffect } from 'react';
import { Plus, Briefcase, Calendar, DollarSign, User, Edit2, Trash2, X, Search } from 'lucide-react';
import api from '../services/api';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState(null);
  const [busca, setBusca] = useState('');
  
  const [formData, setFormData] = useState({
    cliente_id: '', 
    nome: '', 
    data_inicio: '', 
    valor_contrato: '', 
    custo_hora_base: '', 
    status: 'EM_ANDAMENTO'
  });

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const [resProjetos, resClientes] = await Promise.all([
        api.get('/projetos'),
        api.get('/clientes')
      ]);
      setProjetos(resProjetos.data);
      setClientes(resClientes.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  };

  // --- FILTRO DE PESQUISA ---
  const projetosFiltrados = projetos.filter(proj => 
    proj.nome.toLowerCase().includes(busca.toLowerCase()) ||
    proj.cliente?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirEdicao = (proj) => {
    setProjetoParaEditar(proj);
    
    // Ajuste de data para o input HTML (YYYY-MM-DD)
    const dataFormatada = proj.data_inicio ? proj.data_inicio.split('T')[0] : '';

    setFormData({
      cliente_id: proj.cliente_id,
      nome: proj.nome,
      data_inicio: dataFormatada,
      valor_contrato: proj.valor_contrato,
      custo_hora_base: proj.custo_hora_base,
      status: proj.status
    });
    setIsModalOpen(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    // Sanitização dos dados para evitar Erro 500 no Backend
    const dadosParaEnviar = {
      ...formData,
      valor_contrato: parseFloat(formData.valor_contrato),
      custo_hora_base: parseFloat(formData.custo_hora_base),
      cliente_id: parseInt(formData.cliente_id)
    };

    try {
      if (projetoParaEditar) {
        await api.put(`/projetos/${projetoParaEditar.id}`, dadosParaEnviar);
      } else {
        await api.post('/projetos', dadosParaEnviar);
      }
      
      setIsModalOpen(false);
      setProjetoParaEditar(null);
      fetchDados();
    } catch (err) {
      console.error("Erro detalhado do servidor:", err.response?.data);
      alert(err.response?.data?.error || "Erro ao salvar projeto. Verifique o console do backend.");
    }
  };

  const deletarProjeto = async (id) => {
    if (window.confirm("Deseja realmente excluir este projeto?")) {
      try {
        await api.delete(`/projetos/${id}`);
        setProjetos(projetos.filter(p => p.id !== id));
      } catch (err) {
        alert("Erro ao excluir. O projeto pode ter lançamentos vinculados.");
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
          <p className="text-slate-400 mt-1">Gerenciamento de contratos e performance.</p>
        </div>
        <button 
          onClick={() => { 
            setProjetoParaEditar(null); 
            setFormData({cliente_id: '', nome: '', data_inicio: '', valor_contrato: '', custo_hora_base: '', status: 'EM_ANDAMENTO'}); 
            setIsModalOpen(true); 
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> Novo Projeto
        </button>
      </header>

      {/* SEARCH BAR */}
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

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetosFiltrados.map(proj => (
          <div key={proj.id} className="bg-[#1e293b] border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-indigo-500/50 transition-all group relative">
            
            {/* ACTIONS */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => abrirEdicao(proj)} className="p-2 bg-slate-700 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">
                <Edit2 size={14} />
              </button>
              <button onClick={() => deletarProjeto(proj.id)} className="p-2 bg-slate-700 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                {proj.status?.replace('_', ' ')}
              </span>
              <span className="text-slate-500 text-xs font-mono">ID: {proj.id}</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{proj.nome}</h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
              <User size={14} className="text-indigo-400" />
              {proj.cliente?.nome || 'Cliente Indefinido'}
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={14}/> Início:</span>
                <span className="text-slate-300 font-bold">
                  {proj.data_inicio ? new Date(proj.data_inicio).toLocaleDateString('pt-BR') : '--/--/----'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><DollarSign size={14}/> Contrato:</span>
                <span className="text-emerald-400 font-bold">
                  R$ {Number(proj.valor_contrato || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {projetosFiltrados.length === 0 && (
        <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-slate-800 mt-6">
          <p className="text-slate-500 font-medium">Nenhum projeto encontrado para sua busca.</p>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSalvar} className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
               <h2 className="text-xl font-bold text-white">{projetoParaEditar ? 'Editar Projeto' : 'Novo Projeto'}</h2>
               <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X /></button>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Cliente</label>
              <select 
                required
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.cliente_id}
                onChange={e => setFormData({...formData, cliente_id: e.target.value})}
              >
                <option value="">Selecione o Cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Nome do Projeto</label>
              <input type="text" placeholder="Ex: App Delivery" required value={formData.nome}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Data de Início</label>
              <input type="date" required value={formData.data_inicio}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, data_inicio: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Valor Contrato (R$)</label>
                <input type="number" step="0.01" placeholder="0.00" required value={formData.valor_contrato}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={e => setFormData({...formData, valor_contrato: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Custo/Hora (R$)</label>
                <input type="number" step="0.01" placeholder="0.00" required value={formData.custo_hora_base}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={e => setFormData({...formData, custo_hora_base: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Status</label>
              <select 
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="PAUSADO">Pausado</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-indigo-600 py-4 mt-2 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
              {projetoParaEditar ? 'Salvar Alterações' : 'Criar Projeto'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}