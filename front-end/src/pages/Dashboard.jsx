import { useState, useEffect } from 'react';
import { 
  TrendingUp, Download, Filter, FileText, 
  DollarSign, AlertTriangle, Clock, CheckCircle2,
  Calendar 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { formatarDataBR } from '../utils/dateUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CORES_DEMANDA = {
  'legislativa': '#818cf8',
  'implantação': '#10b981',
  'evolutiva': '#f59e0b',
  'corretiva': '#ef4444',
  'outros': '#64748b'
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [filtros, setFiltros] = useState({ 
    projeto_id: '', 
    data_inicio: '', 
    data_fim: '' 
  });

  useEffect(() => {
    api.get('/projetos').then(res => {
      setProjetos(res.data);
      if (res.data.length > 0) setFiltros(f => ({ ...f, projeto_id: res.data[0].id }));
    });
  }, []);

  useEffect(() => {
    if (filtros.projeto_id) {
      // Enviamos as datas exatamente como estão no estado (strings YYYY-MM-DD)
      api.get('/dashboard', { params: filtros }).then(res => setData(res.data));
    }
  }, [filtros]);

  // FUNÇÃO MILAGROSA: Converte string do banco para exibição sem perder 1 dia
  const exibirDataBR = (dataString) => {
    return formatarDataBR(dataString);
  };

  const exportarCSV = () => {
    if (!data) return;
    const { projeto, resumo_tipos } = data;
    const dataGeracao = new Date().toLocaleString('pt-BR');
    let csv = "\uFEFF"; 
    csv += `RELATÓRIO EXECUTIVO\nPROJETO:;${projeto.nome.toUpperCase()}\n`;
    csv += `RESUMO FINANCEIRO\nFaturamento;R$ ${projeto.receita}\nCusto;R$ ${projeto.custo_total}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Executivo_${projeto.nome}.csv`;
    link.click();
  };

  const exportarPDF = () => {
    if (!data) return;
    const { projeto, resumo_tipos } = data;
    const doc = new jsPDF();
    doc.text("MINI FABRICA DE SOFTWARE", 15, 25);
    autoTable(doc, {
      startY: 40,
      head: [['KPI', 'VALOR']],
      body: [
        ['FATURAMENTO', `R$ ${projeto.receita.toLocaleString('pt-BR')}`],
        ['CUSTO OPERACIONAL', `R$ ${projeto.custo_total.toLocaleString('pt-BR')}`],
        ['MARGEM (%)', `${projeto.margem_porc.toFixed(2)}%`],
      ],
    });
    doc.save(`Analise_${projeto.nome}.pdf`);
  };

  const getStatusMargem = (porcentagem) => {
    if (porcentagem > 40) return { label: "Excelente", color: "text-emerald-400", icon: <CheckCircle2 size={16}/> };
    if (porcentagem > 20) return { label: "Saudável", color: "text-indigo-400", icon: <CheckCircle2 size={16}/> };
    return { label: "Crítica", color: "text-red-400", icon: <AlertTriangle size={16}/> };
  };

  if (!data) return <div className="p-8 text-white text-center">Sincronizando...</div>;

  const dadosGrafico = data.resumo_tipos.map(t => ({
    name: t.tipo.toUpperCase(),
    value: parseFloat(t.horas),
    cor: CORES_DEMANDA[t.tipo.toLowerCase()] || CORES_DEMANDA['outros']
  }));

  const status = getStatusMargem(data.projeto.margem_porc);

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-indigo-500" /> Lucratividade do Projeto
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={exportarCSV} className="bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-600">CSV</button>
          <button onClick={exportarPDF} className="bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2">
            <FileText size={18} /> Relatório PDF
          </button>
        </div>
      </header>

      {/* FILTROS COM CORREÇÃO DE TIMEZONE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold">Projeto</label>
          <select 
            className="bg-[#0f172a] border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filtros.projeto_id}
            onChange={e => setFiltros({...filtros, projeto_id: e.target.value})}
          >
            {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold">Data Início</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <input 
              type="date" 
              value={filtros.data_inicio}
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={e => setFiltros({...filtros, data_inicio: e.target.value})} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold">Data Fim</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <input 
              type="date" 
              value={filtros.data_fim}
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" 
              onChange={e => setFiltros({...filtros, data_fim: e.target.value})} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Faturamento" value={`R$ ${data.projeto.receita.toLocaleString('pt-BR')}`} icon={<DollarSign color="#10b981"/>} />
        <Card title="Custo Gasto" value={`R$ ${data.projeto.custo_total.toLocaleString('pt-BR')}`} icon={<AlertTriangle color="#ef4444"/>} />
        <Card title="Margem Bruta" value={`R$ ${data.projeto.margem_rs.toLocaleString('pt-BR')}`} icon={<TrendingUp color="#6366f1"/>} />
        <Card title="Equilíbrio" value={`${data.projeto.break_even.toFixed(1)}h`} icon={<Clock color="#f59e0b"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 min-h-[400px]">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-slate-400">
            <TrendingUp size={16} className="text-indigo-500" /> Distribuição de Horas
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosGrafico} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-slate-400">
                <Filter size={18} className="text-indigo-500"/> Resumo por Tipo
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.resumo_tipos.map(item => (
                <div key={item.tipo} className="bg-[#0f172a] p-4 rounded-2xl border-l-4" style={{ borderLeftColor: CORES_DEMANDA[item.tipo.toLowerCase()] || '#64748b' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-500 block mb-0.5">{item.tipo}</span>
                      <span className="text-white font-bold">R$ {item.custo.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-white font-mono text-sm block font-bold">{item.horas}h</span>
                       <span className="text-[10px] text-slate-500 uppercase font-bold">Total Lançado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Saúde Operacional</span>
              <div className={`flex items-center gap-1.5 mt-1 font-bold text-sm ${status.color}`}>
                {status.icon} {status.label}
              </div>
            </div>
            <span className={`text-3xl font-black ${status.color}`}>{data.projeto.margem_porc.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex items-center gap-5">
      <div className="p-3 bg-slate-900 rounded-xl">{icon}</div>
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-black text-white">{value}</h2>
      </div>
    </div>
  );
}