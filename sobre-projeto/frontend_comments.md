# Anotações - Frontend (React)

Explicações por arquivo e o que cada função/parte faz.

**`src/main.jsx`**
- Ponto de entrada da aplicação React. Usa `createRoot` para renderizar `App` dentro do elemento `#root`.

**`src/App.jsx`**
- Define as rotas com `react-router-dom`.
- `Sidebar` fica fixa; `main` contém as `Routes` para `Dashboard`, `Clientes`, `Projetos`, `Lancamentos`.

**`src/services/api.js`**
- Instancia `axios` com `baseURL` apontando para `http://127.0.0.1:8000/api`.
- Exporta a instância para ser usada em todo o front (`api.get`, `api.post`, etc.).

**`src/utils/dateUtils.js`**
- `formatarDataBR(dataString)`: converte uma string YYYY-MM-DD (ou com T) para `DD/MM/YYYY`. Evita problemas de timezone removendo parte de hora.
- `obterDataLocal()`: retorna data local atual em `YYYY-MM-DD`, útil para preencher inputs `type=date`.

---

**Componentes**

**`src/components/sidebar.jsx`**
- Componente de navegação lateral.
- `isActive(path)`: função que decide classes CSS para link ativo.
- `isHelpOpen` controla modal de ajuda (estado local com `useState`).
- Subcomponentes `SidebarLink`, `TutorialSection`, `ServiceHelp` organizam o markup.

**`src/components/ModalProjeto.jsx`**
- Modal para criar/editar Projeto.
- Recebe `isOpen`, `onClose`, `onSave`, `clientes`, `projetoParaEditar`.
- `useEffect` popula `formData` quando `projetoParaEditar` muda.
- `onSubmit` do form chama `onSave(formData)` e fecha modal.
- `formatarDataParaInput`: normaliza datas para o input `date`.

**`src/components/ModalLancamento.jsx`**
- Modal para lançar horas.
- `obterDataLocal()` define data padrão do input.
- `useEffect` popula formulário quando `lancamentoParaEditar` estiver presente.
- No submit chama `onSave` e fecha modal.

**`src/components/ModalCliente.jsx`**
- Modal para criar/editar cliente.
- Controla `ativo` por checkbox e popula formulário via `useEffect`.

---

**Páginas**

**`src/pages/Clientes.jsx`**
- Estados principais: `clientes`, `loading`, `isModalOpen`, `clienteParaEditar`, `busca`.
- `useEffect` para carregar clientes via `api.get('/clientes', { params: { search: busca } })`.
- `salvarCliente(dados)`: chama `api.post('/clientes', dados)` ou `api.put('/clientes/{id}', dados)` conforme edição, atualiza estado local.
- `deletarCliente(id)`: chama `api.delete('/clientes/{id}')` e remove localmente.
- Busca local e controle de modal de cliente.

**`src/pages/Projetos.jsx`**
- Carrega `projetos` e `clientes` na montagem (`fetchDados` com `Promise.all`).
- `handleSalvar(dados)`: converte tipos (parseFloat/parseInt) e chama `api.post`/`api.put` conforme.
- `deletarProjeto(id)`: chama `api.delete('/projetos/{id}')`.
- Usa `ModalProjeto` para UI de criação/edição.

**`src/pages/Lancamentos.jsx`**
- Carrega `lancamentos` e `projetos` conforme filtros (`filtros` contém `projeto_id`, `data_inicio`, `data_fim`).
- `fetchDados()` usa `api.get('/lancamentos', { params: filtros })`.
- `handleSalvar` faz POST/PUT conforme `lancamentoParaEditar` e valida `horas > 0` antes.
- UI tem tabela com ações para editar/excluir e modal inline (form) para criar/editar.

**`src/pages/Dashboard.jsx`**
- Carrega lista de projetos e, quando `filtros.projeto_id` definido, chama `api.get('/dashboard', { params: filtros })` para obter KPIs.
- `exportarCSV` e `exportarPDF` geram relatórios (csv com BOM UTF-8; PDF com `jsPDF` + `autoTable`).
- `getStatusMargem(porcentagem)`: retorna rótulo, cor e ícone baseado na margem (%).
- Mostra cards com KPIs, gráfico de pizza (recharts) e resumo por tipo.

---

Notas sobre integração front-back
- O front depende das rotas REST do backend (`/api/clientes`, `/api/projetos`, `/api/lancamentos`, `/api/dashboard`).
- O `api.js` define `baseURL`; altere se sua API não rodar na `8000`.
- Validadores no backend (`required`, `exists`, `unique`) protegem integridade dos dados; o front captura erros e mostra mensagens básicas.

---
