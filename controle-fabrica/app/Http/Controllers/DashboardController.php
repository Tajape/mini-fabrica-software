<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use App\Models\LancamentoHora;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Pega o projeto_id enviado pelo React (filtros)
        $projetoId = $request->query('projeto_id');

        // Se não vier ID, buscamos o primeiro projeto do banco para não quebrar a tela
        if (!$projetoId) {
            $primeiroProjeto = Projeto::first();
            if (!$primeiroProjeto) {
                return response()->json(['error' => 'Nenhum projeto encontrado'], 404);
            }
            $projetoId = $primeiroProjeto->id;
        }

        // 2. Busca o projeto específico
        $projeto = Projeto::with('cliente')->findOrFail($projetoId);

        // 3. Busca os lançamentos deste projeto
        $lancamentos = LancamentoHora::where('projeto_id', $projetoId)->get();

        // 4. Cálculos Financeiros
        $horasTotais = (float) $lancamentos->sum('horas');
        $custoHoraBase = (float) ($projeto->custo_hora_base ?? 0);
        $receita = (float) ($projeto->valor_contrato ?? 0);
        
        // Custo Total = Horas lançadas * Valor da hora do projeto
        $custoTotal = $horasTotais * $custoHoraBase;
        
        // Lucro em Reais
        $margemRs = $receita - $custoTotal;
        
        // Lucro em Porcentagem (Margem %)
        $margemPorc = $receita > 0 ? ($margemRs / $receita) * 100 : 0;
        
        // Ponto de Equilíbrio: Quantas horas podem ser gastas antes do lucro virar zero
        $breakEven = $custoHoraBase > 0 ? ($receita / $custoHoraBase) : 0;

        // 5. Agrupamento por Tipo (Evolutiva, Corretiva, etc.) para o Gráfico de Lista
        $resumoTipos = $lancamentos->groupBy('tipo')->map(function ($itens, $tipo) use ($custoHoraBase) {
            $horasPorTipo = (float) $itens->sum('horas');
            return [
                'tipo' => $tipo,
                'horas' => $horasPorTipo,
                'custo' => $horasPorTipo * $custoHoraBase
            ];
        })->values();

        // 6. Retorno no formato exato que o seu Dashboard.jsx espera
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