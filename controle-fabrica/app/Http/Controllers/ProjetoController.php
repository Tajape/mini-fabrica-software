<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Projeto;

/**
 * ProjetoController
 * 
 * Implementa o CRUD para Projetos.
 * Retorna JSON e usa validação via $request->validate().
 * 
 * Regras de negócio:
 * - Cada projeto pertence a um cliente (cliente_id obrigatório)
 * - Valores são numéricos (valor_contrato, custo_hora_base)
 * - Datas em formato date (YYYY-MM-DD)
 * - Status pode ser: planejado, em_andamento, pausado, finalizado
 */
class ProjetoController extends Controller
{
    /**
     * index - Listagem de Projetos
     * 
     * Retorna todos os projetos com dados do cliente carregado (eager loading com 'with').
     * Uso de 'with()' evita N+1 queries problem.
     * 
     * @return \Illuminate\Http\JsonResponse Array de projetos com clientes
     */
    public function index()
    {
        return Projeto::with('cliente')->get();
    }

    /**
     * store - Criar novo Projeto
     * 
     * Valida dados obrigatórios: cliente_id, nome, data_inicio, valor_contrato, custo_hora_base, status.
     * Campos opcionais: descricao, data_fim.
     * 
     * @param  Request $request Campos: cliente_id (required), nome (required), descricao (nullable),
     *                          data_inicio (required, date), data_fim (nullable, date),
     *                          valor_contrato (required, numeric), custo_hora_base (required, numeric),
     *                          status (required)
     * @return \Illuminate\Http\JsonResponse Projeto criado
     */
    public function store(Request $request)
    {
        // Validação de campos obrigatórios e tipos de dados
        $dados = $request->validate([
            'cliente_id' => 'required',
            'nome' => 'required',
            'descricao' => 'nullable|string',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date', // Permite nulo, mas se enviar, tem que ser data
            'valor_contrato' => 'required|numeric',
            'custo_hora_base' => 'required|numeric',
            'status' => 'required'
        ]);

        // Cria e retorna o projeto com dados validados
        return Projeto::create($dados);
    }

    /**
     * update - Atualizar Projeto existente
     * 
     * Validação com 'sometimes': campos são validados apenas se enviados na request.
     * Permite atualização parcial de campos.
     * 
     * Importante: retorna o projeto com cliente carregado (->load('cliente'))
     * para manter consistência com o frontend após atualização.
     * 
     * @param  Request $request Campos para atualizar (mesmo que em store)
     * @param  int $id ID do projeto
     * @return \Illuminate\Http\JsonResponse Projeto atualizado com cliente
     */
    public function update(Request $request, $id)
    {
        // Busca o projeto
        $projeto = Projeto::find($id);

        if (!$projeto) {
            return response()->json(['error' => 'Projeto não encontrado'], 404);
        }

        // Validação com 'sometimes': valida apenas campos que foram enviados na request
        $dados = $request->validate([
            'cliente_id' => 'sometimes|required',
            'nome' => 'sometimes|required',
            'descricao' => 'nullable|string',
            'data_inicio' => 'sometimes|required|date',
            'data_fim' => 'nullable|date',
            'valor_contrato' => 'sometimes|required|numeric',
            'custo_hora_base' => 'sometimes|required|numeric',
            'status' => 'sometimes|required'
        ]);

        // Atualiza os campos validados
        $projeto->update($dados);

        // Retorna com o cliente para o frontend não bugar a lista ao atualizar
        return response()->json($projeto->load('cliente'));
    }

    /**
     * destroy - Deletar Projeto
     * 
     * Busca projeto e deleta. Cascata: lançamentos de horas são deletados automaticamente (onDelete cascade).
     * 
     * @param  int $id ID do projeto
     * @return \Illuminate\Http\JsonResponse Mensagem de sucesso ou erro 404
     */
    public function destroy($id)
    {
        // Busca o projeto
        $projeto = Projeto::find($id);
        if ($projeto) {
            $projeto->delete(); // Cascata deleta lançamentos associados
            return response()->json(['message' => 'Excluído com sucesso']);
        }
        return response()->json(['error' => 'Não encontrado'], 404);
    }
}