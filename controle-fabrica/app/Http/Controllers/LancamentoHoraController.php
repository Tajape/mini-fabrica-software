<?php

namespace App\Http\Controllers;

use App\Models\LancamentoHora;
use Illuminate\Http\Request;

class LancamentoHoraController extends Controller
{
    // Listagem com filtros de projeto e período
    public function index(Request $request)
    {
        $query = LancamentoHora::with('projeto.cliente');

        if ($request->filled('projeto_id')) {
            $query->where('projeto_id', $request->projeto_id);
        }

        if ($request->filled('data_inicio') && $request->filled('data_fim')) {
            $query->whereBetween('data', [$request->data_inicio, $request->data_fim]);
        }

        return $query->orderBy('data', 'desc')->get();
    }

    // Criar novo lançamento
    public function store(Request $request)
    {
        $validated = $request->validate([
            'projeto_id'  => 'required|exists:projetos,id',
            'colaborador' => 'required|string',
            'data'        => 'required|date',
            'horas'       => 'required|numeric|gt:0',
            'tipo'        => 'required|in:corretiva,evolutiva,implantacao,legislativa',
            'descricao'   => 'nullable|string'
        ]);

        $lancamento = LancamentoHora::create($validated);
        return response()->json($lancamento->load('projeto.cliente'), 201);
    }

    // Atualizar lançamento existente (CRUD Completo)
    public function update(Request $request, $id)
    {
        $lancamento = LancamentoHora::findOrFail($id);
        
        $validated = $request->validate([
            'projeto_id'  => 'required|exists:projetos,id',
            'colaborador' => 'required|string',
            'data'        => 'required|date',
            'horas'       => 'required|numeric|gt:0',
            'tipo'        => 'required|in:corretiva,evolutiva,implantacao,legislativa',
            'descricao'   => 'nullable|string'
        ]);

        $lancamento->update($validated);
        return response()->json($lancamento->load('projeto.cliente'));
    }

    // Excluir lançamento
    public function destroy($id)
    {
        LancamentoHora::findOrFail($id)->delete();
        return response()->json(['message' => 'Lançamento excluído']);
    }
}