import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, User, Search, Edit2, X, Calendar, Filter } from 'lucide-react';
import api from '../services/api';
import { formatarDataBR } from '../utils/dateUtils';

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lancamentoParaEditar, setLancamentoParaEditar] = useState(null);
  
  // Estados de Busca e Filtro
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({ projeto_id: '', data_inicio: '', data_fim: '' });

  const [formData, setFormData] = useState({ 
    projeto_id: '', colaborador: '', data: '', horas: '', tipo: 'evolutiva', descricao: '' 
  });

  // Carrega dados sempre que os filtros de data/projeto mudarem no banco
  useEffect(() => { 
    fetchDados(); 
  }, [filtros]);

  const fetchDados = async () => {
    try {
      const [resLanc, resProj] = await Promise.all([
        api.get('/lancamentos', { params: filtros }),
        api.get('/projetos')
      ]);
      setLancamentos(resLanc.data);
      setProjetos(resProj.data);
    } catch (err) { 
      console.error("Erro ao buscar dados:", err); 
    }
  };

  // Filtro de busca local (por texto) igual ao de Clientes
  const lancamentosFiltrados = lancamentos.filter(l => 
    l.colaborador.toLowerCase().includes(busca.toLowerCase()) || 
    (l.descricao && l.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  const abrirEdicao = (l) => {
    setLancamentoParaEditar(l);
    setFormData({
      projeto_id: l.projeto_id,
      colaborador: l.colaborador,
      data: l.data,
      horas: l.horas,
      tipo: l.tipo,
      descricao: l.descricao || ''
    });
    setIsModalOpen(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (formData.horas <= 0) return alert("As horas devem ser maiores que zero!");
    
    try {
      if (lancamentoParaEditar) {
        await api.put(`/lancamentos/${lancamentoParaEditar.id}`, formData);
      } else {
        await api.post('/lancamentos', formData);
      }
      fecharModal();
      fetchDados();
    } catch (err) { 
      alert("Erro ao salvar lançamento. Verifique os campos."); 
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setLancamentoParaEditar(null);
    setFormData({ projeto_id: '', colaborador: '', data: '', horas: '', tipo: 'evolutiva', descricao: '' });
  };

  const deletarLancamento = async (id) => {
    if (window.confirm("Deseja realmente excluir este lançamento?")) {
      try {
        await api.delete(`/lancamentos/${id}`);
        fetchDados();
      } catch (err) {
        alert("Erro ao excluir lançamento.");
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="text-indigo-500" /> Lançamentos
          </h1>
          <p className="text-slate-400 mt-1">Gestão de horas e produtividade.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus size={20} /> Novo Lançamento
        </button>
      </header>

      {/* ÁREA DE BUSCA E FILTROS */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="Buscar por colaborador ou descrição..."
            className="w-full bg-[#1e293b] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#1e293b]/50 p-4 rounded-2xl border border-slate-800/50">
          <select 
            className="bg-[#0f172a] border border-slate-700 text-slate-300 rounded-xl px-3 py-2 outline-none"
            value={filtros.projeto_id}
            onChange={e => setFiltros({...filtros, projeto_id: e.target.value})}
          >
            <option value="">Todos os Projetos</option>
            {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <input type="date" className="bg-[#0f172a] border border-slate-700 text-slate-300 rounded-xl px-3 py-2"
            onChange={e => setFiltros({...filtros, data_inicio: e.target.value})} />
          <input type="date" className="bg-[#0f172a] border border-slate-700 text-slate-300 rounded-xl px-3 py-2"
            onChange={e => setFiltros({...filtros, data_fim: e.target.value})} />
        </div>
      </div>

      {/* TABELA DE LANÇAMENTOS */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Data / Colaborador</th>
              <th className="px-6 py-4">Projeto / Cliente</th>
              <th className="px-6 py-4">Horas / Tipo</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {lancamentosFiltrados.map(l => (
              <tr key={l.id} className="text-slate-300 hover:bg-slate-800/30 transition-all group">
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{formatarDataBR(l.data)}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <User size={10}/> {l.colaborador}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-200">{l.projeto?.nome}</div>
                  <div className="text-[10px] text-indigo-400 uppercase font-mono">{l.projeto?.cliente?.nome}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-indigo-400 font-black">{l.horas}h</div>
                  <div className="text-[9px] uppercase text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded inline-block">
                    {l.tipo}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm italic text-slate-500 max-w-xs truncate">
                  {l.descricao || '---'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => abrirEdicao(l)} 
                      className="text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      <Edit2 size={16}/>
                    </button>
                    <button 
                      onClick={() => deletarLancamento(l.id)} 
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lancamentosFiltrados.length === 0 && (
          <div className="p-10 text-center text-slate-500 italic">Nenhum lançamento encontrado.</div>
        )}
      </div>

      {/* MODAL EDITAR / NOVO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSalvar} className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
               <h2 className="text-xl font-bold text-white">{lancamentoParaEditar ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
               <button type="button" onClick={fecharModal} className="text-slate-500 hover:text-white"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Projeto</label>
                <select required className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" value={formData.projeto_id} onChange={e => setFormData({...formData, projeto_id: e.target.value})}>
                  <option value="">Selecione o Projeto</option>
                  {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Colaborador</label>
                <input type="text" placeholder="Nome do Colaborador" required className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-white" value={formData.colaborador} onChange={e => setFormData({...formData, colaborador: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Data</label>
                  <input type="date" required className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-white text-sm" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Horas</label>
                  <input type="number" step="0.5" placeholder="0.0" required className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-white" value={formData.horas} onChange={e => setFormData({...formData, horas: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Tipo de Serviço</label>
                <select className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-white" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option value="corretiva">Corretiva (Nova funcionalidade)</option>
                  <option value="evolutiva">Evolutiva (Correção de bugs)</option>
                  <option value="implantacao">Implantação (Setup/Publicação)</option>
                  <option value="legislativa">Legislativa (Adequação a lei/ Impostos)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Descrição</label>
                <textarea placeholder="O que foi desenvolvido?" className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-4 text-white min-h-[100px]" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 py-4 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all mt-2">
              {lancamentoParaEditar ? 'Atualizar Lançamento' : 'Salvar Lançamento'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}