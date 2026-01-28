<?php

namespace App\Http\Controllers;

use App\Models\Cliente; // Importante: avisa o Controller que vamos usar a tabela Clientes
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Listagem de Clientes (Regra: Pode ter busca)
     */
    public function index(Request $request)
    {
        $query = Cliente::query();

        // Se vier um termo de busca na URL (?search=...), ele filtra
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('nome', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        return $query->get();
    }

    /**
     * Salvar um novo Cliente
     */
    public function store(Request $request)
    {
        // Validação: Aqui você garante que o e-mail é único antes de salvar
        $validated = $request->validate([
            'nome'  => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email', // Regra do Desafio!
            'telefone' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        $cliente = Cliente::create($validated);

        return response()->json($cliente, 201); // 201 = Criado com sucesso
    }

    /**
     * Ver apenas um cliente específico
     */
    public function show(string $id)
    {
        return Cliente::findOrFail($id);
    }

    /**
     * Atualizar dados do cliente
     */
    public function update(Request $request, string $id)
    {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'nome'  => 'string|max:255',
            'email' => 'email|unique:clientes,email,' . $id, // Único, mas ignora o e-mail do próprio cliente
            'telefone' => 'nullable|string',
            'ativo' => 'boolean'
        ]);

        $cliente->update($validated);

        return response()->json($cliente);
    }

    /**
     * Deletar cliente
     */
    public function destroy(string $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();

        return response()->json(['message' => 'Cliente excluído com sucesso']);
    }
}