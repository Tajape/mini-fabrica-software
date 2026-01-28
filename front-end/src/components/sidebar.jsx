import { useState } from 'react'; // Adicionei o useState
import { LayoutDashboard, Users, Briefcase, Clock, Factory, HelpCircle, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false); // Estado para o modal de ajuda

  const isActive = (path) => 
    location.pathname === path 
      ? "bg-indigo-600/20 text-indigo-400 border-r-2 border-indigo-500 shadow-[inset_0_0_10px_rgba(79,70,229,0.1)]" 
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200";

  return (
    <>
      <div className="fixed top-0 left-0 w-64 bg-[#1e293b] h-screen border-r border-slate-800 p-4 flex flex-col shadow-2xl z-50">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          <div className="bg-indigo-500/10 p-2 rounded-xl">
            <Factory className="text-indigo-500" size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-100 tracking-wider leading-none">MINI FÁBRICA</span>
            <span className="text-[10px] text-indigo-400 font-bold tracking-[0.2em]">DE SOFTWARE</span>
          </div>
        </div>
        
        {/* NAVEGAÇÃO PRINCIPAL */}
        <nav className="space-y-1.5 flex-1">
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/')} />
          <SidebarLink to="/clientes" icon={<Users size={20} />} label="Clientes" active={isActive('/clientes')} />
          <SidebarLink to="/projetos" icon={<Briefcase size={20} />} label="Projetos" active={isActive('/projetos')} />
          <SidebarLink to="/lancamentos" icon={<Clock size={20} />} label="Lançamentos" active={isActive('/lancamentos')} />
        </nav>

        {/* BOTÃO DE AJUDA NO FINAL */}
        <div className="pt-4 border-t border-slate-800">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all group"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">Como utilizar?</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MODAL DE TUTORIAL (RENDERIZAÇÃO CONDICIONAL) */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-slate-800 p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="space-y-6">
              <header>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <HelpCircle className="text-indigo-500" /> Guia do Sistema
                </h2>
                <p className="text-slate-400 mt-2 italic text-sm">Entenda como gerenciar sua lucratividade com maestria.</p>
              </header>

              <div className="grid gap-6">
                <TutorialSection 
                  title="1. Fluxo de Trabalho"
                  content="Primeiro cadastre seus Clientes, depois crie os Projetos vinculados a eles. Por fim, registre as horas em Lançamentos para alimentar os gráficos."
                />
                
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">Tipos de Serviço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ServiceHelp title="🚀 Evolutiva" desc="Novas funções que agregam valor ao produto." />
                    <ServiceHelp title="🐞 Corretiva" desc="Correção de bugs. Se este índice subir, a margem cai." color="text-red-400" />
                    <ServiceHelp title="📦 Implantação" desc="Setup inicial, configurações e treinamentos." />
                    <ServiceHelp title="⚖️ Legislativa" desc="Mudanças obrigatórias por conta de leis ou impostos." />
                  </div>
                </div>

                <TutorialSection 
                  title="📊 O Dashboard"
                  content="O Ponto de Equilíbrio (Break-even) indica quando o projeto parou de dar custo e começou a gerar lucro real. Fique de olho na Margem Bruta: se estiver abaixo de 20%, o projeto está em risco!"
                />
              </div>

              <button 
                onClick={() => setIsHelpOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Entendi, vamos lucrar!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Sub-componentes para organizar o código
function SidebarLink({ to, icon, label, active }) {
  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-bold ${active}`}>
      {icon} {label}
    </Link>
  );
}

function TutorialSection({ title, content }) {
  return (
    <div className="space-y-2">
      <h3 className="text-slate-100 font-bold text-lg">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function ServiceHelp({ title, desc, color = "text-indigo-400" }) {
  return (
    <div className="space-y-1">
      <h4 className={`font-bold text-sm ${color}`}>{title}</h4>
      <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
    </div>
  );
}