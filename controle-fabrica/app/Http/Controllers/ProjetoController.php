<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Projeto;

class ProjetoController extends Controller
{
    public function index()
    {
        return Projeto::with('cliente')->get();
    }

    public function store(Request $request)
    {
        // Adicionada a data_fim e descricao na validação
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

        return Projeto::create($dados);
    }

    public function update(Request $request, $id)
    {
        $projeto = Projeto::find($id);

        if (!$projeto) {
            return response()->json(['error' => 'Projeto não encontrado'], 404);
        }

        // Adicionada a data_fim e descricao aqui também
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

        $projeto->update($dados);

        // Retornamos com o cliente para o React não bugar a lista ao atualizar
        return response()->json($projeto->load('cliente'));
    }

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