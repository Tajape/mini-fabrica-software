<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use App\Models\LancamentoHora;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $projetoId = $request->query('projeto_id');
        $dataInicio = $request->query('data_inicio');
        $dataFim = $request->query('data_fim');

        if (!$projetoId) {
            $primeiroProjeto = Projeto::first();
            if (!$primeiroProjeto) {
                return response()->json(['error' => 'Nenhum projeto encontrado'], 404);
            }
            $projetoId = $primeiroProjeto->id;
        }

        $projeto = Projeto::with('cliente')->findOrFail($projetoId);

        // --- LÓGICA DE FILTRO CORRIGIDA (whereDate) ---
        // O whereDate ignora as horas e fuso horário, comparando apenas o dia.
        $query = LancamentoHora::where('projeto_id', $projetoId);

        if ($dataInicio) {
            $query->whereDate('data', '>=', $dataInicio);
        }

        if ($dataFim) {
            $query->whereDate('data', '<=', $dataFim);
        }

        $lancamentos = $query->get();
        // ----------------------------------------------

        // --- CÁLCULOS ---
        $horasTotais = (float) $lancamentos->sum('horas');
        $custoHoraBase = (float) ($projeto->custo_hora_base ?? 0);
        $receita = (float) ($projeto->valor_contrato ?? 0);
        
        $custoTotal = $horasTotais * $custoHoraBase;
        $margemRs = $receita - $custoTotal;
        $margemPorc = $receita > 0 ? ($margemRs / $receita) * 100 : 0;
        
        // Ponto de equilíbrio (KPI de referência do projeto)
        $breakEven = $custoHoraBase > 0 ? ($receita / $custoHoraBase) : 0;

        $resumoTipos = $lancamentos->groupBy('tipo')->map(function ($itens, $tipo) use ($custoHoraBase) {
            $horasPorTipo = (float) $itens->sum('horas');
            return [
                'tipo' => $tipo,
                'horas' => $horasPorTipo,
                'custo' => $horasPorTipo * $custoHoraBase
            ];
        })->values();

        return response()->json([
            'projeto' => [
                'id' => $projeto->id,
                'nome' => $projeto->nome,
                'cliente' => $projeto->cliente->nome ?? 'Cliente Geral',
                'receita' => $receita,
                'custo_total' => $custoTotal,
                'margem_rs' => $margemRs,
                'margem_porc' => $margemPorc,
                'break_even' => $breakEven,
                'horas_totais' => $horasTotais,
                'custo_hora_base' => $custoHoraBase
            ],
            'resumo_tipos' => $resumoTipos
        ]);
    }
}