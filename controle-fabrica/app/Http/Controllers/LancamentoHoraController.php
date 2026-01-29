<?php

namespace App\Http\Controllers;

use App\Models\LancamentoHora;
use Illuminate\Http\Request;

/**
 * LancamentoHoraController
 * 
 * Implementa o CRUD completo para Lançamentos de Horas.
 * Retorna JSON e usa validação via $request->validate().
 * 
 * Regras de negócio:
 * - Projeto ID obrigatório e deve existir (exists:projetos,id)
 * - Tipo restrito a: corretiva, evolutiva, implantacao, legislativa
 * - Horas deve ser > 0 (gt:0)
 * - Suporta filtros: projeto_id e intervalo de datas
 */
class LancamentoHoraController extends Controller
{
    /**
     * index - Listagem de Lançamentos de Horas
     * 
     * Retorna lançamentos com filtros opcionais: projeto_id e intervalo de datas.
     * Carrega dados relacionados (projeto e cliente) com eager loading.
     * Ordena por data (descendente - mais recentes primeiro).
     * 
     * @param  Request $request Filtros:
     *                          - projeto_id (opcional): filtra lançamentos do projeto
     *                          - data_inicio (opcional): data inicial do intervalo
     *                          - data_fim (opcional): data final do intervalo
     * @return \Illuminate\Http\JsonResponse Array de lançamentos ordenado por data
     */
    public function index(Request $request)
    {
        // Inicia query com eager loading para evitar N+1 queries (carrega projeto e cliente)
        $query = LancamentoHora::with('projeto.cliente');

        // Filtra por projeto se fornecido
        if ($request->filled('projeto_id')) {
            $query->where('projeto_id', $request->projeto_id);
        }

        // Filtra por intervalo de datas (whereBetween) se ambas data_inicio e data_fim fornecidas
        if ($request->filled('data_inicio') && $request->filled('data_fim')) {
            $query->whereBetween('data', [$request->data_inicio, $request->data_fim]);
        }

        // Ordena por data descendente (mais recentes primeiro) e retorna
        return $query->orderBy('data', 'desc')->get();
    }

    /**
     * store - Criar novo Lançamento de Horas
     * 
     * Validação completa:
     * - projeto_id: obrigatório e deve existir na tabela projetos
     * - data: formato data (YYYY-MM-DD)
     * - horas: deve ser > 0 (gt:0 = greater than zero)
     * - tipo: restrito a valores predefinidos (enum)
     * 
     * Retorna o lançamento criado com projeto e cliente carregados (201 Created).
     * 
     * @param  Request $request Campos: projeto_id (required, exists), colaborador (required, string),
     *                          data (required, date), horas (required, numeric, >0),
     *                          tipo (required, in:corretiva,evolutiva,implantacao,legislativa),
     *                          descricao (nullable, string)
     * @return \Illuminate\Http\JsonResponse Lançamento criado com status 201
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'projeto_id'  => 'required|exists:projetos,id', // Verifica se projeto existe
            'colaborador' => 'required|string',
            'data'        => 'required|date',
            'horas'       => 'required|numeric|gt:0', // Horas > 0 (greater than)
            'tipo'        => 'required|in:corretiva,evolutiva,implantacao,legislativa', // Enum restrito
            'descricao'   => 'nullable|string'
        ]);

        // Cria o lançamento com dados validados
        $lancamento = LancamentoHora::create($validated);
        
        // Retorna com projeto e cliente carregados para o frontend
        return response()->json($lancamento->load('projeto.cliente'), 201);
    }

    /**
     * update - Atualizar Lançamento existente
     * 
     * Validação: mesma validação do store (todos os campos obrigatórios).
     * Busca lançamento existente ou retorna 404 (findOrFail).
     * 
     * @param  Request $request Campos para atualizar (mesmo que em store)
     * @param  int $id ID do lançamento
     * @return \Illuminate\Http\JsonResponse Lançamento atualizado com projeto e cliente
     */
    public function update(Request $request, $id)
    {
        // Busca o lançamento ou falha com 404
        $lancamento = LancamentoHora::findOrFail($id);
        
        // Validação completa (mesma do store)
        $validated = $request->validate([
            'projeto_id'  => 'required|exists:projetos,id',
            'colaborador' => 'required|string',
            'data'        => 'required|date',
            'horas'       => 'required|numeric|gt:0',
            'tipo'        => 'required|in:corretiva,evolutiva,implantacao,legislativa',
            'descricao'   => 'nullable|string'
        ]);

        // Atualiza os campos validados
        $lancamento->update($validated);
        
        // Retorna com projeto e cliente carregados
        return response()->json($lancamento->load('projeto.cliente'));
    }

    /**
     * destroy - Deletar Lançamento
     * 
     * Busca lançamento por ID e deleta. Se não encontrado, retorna 404 via findOrFail.
     * 
     * @param  int $id ID do lançamento
     * @return \Illuminate\Http\JsonResponse Mensagem de sucesso
     */
    public function destroy($id)
    {
        // Busca o lançamento ou falha com 404
        LancamentoHora::findOrFail($id)->delete();
        
        return response()->json(['message' => 'Lançamento excluído']);
    }
}