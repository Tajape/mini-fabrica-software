// Página Dashboard
// Carrega lista de projetos e quando filtros.projeto_id definido, chama api.get('/dashboard', { params: filtros })
// exportarCSV: gera relatório em CSV com BOM UTF-8
// exportarPDF: gera relatório em PDF com jsPDF + autoTable
// getStatusMargem: retorna rótulo, cor e ícone baseado na margem (%)
// Mostra cards com KPIs, gráfico de pizza (recharts) e resumo por tipo
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Download,
  Filter,
  FileText,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import api from "../services/api";
import { formatarDataBR } from "../utils/dateUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Cores para o gráfico de pizza por tipo de demanda
const CORES_DEMANDA = {
  legislativa: "#818cf8",
  implantação: "#10b981",
  evolutiva: "#f59e0b",
  corretiva: "#ef4444",
  outros: "#64748b",
};

// Componente customizado para Tooltip com texto branco
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          border: "none",
          borderRadius: "12px",
          padding: "8px 12px",
          color: "#ffffff",
        }}
      >
        <p style={{ margin: 0, color: "#ffffff", fontWeight: "bold" }}>
          {payload[0].name} - {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [filtros, setFiltros] = useState({
    projeto_id: "",
    data_inicio: "",
    data_fim: "",
  });

  // Carrega lista de projetos na montagem
  useEffect(() => {
    api.get("/projetos").then((res) => {
      setProjetos(res.data);
      // Seleciona o primeiro projeto por padrão
      if (res.data.length > 0)
        setFiltros((f) => ({ ...f, projeto_id: res.data[0].id }));
    });
  }, []);

  // Quando o projeto selecionado muda, carrega os dados do dashboard
  useEffect(() => {
    if (filtros.projeto_id) {
      // Rota GET /api/dashboard com filtros de projeto e datas
      api
        .get("/dashboard", { params: filtros })
        .then((res) => setData(res.data));
    }
  }, [filtros]);

  // Converte string de data para formato BR (DD/MM/YYYY)
  const exibirDataBR = (dataString) => {
    return formatarDataBR(dataString);
  };

  // UTILITÁRIOS DE FORMATAÇÃO
  // Formata valor para moeda brasileira
  const formatCurrency = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Formata número com 2 casas decimais
  const formatNumber = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Exporta relatório em CSV com BOM UTF-8
  const exportarCSV = () => {
    if (!data) return;
    const { projeto, resumo_tipos } = data;
    const geracao = new Date().toLocaleString("pt-BR");

    const totalHoras = resumo_tipos.reduce(
      (s, t) => s + Number(t.horas || 0),
      0,
    );

    const linhas = [];
    linhas.push(["RELATÓRIO EXECUTIVO"]);
    linhas.push([]);
    linhas.push(["Projeto", projeto.nome.toUpperCase()]);
    linhas.push([
      "Período",
      `${filtros.data_inicio || "--"} até ${filtros.data_fim || "--"}`,
    ]);
    linhas.push(["Gerado em", geracao]);
    linhas.push([]);
    linhas.push(["RESUMO FINANCEIRO"]);
    linhas.push(["KPI", "VALOR"]);
    linhas.push(["Faturamento", formatCurrency(projeto.receita)]);
    linhas.push(["Custo Operacional", formatCurrency(projeto.custo_total)]);
    linhas.push(["Margem (%)", `${formatNumber(projeto.margem_porc)}%`]);
    linhas.push(["Margem (R$)", formatCurrency(projeto.margem_rs)]);
    linhas.push(["Break-even (h)", `${formatNumber(projeto.break_even)}h`]);
    linhas.push([]);
    linhas.push(["DETALHE POR TIPO"]);
    linhas.push(["Tipo", "Horas", "Custo", "% Horas"]);

    resumo_tipos.forEach((t) => {
      const percentual =
        totalHoras > 0
          ? ((Number(t.horas) / totalHoras) * 100).toFixed(1)
          : "0.0";
      linhas.push([
        t.tipo,
        `${t.horas}h`,
        formatCurrency(t.custo),
        `${percentual}%`,
      ]);
    });

    // Monta CSV com ; e BOM UTF-8
    let csv = "\uFEFF";
    linhas.forEach((row) => {
      csv += row.join(";") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const nomeArquivo = `Executivo_${projeto.nome.replace(/\s+/g, "_")}.csv`;
    link.download = nomeArquivo;
    link.click();
  };

  // Exporta relatório em PDF com jsPDF e autoTable
  const exportarPDF = () => {
    if (!data) return;
    const { projeto, resumo_tipos } = data;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const geracao = new Date().toLocaleString("pt-BR");

    const header = (doc) => {
      doc.setFontSize(14);
      doc.setTextColor("#1f2937");
      doc.text("MINI FÁBRICA DE SOFTWARE", 40, 48);
      doc.setFontSize(11);
      doc.setTextColor("#374151");
      doc.text(`Relatório Executivo — ${projeto.nome}`, 40, 66);
      doc.setFontSize(9);
      doc.setTextColor("#6b7280");
      doc.text(`Gerado em: ${geracao}`, 40, 80);
    };

    // Tabela de KPIs
    autoTable(doc, {
      startY: 100,
      head: [["KPI", "VALOR"]],
      body: [
        ["Faturamento", formatCurrency(projeto.receita)],
        ["Custo Operacional", formatCurrency(projeto.custo_total)],
        ["Margem (%)", `${formatNumber(projeto.margem_porc)}%`],
        ["Margem (R$)", formatCurrency(projeto.margem_rs)],
        ["Break-even (h)", `${formatNumber(projeto.break_even)}h`],
      ],
      styles: { cellPadding: 6, halign: "left" },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: 255,
        fontStyle: "bold",
      },
      theme: "grid",
      didDrawPage: (dataArg) => {
        header(doc);
        const page = doc.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor("#9ca3af");
        doc.text(`Página ${page}`, pageWidth - 80, pageHeight - 30);
      },
    });

    // Tabela de tipos de demanda
    const tiposBody = resumo_tipos.map((t) => [
      t.tipo,
      `${t.horas}h`,
      formatCurrency(t.custo),
    ]);
    autoTable(doc, {
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 220,
      head: [["Tipo", "Horas", "Custo"]],
      body: tiposBody,
      styles: { cellPadding: 6 },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: 255,
        fontStyle: "bold",
      },
      theme: "striped",
    });

    doc.save(`Analise_${projeto.nome.replace(/\s+/g, "_")}.pdf`);
  };

  // Retorna rótulo, cor e ícone baseado na margem em porcentagem
  const getStatusMargem = (porcentagem) => {
    if (porcentagem > 40)
      return {
        label: "Excelente",
        color: "text-emerald-400",
        icon: <CheckCircle2 size={16} />,
      };
    if (porcentagem > 20)
      return {
        label: "Saudável",
        color: "text-indigo-400",
        icon: <CheckCircle2 size={16} />,
      };
    return {
      label: "Crítica",
      color: "text-red-400",
      icon: <AlertTriangle size={16} />,
    };
  };

  if (!data)
    return <div className="p-8 text-white text-center">Sincronizando...</div>;

  // Prepara dados para o gráfico de pizza (recharts)
  const dadosGrafico = data.resumo_tipos.map((t) => ({
    name: t.tipo.toUpperCase(),
    value: parseFloat(t.horas),
    cor: CORES_DEMANDA[t.tipo.toLowerCase()] || CORES_DEMANDA["outros"],
  }));

  // Obtém status e cor da margem
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
          <button
            onClick={exportarCSV}
            className="bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-600"
          >
            CSV
          </button>
          <button
            onClick={exportarPDF}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2"
          >
            <FileText size={18} /> Relatório PDF
          </button>
        </div>
      </header>

      {/* FILTROS: Projeto, Data Início e Data Fim */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
        {/* Seletor de Projeto */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold">
            Projeto
          </label>
          <select
            className="bg-[#0f172a] border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filtros.projeto_id}
            onChange={(e) =>
              setFiltros({ ...filtros, projeto_id: e.target.value })
            }
          >
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Data Início */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold">
            Data Início
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
              size={16}
            />
            <input
              type="date"
              value={filtros.data_inicio}
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setFiltros({ ...filtros, data_inicio: e.target.value })
              }
            />
          </div>
        </div>

        {/* Filtro de Data Fim */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase text-slate-500 font-bold">
            Data Fim
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
              size={16}
            />
            <input
              type="date"
              value={filtros.data_fim}
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setFiltros({ ...filtros, data_fim: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* CARDS COM KPIS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Faturamento total */}
        <Card
          title="Faturamento"
          value={`R$ ${data.projeto.receita.toLocaleString("pt-BR")}`}
          icon={<DollarSign color="#10b981" />}
        />
        {/* Custo operacional */}
        <Card
          title="Custo Gasto"
          value={`R$ ${data.projeto.custo_total.toLocaleString("pt-BR")}`}
          icon={<AlertTriangle color="#ef4444" />}
        />
        {/* Margem bruta em reais */}
        <Card
          title="Margem Bruta"
          value={`R$ ${data.projeto.margem_rs.toLocaleString("pt-BR")}`}
          icon={<TrendingUp color="#6366f1" />}
        />
        {/* Break-even: ponto de equilíbrio em horas */}
        <Card
          title="Equilíbrio"
          value={`${data.projeto.break_even.toFixed(1)}h`}
          icon={<Clock color="#f59e0b" />}
        />
      </div>

      {/* GRÁFICO DE PIZZA E RESUMO POR TIPO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Distribuição de Horas */}
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 min-h-[400px]">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-slate-400">
            <TrendingUp size={16} className="text-indigo-500" /> Distribuição de
            Horas
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-slate-400">
              <Filter size={18} className="text-indigo-500" /> Resumo por Tipo
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.resumo_tipos.map((item) => (
                <div
                  key={item.tipo}
                  className="bg-[#0f172a] p-4 rounded-2xl border-l-4"
                  style={{
                    borderLeftColor:
                      CORES_DEMANDA[item.tipo.toLowerCase()] || "#64748b",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-500 block mb-0.5">
                        {item.tipo}
                      </span>
                      <span className="text-white font-bold">
                        R$ {item.custo.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-mono text-sm block font-bold">
                        {item.horas}h
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">
                        Total Lançado
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
            {/* Indicador de Saúde Operacional (Margem %) */}
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                Saúde Operacional
              </span>
              <div
                className={`flex items-center gap-1.5 mt-1 font-bold text-sm ${status.color}`}
              >
                {status.icon} {status.label}
              </div>
            </div>
            {/* Exibe a margem em porcentagem com a cor do status */}
            <span className={`text-3xl font-black ${status.color}`}>
              {data.projeto.margem_porc.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente: Card para exibir um KPI com ícone, título e valor
function Card({ title, value, icon }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex items-center gap-5">
      <div className="p-3 bg-slate-900 rounded-xl">{icon}</div>
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          {title}
        </p>
        <h2 className="text-2xl font-black text-white">{value}</h2>
      </div>
    </div>
  );
}
