// Define as rotas da aplicação com react-router-dom
// Sidebar fica fixa; a tag main contém as Routes que renderizam as diferentes páginas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Projetos from "./pages/Projetos";
import Lancamentos from "./pages/Lancamentos";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#0f172a] text-slate-200">
        {/* Barra de navegação lateral fixa */}
        <Sidebar />

        {/* Conteúdo principal com margin-left para compensar a Sidebar fixa (w-64) */}
        <main className="flex-1 ml-64 overflow-x-hidden">
          <div className="container mx-auto p-4">
            {/* Definição das rotas da aplicação */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/projetos" element={<Projetos />} />
              <Route path="/lancamentos" element={<Lancamentos />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
