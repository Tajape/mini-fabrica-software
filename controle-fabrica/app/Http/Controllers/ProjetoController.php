<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Projeto; // Certifique-se de que o Model existe

class ProjetoController extends Controller
{
    // Listar todos (Você já deve ter esse)
    public function index()
    {
        return Projeto::with('cliente')->get();
    }

    // Criar novo (Você já deve ter esse)
    public function store(Request $request)
    {
        $dados = $request->validate([
            'cliente_id' => 'required',
            'nome' => 'required',
            'data_inicio' => 'required|date',
            'valor_contrato' => 'required|numeric',
            'custo_hora_base' => 'required|numeric',
            'status' => 'required'
        ]);

        return Projeto::create($dados);
    }

    // --- O MÉTODO QUE ESTAVA FALTANDO ---
    public function update(Request $request, $id)
    {
        $projeto = Projeto::find($id);

        if (!$projeto) {
            return response()->json(['error' => 'Projeto não encontrado'], 404);
        }

        $dados = $request->validate([
            'cliente_id' => 'sometimes|required',
            'nome' => 'sometimes|required',
            'data_inicio' => 'sometimes|required|date',
            'valor_contrato' => 'sometimes|required|numeric',
            'custo_hora_base' => 'sometimes|required|numeric',
            'status' => 'sometimes|required'
        ]);

        $projeto->update($dados);

        return response()->json($projeto);
    }

    // Deletar
    public function destroy($id)
    {
        $projeto = Projeto::find($id);
        if ($projeto) {
            $projeto->delete();
            return response()->json(['message' => 'Excluído com sucesso']);
        }
        return response()->json(['error' => 'Não encontrado'], 404);
    }
}