<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

/**
 * ClienteController
 * 
 * Implementa o CRUD completo para Clientes.
 * Retorna JSON e usa validação via $request->validate().
 * 
 * Regras de negócio:
 * - Email é único (unique:clientes,email)
 * - Campos obrigatórios: nome, email
 * - Suporta filtro por busca (nome ou email)
 */
class ClienteController extends Controller
{
    /**
     * index - Listagem de Clientes
     * 
     * Retorna lista de clientes com suporte a filtro de busca.
     * Parâmetro: ?search=termo busca por nome ou email (like com caracteres curinga)
     * 
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse Array de clientes
     */
    public function index(Request $request)
    {
        $query = Cliente::query();

        // Se vier um termo de busca na URL (?search=...), filtra por nome ou email
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('nome', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        return $query->get();
    }

    /**
     * store - Salvar um novo Cliente
     * 
     * Validação: Garante que o e-mail é único antes de salvar (regra de negócio importante).
     * Retorna 201 (Created) com o cliente criado.
     * 
     * @param  Request $request Campos: nome (required), email (required, unique), telefone (nullable), ativo (boolean)
     * @return \Illuminate\Http\JsonResponse Cliente criado com status 201
     */
    public function store(Request $request)
    {
        // Validação: Garante email único e campos obrigatórios
        $validated = $request->validate([
            'nome'  => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email', // Email único - Regra do negócio!
            'telefone' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        // Cria e salva o cliente com os dados validados (mass-assignment seguro)
        $cliente = Cliente::create($validated);

        return response()->json($cliente, 201); // 201 = Criado com sucesso
    }

    /**
     * show - Ver um cliente específico
     * 
     * Busca cliente por ID ou retorna 404 (findOrFail).
     * 
     * @param  string $id ID do cliente
     * @return \Illuminate\Http\JsonResponse Cliente encontrado
     */
    public function show(string $id)
    {
        return Cliente::findOrFail($id);
    }

    /**
     * update - Atualizar dados do cliente
     * 
     * Validação: Email único, mas ignora o email do próprio cliente (unique:clientes,email,$id).
     * Permite atualização parcial de campos.
     * 
     * @param  Request $request Campos para atualizar (mesmo que em store)
     * @param  string $id ID do cliente
     * @return \Illuminate\Http\JsonResponse Cliente atualizado
     */
    public function update(Request $request, string $id)
    {
        // Busca o cliente ou falha com 404
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'nome'  => 'string|max:255',
            'email' => 'email|unique:clientes,email,' . $id, // Único, mas ignora o e-mail do próprio cliente na validação
            'telefone' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        // Atualiza apenas os campos que foram validados
        $cliente->update($validated);

        return response()->json($cliente);
    }

    /**
     * destroy - Deletar cliente
     * 
     * Busca cliente por ID e deleta. Cascata: projetos e lançamentos são deletados automaticamente (onDelete cascade).
     * 
     * @param  string $id ID do cliente
     * @return \Illuminate\Http\JsonResponse Mensagem de sucesso
     */
    public function destroy(string $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete(); // Cascata deleta projetos e lançamentos associados

        return response()->json(['message' => 'Cliente excluído com sucesso']);
    }
}