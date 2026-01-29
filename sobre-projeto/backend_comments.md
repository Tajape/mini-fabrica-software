# Anotações - Backend (Laravel)

Abaixo explico os arquivos mais importantes do backend e o que cada função/método faz.

**Model: `app/Models/User.php`**
- Propósito: representa o usuário autenticável do sistema.
- `protected $fillable`: campos que podem ser preenchidos via mass-assignment (`name`, `email`, `password`).
- `protected $hidden`: campos escondidos na serialização (`password`, `remember_token`).
- `casts()`: faz o cast de campos, por exemplo `email_verified_at` para `datetime` e `password` para `hashed` (último é para hashing automático ao atribuir).

**Model: `app/Models/Cliente.php`**
- Propósito: representa clientes empresariais.
- `$fillable`: `nome`, `email`, `telefone`, `ativo` — define campos permitidos para criação/atualização via `create()`/`fill()`.
- `projetos()`: relação One-to-Many — um cliente tem muitos projetos. Usa `hasMany(Projeto::class)`.

**Model: `app/Models/Projeto.php`**
- Propósito: armazena contratos/projetos.
- `$fillable`: campos do projeto (cliente_id, nome, descricao, datas, valores, status).
- `cliente()`: Many-to-One — `belongsTo(Cliente::class)` conecta projeto ao cliente dono.
- `lancamentos()`: One-to-Many — `hasMany(LancamentoHora::class, 'projeto_id')` para obter horas lançadas no projeto.

**Model: `app/Models/LancamentoHora.php`**
- Propósito: registro de horas trabalhadas por projeto.
- `protected $table = 'lancamento_horas'`: nome da tabela (quando não segue plural padrão).
- `$fillable`: campos do lançamento (`projeto_id`, `colaborador`, `data`, `horas`, `tipo`, `descricao`).
- `projeto()`: `belongsTo(Projeto::class)` para navegar de volta ao projeto.

---

**Controllers**

Observação: todos os controllers retornam JSON e usam validação via `$request->validate()`.

**`app/Http/Controllers/ClienteController.php`**
- `index(Request $request)`: retorna lista de clientes; aceita parâmetro `search` para filtrar por `nome` ou `email`.
- `store(Request $request)`: valida campos e cria cliente; validação garante `email` único (`unique:clientes,email`). Retorna 201 com o cliente criado.
- `show($id)`: pega um cliente por ID ou retorna 404 (`findOrFail`).
- `update(Request $request, $id)`: valida (permitindo ignorar o próprio e-mail com `unique:clientes,email,$id`) e atualiza o cliente.
- `destroy($id)`: exclui cliente encontrado e retorna mensagem de sucesso.

Por que importante: implementa regras de negócio (e-mail único) e serve como API CRUD para o front.

**`app/Http/Controllers/ProjetoController.php`**
- `index()`: retorna todos os projetos com o cliente (usando `with('cliente')`).
- `store(Request $request)`: valida dados do projeto (datas, valores numéricos, status) e cria o projeto.
- `update(Request $request, $id)`: procura projeto, valida campos com `sometimes` (apenas quando enviados) e atualiza; retorna o projeto com o cliente carregado para manter frontend consistente.
- `destroy($id)`: exclui projeto e retorna mensagens apropriadas.

**`app/Http/Controllers/LancamentoHoraController.php`**
- `index(Request $request)`: retorna lançamentos com filtros: `projeto_id` e intervalo de datas (`whereBetween`), inclui projeto e cliente (`with('projeto.cliente')`) e ordena por `data`.
- `store(Request $request)`: valida existência do `projeto_id` (`exists:projetos,id`), formato da `data`, `horas > 0` e valores admissíveis para `tipo`. Cria e retorna o lançamento com dados relacionados.
- `update(Request $request, $id)`: valida e atualiza lançamento existente.
- `destroy($id)`: exclui lançamento.

**`app/Http/Controllers/DashboardController.php`**
- `index(Request $request)`: endpoint que calcula KPIs do projeto selecionado (ou primeiro projeto caso não passe `projeto_id`).
  - Recebe filtros `projeto_id`, `data_inicio`, `data_fim`.
  - Carrega lançamentos do intervalo usando `whereDate` (evita problemas de timezone/hora).
  - Calcula `horasTotais`, `custoTotal` (horas * custo_hora_base), `margemRs` (receita - custo), `margemPorc`, e `breakEven` (ponto de equilíbrio em horas).
  - Agrupa por `tipo` e calcula horas e custo por tipo.
  - Retorna um objeto JSON com resumo do projeto e `resumo_tipos`.

---

**Rotas: `routes/api.php`**
- `GET /dashboard` → `DashboardController@index` (KPIs e resumo financeiro).
- `apiResource('lancamentos')` → cria rotas REST para `LancamentoHoraController` (index/store/show/update/destroy).
- `apiResource('projetos')` → rotas REST para `ProjetoController`.
- `GET /user` com middleware `auth:sanctum` (rota padrão do Laravel para usuário autenticado).
- `apiResource('clientes')` → rotas REST para `ClienteController`.

---

**Migrations (pontos-chave)**
- `2026_01_24_191146_create_clientes_table.php`
  - Cria tabela `clientes` com `id`, `nome`, `email` (único), `telefone`, `ativo` (boolean) e timestamps.
- `2026_01_24_191222_create_projetos_table.php`
  - Cria tabela `projetos` com `cliente_id` (foreign key constrained a `clientes`, `onDelete cascade`), `nome`, `descricao`, datas, valores decimais (`valor_contrato`, `custo_hora_base`), `status` e timestamps.
- `2026_01_24_191231_create_lancamento_horas_table.php`
  - Cria `lancamento_horas` com `projeto_id` (FK para `projetos`, cascade), `colaborador`, `data` (date), `horas` (decimal), `tipo`, `descricao` e timestamps.
- `2026_01_24_194436_create_personal_access_tokens_table.php` — tabela do Laravel Sanctum para tokens pessoais.
- Arquivos `0001_*` (users, cache, jobs) são migrations padrão do framework (usuário, sessões, jobs, cache, failed_jobs etc.).

Por que as migrations importam: definem o schema e restrições (unique, foreign keys, onDelete cascade) que garantem integridade referencial e regras de negócio (ex.: e-mail único).

---

Se quiser, eu posso agora gerar arquivos textuais em `annotated/` com cada arquivo completo contendo comentários linha-a-linha (cópias comentadas dos arquivos PHP e JS). Quer que eu crie essas cópias comentadas completas ou os resumos acima já atendem ao que você precisa para a apresentação?