<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model: LancamentoHora
 * 
 * Propósito: registro de horas trabalhadas por projeto.
 * Cada lançamento conecta um colaborador a um projeto em uma data específica,
 * com informações sobre tipo de atividade, horas e descrição.
 */
class LancamentoHora extends Model
{
    /**
     * Nome da tabela no banco de dados.
     * 
     * Definido explicitamente porque não segue o padrão plural automático do Laravel
     * (Laravel assume 'lancamento_horas' por padrão, mas aqui estamos sendo explícito).
     */
    protected $table = 'lancamento_horas'; 

    /**
     * Campos que podem ser preenchidos via mass-assignment.
     * 
     * Dados do lançamento:
     * - projeto_id: ID do projeto (FK, obrigatório)
     * - colaborador: nome do colaborador que executou o trabalho
     * - data: data em que as horas foram trabalhadas
     * - horas: quantidade de horas (decimal, ex: 8.5 horas)
     * - tipo: classificação do trabalho (corretiva, evolutiva, implantação, legislativa)
     * - descricao: descrição detalhada do trabalho realizado
     */
    protected $fillable = [
        'projeto_id', 'colaborador', 'data', 'horas', 'tipo', 'descricao'
    ];

    /**
     * Relacionamento: Um Lançamento pertence a Um Projeto (Many-to-One)
     * 
     * Permite navegar de um lançamento de horas até o projeto ao qual se refere.
     * Usa foreign key 'projeto_id' na tabela lancamento_horas.
     */
    public function projeto()
    {
        return $this->belongsTo(Projeto::class);
    }
}