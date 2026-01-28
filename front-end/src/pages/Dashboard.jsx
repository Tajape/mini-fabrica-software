import { useState, useEffect } from 'react';
import { 
  TrendingUp, Download, Filter, FileText, 
  DollarSign, AlertTriangle, Clock, CheckCircle2 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
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
  const [filtros, setFiltros] = useState({ projeto_id: '', data_inicio: '', data_fim: '' });

  useEffect(() => {
    api.get('/projetos').then(res => {
      setProjetos(res.data);
      if (res.data.length > 0) setFiltros(f => ({ ...f, projeto_id: res.data[0].id }));
    });
  }, []);

  useEffect(() => {
    if (filtros.projeto_id) {
      api.get('/dashboard', { params: filtros }).then(res => setData(res.data));
    }
  }, [filtros]);

  // --- EXPORTAÇÃO CSV (Padrão Excel Corporativo) ---
  const exportarCSV = () => {
    if (!data) return;
    const { projeto, resumo_tipos } = data;
    const dataGeracao = new Date().toLocaleString('pt-BR');

    let csv = "\uFEFF"; // Garante acentos e compatibilidade com Excel
    
    // Cabeçalho de Identidade
    csv += `RELATÓRIO EXECUTIVO DE PERFORMANCE FINANCEIRA\n`;
    csv += `PROJETO:;${projeto.nome.toUpperCase()}\n`;
    csv += `GERADO EM:;${dataGeracao}\n`;
    csv += `STATUS DE MARGEM:;${getStatusMargem(projeto.margem_porc).label.toUpperCase()}\n\n`;

    // Seção de KPIs
    csv += `RESUMO DOS INDICADORES CHAVE (KPIs)\n`;
    csv += `Indicador;Valor;Impacto Comercial\n`;
    csv += `Faturamento Total;R$ ${projeto.receita.toLocaleString('pt-BR')};Receita Bruta\n`;
    csv += `Custo Operacional;R$ ${projeto.custo_total.toLocaleString('pt-BR')};Gastos com Mão de Obra\n`;
    csv += `Margem Líquida;R$ ${projeto.margem_rs.toLocaleString('pt-BR')};Lucro sobre Operação\n`;
    csv += `Margem Percentual;${projeto.margem_porc.toFixed(2).replace('.', ',')}%;Eficiência Financeira\n`;
    csv += `Break-even;${projeto.break_even.toFixed(1)}h;Ponto de Equilíbrio\n\n`;

    // Seção de Detalhamento
    csv += `ANÁLISE POR CATEGORIA DE DEMANDA\n`;
    csv += `Tipo de Demanda;Horas Alocadas;Custo Direto;Representatividade\n`;

    resumo_tipos.forEach(t => {
      const perc = projeto.horas_totais > 0 ? ((t.horas / projeto.horas_totais) * 100).toFixed(1) : 0;
      csv += `${t.tipo.toUpperCase()};${t.horas}h;R$ ${t.custo.toLocaleString('pt-BR')};${perc}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Executivo_${projeto.nome.replace(/\s/g, '_')}.csv`;
    link.click();
  };

  // --- EXPORTAÇÃO PDF (Layout Elegante e Profissional) ---
  const exportarPDF = () => {
    if (!data) return;
    const { projeto, resumo_tipos } = data;
    const doc = new jsPDF();
    const statusInfo = getStatusMargem(projeto.margem_porc);
    const dataHoje = new Date().toLocaleString('pt-BR');

    // 1. Faixa Lateral de Identidade (Sutil)
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(0, 0, 5, 297, 'F');

    // 2. Cabeçalho Principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("MINI FABRICA DE SOFTWARE", 15, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("GESTÃO DE LUCRATIVIDADE E EFICIÊNCIA OPERACIONAL", 15, 31);

    // Linha Divisora Decorativa
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 38, 195, 38);

    // 3. Info do Projeto e Status Card
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`PROJETO: ${projeto.nome.toUpperCase()}`, 15, 48);
    doc.text(`EMISSÃO: ${dataHoje}`, 15, 53);

    // Badge de Status (Destaque visual conforme a saúde)
    const statusColor = projeto.margem_porc > 40 ? [16, 185, 129] : (projeto.margem_porc > 20 ? [79, 70, 229] : [239, 68, 68]);
    doc.setFillColor(...statusColor);
    doc.roundedRect(145, 42, 50, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(statusInfo.label.toUpperCase(), 170, 49.5, { align: 'center' });

    // 4. Tabela de Indicadores Financeiros
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("RESUMO FINANCEIRO CONSOLIDADO", 15, 70);

    autoTable(doc, {
      startY: 75,
      head: [['KPI', 'VALOR NOMINAL', 'DESCRIÇÃO']],
      body: [
        ['FATURAMENTO', `R$ ${projeto.receita.toLocaleString('pt-BR')}`, 'Receita total acordada'],
        ['CUSTO OPERACIONAL', `R$ ${projeto.custo_total.toLocaleString('pt-BR')}`, 'Total gasto em desenvolvimento'],
        ['MARGEM BRUTA (R$)', `R$ ${projeto.margem_rs.toLocaleString('pt-BR')}`, 'Lucro operacional líquido'],
        ['MARGEM DE LUCRO (%)', `${projeto.margem_porc.toFixed(2)}%`, 'Eficiência sobre o capital'],
        ['BREAK-EVEN', `${projeto.break_even.toFixed(1)}h`, 'Ponto de equilíbrio de horas'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        1: { fontStyle: 'bold', textColor: [30, 41, 59] }
      },
      margin: { left: 15 }
    });

    // 5. Tabela de Horas por Demanda
    doc.text("DETALHAMENTO DE PERFORMANCE POR DEMANDA", 15, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['CATEGORIA', 'VOLUME (HORAS)', 'INVESTIMENTO', 'SHARE %']],
      body: resumo_tipos.map(t => [
        t.tipo.toUpperCase(),
        `${t.horas}h`,
        `R$ ${t.custo.toLocaleString('pt-BR')}`,
        `${projeto.horas_totais > 0 ? ((t.horas / projeto.horas_totais) * 100).toFixed(1) : 0}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 15 }
    });

    // 6. Rodapé Final
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Este documento é confidencial e destinado exclusivamente à gestão executiva.", 105, 285, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
    }

    doc.save(`Analise_Executiva_${projeto.nome.replace(/\s/g, '_')}.pdf`);
  };

  const getStatusMargem = (porcentagem) => {
    if (porcentagem > 40) return { label: "Margem Excelente", color: "text-emerald-400", icon: <CheckCircle2 size={16}/> };
    if (porcentagem > 20) return { label: "Margem Saudável", color: "text-indigo-400", icon: <CheckCircle2 size={16}/> };
    return { label: "Atenção Crítica", color: "text-red-400", icon: <AlertTriangle size={16}/> };
  };

  if (!data) return <div className="p-8 text-white text-center">Sincronizando Dashboard...</div>;

  const dadosGrafico = data.resumo_tipos.map(t => ({
    name: t.tipo.toUpperCase(),
    value: parseFloat(t.horas),
    cor: CORES_DEMANDA[t.tipo.toLowerCase()] || CORES_DEMANDA['outros']
  }));

  const status = getStatusMargem(data.projeto.margem_porc);

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-indigo-500" /> Lucratividade do Projeto
          </h1>
          <p className="text-slate-400 mt-1">Gestão de custos e performance operacional.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={exportarCSV} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm border border-slate-600">
            <Download size={18} /> CSV
          </button>
          <button onClick={exportarPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all border border-emerald-500">
            <FileText size={18} /> Gerar Relatório PDF
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Projeto</label>
          <select 
            className="bg-[#0f172a] border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={filtros.projeto_id}
            onChange={e => setFiltros({...filtros, projeto_id: e.target.value})}
          >
            {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Data Início</label>
          <input type="date" className="bg-[#0f172a] border border-slate-700 text-white rounded-xl px-4 py-3 outline-none" onChange={e => setFiltros({...filtros, data_inicio: e.target.value})} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Data Fim</label>
          <input type="date" className="bg-[#0f172a] border border-slate-700 text-white rounded-xl px-4 py-3 outline-none" onChange={e => setFiltros({...filtros, data_fim: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Faturamento" value={`R$ ${data.projeto.receita.toLocaleString('pt-BR')}`} icon={<DollarSign color="#10b981"/>} />
        <Card title="Custo Gasto" value={`R$ ${data.projeto.custo_total.toLocaleString('pt-BR')}`} icon={<AlertTriangle color="#ef4444"/>} />
        <Card title="Margem Bruta" value={`R$ ${data.projeto.margem_rs.toLocaleString('pt-BR')}`} icon={<TrendingUp color="#6366f1"/>} />
        <Card title="Equilíbrio" value={`${data.projeto.break_even.toFixed(1)}h`} icon={<Clock color="#f59e0b"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRÁFICO DE PIZZA (ROSCA) */}
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl min-h-[400px]">
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
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LISTAGEM DE DEMANDAS COM CORES */}
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-slate-400">
                <Filter size={18} className="text-indigo-500"/> Resumo por Tipo
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.resumo_tipos.map(item => (
                <div key={item.tipo} className="bg-[#0f172a] p-4 rounded-2xl border-l-4 transition-all hover:bg-slate-800/40" style={{ borderLeftColor: CORES_DEMANDA[item.tipo.toLowerCase()] || '#64748b' }}>
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
          
          {/* INDICADOR DE SAÚDE AJUSTADO (COM COMENTÁRIO) */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Saúde Operacional</span>
              <div className={`flex items-center gap-1.5 mt-1 font-bold text-sm ${status.color}`}>
                {status.icon}
                {status.label}
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
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl hover:bg-slate-800/50 transition-all flex items-center gap-5">
      <div className="p-3 bg-slate-900 rounded-xl">{icon}</div>
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-black text-white">{value}</h2>
      </div>
    </div>
  );
}