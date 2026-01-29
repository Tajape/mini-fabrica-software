
# 🚀 Mini Fábrica de Software - Controle de BI & Lucratividade

Uma plataforma **Full-stack** completa para o controle operacional, análise de custos e inteligência de negócios em fábricas de software. O sistema oferece monitoramento em tempo real de faturamento versus custos reais, permitindo decisões estratégicas baseadas em dados.

> 🎯 **Objetivo:** Identificar a lucratividade real de cada contrato através de análise de Business Intelligence (BI) e relatórios financeiros automatizados.

---

## 📋 Sumário

- [Stack Tecnológica](#-stack-tecnológica)
- [Dependências Completas](#-dependências-completas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Regras de Negócio & BI](#-regras-de-negócio--bi)
- [Como Rodar](#-como-rodar)
- [Endpoints da API](#-endpoints-da-api)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura de Banco de Dados](#-estrutura-de-banco-de-dados)
- [Diferenciais](#-diferenciais)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🛠️ Stack Tecnológica

### **Frontend (SPA - Single Page Application)**
- **React 19.2.0** - Framework JavaScript para UI reativa
- **Vite 7.2.4** - Bundler e dev server ultrarrápido
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **React Router DOM 7.13.0** - Roteamento client-side
- **Recharts 3.7.0** - Gráficos responsivos e interativos
- **Framer Motion 12.29.0** - Animações fluidas e efeitos visuais
- **Axios 1.13.3** - Cliente HTTP para requisições

### **Backend (API REST)**
- **PHP 8.2+** - Linguagem servidor
- **Laravel 12** - Framework web robusto
- **MySQL 8.0** - Banco de dados relacional
- **Eloquent ORM** - Mapeamento objeto-relacional

---

## 📦 Dependências Completas

### **Produção (Frontend)**

| Biblioteca | Versão | Propósito |
|-----------|--------|----------|
| react | ^19.2.0 | Framework UI principal |
| react-dom | ^19.2.0 | Renderização DOM do React |
| react-router-dom | ^7.13.0 | Navegação e roteamento SPA |
| vite | ^7.2.4 | Build tool e dev server |
| tailwindcss | ^4.1.18 | Estilização CSS moderna |
| @tailwindcss/vite | ^4.1.18 | Plugin Vite para Tailwind |
| @tailwindcss/postcss | ^4.1.18 | PostCSS plugin para Tailwind |
| postcss | ^8.5.6 | Processador CSS com plugins |
| autoprefixer | ^10.4.23 | Adiciona prefixos CSS automáticos |
| axios | ^1.13.3 | Cliente HTTP para API |
| recharts | ^3.7.0 | Biblioteca de gráficos React |
| lucide-react | ^0.563.0 | Ícones SVG elegantes |
| jspdf | ^4.0.0 | Geração de PDFs no browser |
| jspdf-autotable | ^5.0.7 | Plugin para tabelas em PDFs |
| framer-motion | ^12.29.0 | Animações e transições |

### **Desenvolvimento (Frontend)**

| Biblioteca | Versão | Propósito |
|-----------|--------|----------|
| eslint | ^9.39.1 | Linter JavaScript |
| @eslint/js | ^9.39.1 | Config padrão ESLint |
| eslint-plugin-react-refresh | ^0.4.24 | Plugin para Fast Refresh |
| eslint-plugin-react-hooks | ^7.0.1 | Validação de hooks React |
| @vitejs/plugin-react | ^5.1.1 | Plugin React para Vite |
| @types/react | ^19.2.5 | Tipos TypeScript para React |
| @types/react-dom | ^19.2.3 | Tipos TypeScript para React DOM |
| globals | ^16.5.0 | Variáveis globais |

---

## 📂 Estrutura do Projeto

```
mini-fabrica-software/
├── front-end/                    # Aplicação React (SPA)
│   ├── src/
│   │   ├── components/           # Componentes React reutilizáveis
│   │   │   ├── ModalCliente.jsx
│   │   │   ├── ModalLancamento.jsx
│   │   │   ├── ModalProjeto.jsx
│   │   │   └── sidebar.jsx
│   │   ├── pages/                # Páginas principais
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projetos.jsx
│   │   │   ├── Lancamentos.jsx
│   │   │   └── Clientes.jsx
│   │   ├── services/             # Camada de integração API
│   │   │   └── api.js
│   │   ├── utils/                # Funções utilitárias
│   │   │   └── dateUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                   # Assets estáticos
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
│
└── controle-fabrica/             # API Laravel (Backend)
    ├── app/
    │   ├── Models/               # Eloquent Models
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   └── Requests/
    │   └── Resources/
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    ├── routes/
    │   └── api.php
    └── .env
```

---

## 📊 Regras de Negócio & BI

O sistema calcula em **tempo real** os indicadores financeiros para cada contrato:

### **Métricas Principais**

| Indicador | Fórmula | Significado |
|-----------|---------|-------------|
| **Custo Total** | Horas Totais × Custo/Hora Base | Investimento de recursos no projeto |
| **Margem Bruta (R$)** | Receita - Custo Total | Lucro bruto do contrato |
| **Margem Bruta (%)** | (Margem Bruta / Receita) × 100 | Rentabilidade percentual |
| **Break-even** | Valor Contrato / Custo/Hora | Horas necessárias para igualar receita |

### **Categorias de Demandas**

- 🚀 **Evolutiva** - Novas funcionalidades e melhorias
- 🛠️ **Corretiva** - Manutenção e correção de bugs
- 📦 **Implantação** - Setup, configurações e treinamentos
- ⚖️ **Legislativa** - Adequações fiscais ou legais

### **Status de Saúde Financeira**

- 🟢 **Excelente** - Margem > 40%
- 🟡 **Saudável** - Margem 20% - 40%
- 🔴 **Crítica** - Margem < 20%

---

## 🚀 Como Rodar

### **Pré-requisitos**
- Node.js 18+ (Frontend)
- PHP 8.2+ (Backend)
- MySQL 8.0+ (Banco de dados)
- Composer (Para dependências PHP)

### **1️⃣ Backend (Laravel API)**

```bash
# Navegue até o diretório backend
cd controle-fabrica

# Instale dependências PHP
composer install

# Configure o arquivo .env
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Configure as credenciais do MySQL no .env:
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=mini_fabrica
# DB_USERNAME=root
# DB_PASSWORD=

# Execute as migrations e seeds
php artisan migrate --seed

# Inicie o servidor (rodará em http://127.0.0.1:8000)
php artisan serve
```

### **2️⃣ Frontend (React + Vite)**

```bash
# Navegue até o diretório frontend
cd front-end

# Instale dependências Node
npm install

# Inicie o servidor de desenvolvimento (rodará em http://localhost:5173)
npm run dev

# Para criar build de produção
npm run build

# Para verificar a build localmente
npm run preview
```

---

## 📡 Endpoints da API

### **Clientes**
```
GET    /api/clientes              # Listar todos os clientes
GET    /api/clientes/{id}         # Obter cliente específico
POST   /api/clientes              # Criar novo cliente
PUT    /api/clientes/{id}         # Atualizar cliente
DELETE /api/clientes/{id}         # Deletar cliente
```

### **Projetos**
```
GET    /api/projetos              # Listar todos os projetos
GET    /api/projetos/{id}         # Obter projeto específico
POST   /api/projetos              # Criar novo projeto
PUT    /api/projetos/{id}         # Atualizar projeto
DELETE /api/projetos/{id}         # Deletar projeto
```

### **Lançamentos (Timesheet)**
```
GET    /api/lancamentos           # Listar lançamentos com filtros
GET    /api/lancamentos/{id}      # Obter lançamento específico
POST   /api/lancamentos           # Criar novo lançamento
PUT    /api/lancamentos/{id}      # Atualizar lançamento
DELETE /api/lancamentos/{id}      # Deletar lançamento
```

### **Dashboard & BI**
```
GET    /api/dashboard             # Dados agregados com filtros
       ?projeto_id=1
       &data_inicio=2026-01-01
       &data_fim=2026-01-31
```

**Resposta Dashboard:**
```json
{
  "projeto": {
    "id": 1,
    "nome": "Projeto X",
    "receita": 50000.00,
    "custo_total": 20000.00,
    "margem_bruta": 30000.00,
    "margem_porc": 60.00
  },
  "resumo_tipos": [
    { "tipo": "evolutiva", "horas": 150, "percentual": 60 },
    { "tipo": "corretiva", "horas": 80, "percentual": 32 },
    { "tipo": "legislativa", "horas": 10, "percentual": 4 },
    { "tipo": "implantacao", "horas": 5, "percentual": 2 }
  ]
}
```

---

## ✨ Funcionalidades Principais

### **Dashboard**
- 📊 Gráficos dinâmicos de distribuição de demandas
- 📈 Indicadores financeiros em tempo real
- 💰 Análise de margem bruta por tipo de demanda
- 📥 Exportação de relatórios em PDF
- 🔍 Filtros por período e projeto

### **Gestão de Projetos**
- ✏️ CRUD completo de projetos/contratos
- 🏢 Associação com clientes
- 💵 Configuração de valores e custos base
- 📅 Controle de datas de início e término
- 🎯 Acompanhamento de status

### **Lançamento de Horas**
- ⏱️ Timesheet com data, horas e tipo de demanda
- 📝 Descrição detalhada de atividades
- 🔗 Vinculação automática a projetos
- ✏️ Edição e exclusão de registros
- 🔍 Busca e filtros avançados

### **Gestão de Clientes**
- 👥 Cadastro de clientes
- 📧 Informações de contato
- 🏪 Visualização de projetos por cliente
- 📊 Resumo de faturamento por cliente

### **Exportação de Dados**
- 📄 Relatórios em PDF com tabelas e métricas
- 📋 Download de dados em formato estruturado
- 🎨 Layouts profissionais e personalizáveis

---

## 🗄️ Estrutura de Banco de Dados

```sql
-- Clientes
CREATE TABLE clientes (
  id INT PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  created_at TIMESTAMP
);

-- Projetos
CREATE TABLE projetos (
  id INT PRIMARY KEY,
  cliente_id INT,
  nome VARCHAR(255),
  descricao TEXT,
  valor_contrato DECIMAL(10,2),
  custo_hora_base DECIMAL(8,2),
  data_inicio DATE,
  data_fim DATE,
  status ENUM('planejamento', 'ativo', 'pausado', 'finalizado'),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Lançamentos
CREATE TABLE lancamentos (
  id INT PRIMARY KEY,
  projeto_id INT,
  colaborador VARCHAR(255),
  data DATE,
  horas DECIMAL(5,2),
  tipo ENUM('evolutiva', 'corretiva', 'legislativa', 'implantacao'),
  descricao TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);
```

---

## 🎯 Diferenciais do Projeto

✅ **Exportação Dinâmica**
- Geração de relatórios em PDF via jsPDF com tabelas formatadas
- Dados financeiros estruturados e prontos para impressão

✅ **Visualização Analítica**
- Gráficos interativos com Recharts
- Identificação de gargalos e ineficiências
- Dashboard responsivo para desktop e tablet

✅ **UX/UI Moderna**
- Interface Dark Mode elegante e profissional
- Feedbacks visuais e transições suaves
- Ícones intuitivos com Lucide React
- Animations fluidas com Framer Motion

✅ **Correção de Bugs**
- Tratamento correto de fusos horários em datas
- Função `dateUtils.js` para formatação segura
- Evita erros de interpretação de datas UTC

✅ **Performance**
- Build otimizado com Vite
- Lazy loading de componentes
- CSS otimizado com Tailwind
- Bundle size reduzido

✅ **Code Quality**
- ESLint configurado
- Padrões de código consistentes
- Componentes reutilizáveis

---

## 🔧 Scripts Disponíveis

### **Frontend**
```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Cria build otimizado para produção
npm run preview   # Visualiza a build localmente
npm run lint      # Verifica erros de linting
```

### **Backend**
```bash
php artisan serve              # Inicia servidor Laravel
php artisan migrate            # Executa migrations
php artisan migrate --seed     # Executa migrations e seeders
php artisan tinker             # CLI interativa
php artisan queue:work         # Processa filas (se aplicável)
```

---

## 🤝 Contribuindo

1. Faça um **Fork** do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

---

## 📝 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

## 📧 Contato & Suporte

Para dúvidas, sugestões ou reportar bugs, entre em contato através dos canais oficiais do projeto.

---

## 🎓 Documentação Adicional

- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação React](https://react.dev)
- [Documentação Laravel](https://laravel.com/docs)
- [Recharts Docs](https://recharts.org)
- [Vite Guide](https://vitejs.dev)

---

**Desenvolvido com ❤️ para otimizar a gestão de fábricas de software**
