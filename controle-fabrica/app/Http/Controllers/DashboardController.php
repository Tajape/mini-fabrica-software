<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use App\Models\LancamentoHora;
use Illuminate\Http\Request;

/**
 * DashboardController
 * 
 * Responsável por calcular e retornar KPIs e métricas financeiras de um projeto específico.
 * Processa lançamentos de horas dentro de um intervalo de datas e calcula indicadores como
 * custo total, margem de lucro, ponto de equilíbrio e resumo por tipo de atividade.
 */
class DashboardController extends Controller
{
    /**
     * index
     * 
     * Endpoint que calcula KPIs do projeto selecionado (ou primeiro projeto caso não passe projeto_id).
     * 
     * @param  Request $request Recebe filtros:
     *                          - projeto_id (opcional): ID do projeto a analisar
     *                          - data_inicio (opcional): data inicial em formato YYYY-MM-DD
     *                          - data_fim (opcional): data final em formato YYYY-MM-DD
     * 
     * @return \Illuminate\Http\JsonResponse Retorna objeto JSON com:
     *                                        - projeto: ID, nome, cliente, receita, custo_total, margem_rs, margem_porc, break_even, horas_totais, custo_hora_base
     *                                        - resumo_tipos: array com horas e custo agrupados por tipo
     */
    public function index(Request $request)
    {
        // Extrai os parâmetros de filtro da query string
        $projetoId = $request->query('projeto_id');
        $dataInicio = $request->query('data_inicio');
        $dataFim = $request->query('data_fim');

        // Se nenhum projeto foi especificado, usa o primeiro projeto da base de dados como padrão
        if (!$projetoId) {
            $primeiroProjeto = Projeto::first();
            if (!$primeiroProjeto) {
                return response()->json(['error' => 'Nenhum projeto encontrado'], 404);
            }
            $projetoId = $primeiroProjeto->id;
        }

        // Carrega o projeto selecionado com os dados do cliente associado (eager loading com 'with')
        $projeto = Projeto::with('cliente')->findOrFail($projetoId);

        // --- LÓGICA DE FILTRO CORRIGIDA (whereDate) ---
        // O whereDate ignora as horas e fuso horário, comparando apenas o dia (YYYY-MM-DD).
        // Isso evita problemas com timezone e timestamps ao filtrar lançamentos por intervalo de datas.
        $query = LancamentoHora::where('projeto_id', $projetoId);

        // Se data_inicio foi fornecida, filtra lançamentos a partir dessa data
        if ($dataInicio) {
            $query->whereDate('data', '>=', $dataInicio);
        }

        // Se data_fim foi fornecida, filtra lançamentos até essa data
        if ($dataFim) {
            $query->whereDate('data', '<=', $dataFim);
        }

        // Executa a query e obtém todos os lançamentos dentro do intervalo
        $lancamentos = $query->get();
        // -----------------------------------------------

        // --- CÁLCULOS DE KPIs E MÉTRICAS FINANCEIRAS ---
        // Soma todas as horas registradas nos lançamentos do intervalo
        $horasTotais = (float) $lancamentos->sum('horas');
        
        // Recupera o custo por hora do projeto (valor base para cálculo de despesa)
        $custoHoraBase = (float) ($projeto->custo_hora_base ?? 0);
        
        // Receita contratada do projeto (valor do contrato/projeto)
        $receita = (float) ($projeto->valor_contrato ?? 0);
        
        // Calcula custo total: multiplica horas totais pelo custo por hora
        $custoTotal = $horasTotais * $custoHoraBase;
        
        // Margem de lucro em reais: receita menos custo total
        $margemRs = $receita - $custoTotal;
        
        // Margem de lucro em percentual: (margem_rs / receita) * 100
        // Se receita for 0, retorna 0% para evitar divisão por zero
        $margemPorc = $receita > 0 ? ($margemRs / $receita) * 100 : 0;
        
        // Break-even: ponto de equilíbrio em horas necessárias para cobrir a receita
        // Calcula quantas horas ao custo_hora_base são necessárias para igualar a receita
        $breakEven = $custoHoraBase > 0 ? ($receita / $custoHoraBase) : 0;

        // Agrupa lançamentos por tipo e calcula horas e custo para cada tipo
        // Exemplo: agrupa por 'corretiva', 'evolutiva', 'implantação', 'legislativa'
        $resumoTipos = $lancamentos->groupBy('tipo')->map(function ($itens, $tipo) use ($custoHoraBase) {
            // Soma horas de todos os lançamentos deste tipo
            $horasPorTipo = (float) $itens->sum('horas');
            return [
                'tipo' => $tipo,
                'horas' => $horasPorTipo,
                // Multiplica horas por custo_hora_base para obter custo total por tipo
                'custo' => $horasPorTipo * $custoHoraBase
            ];
        })->values(); // 'values()' reconstrói o array com índices numéricos (remove as chaves de grupo)

        // Retorna resposta JSON com resumo do projeto e métricas financeiras calculadas
        // Estrutura:
        // - projeto: dados do projeto com KPIs consolidados
        // - resumo_tipos: breakdown de horas e custos por tipo de atividade
        return response()->json([
            'projeto' => [
                'id' => $projeto->id,
                'nome' => $projeto->nome,
                'cliente' => $projeto->cliente->nome ?? 'Cliente Geral', // Nome do cliente ou fallback
                'receita' => $receita, // Valor total do contrato
                'custo_total' => $custoTotal, // Horas totais * custo_hora_base
                'margem_rs' => $margemRs, // Lucro em reais (receita - custo_total)
                'margem_porc' => $margemPorc, // Lucro em percentual (margem_rs / receita * 100)
                'break_even' => $breakEven, // Horas necessárias para igualar a receita (receita / custo_hora_base)
                'horas_totais' => $horasTotais, // Total de horas registradas no período
                'custo_hora_base' => $custoHoraBase // Custo por hora do projeto
            ],
            'resumo_tipos' => $resumoTipos // Array com horas e custos agrupados por tipo de atividade
        ]);
    }
}