<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model: Projeto
 * 
 * Propósito: armazena contratos/projetos da fábrica.
 * Cada projeto pertence a um cliente e pode ter múltiplos lançamentos de horas.
 */
class Projeto extends Model
{
    /**
     * Campos que pode ser preenchidos via mass-assignment.
     * 
     * Metadados do projeto: cliente_id, nome, descricao, datas, valores financeiros e status.
     */
    protected $fillable = [
        'cliente_id', 'nome', 'descricao', 'data_inicio', 
        'data_fim', 'valor_contrato', 'custo_hora_base', 'status'
    ];

    /**
     * Relacionamento: Um Projeto pertence a Um Cliente (Many-to-One)
     * 
     * Permite navegar de um projeto até seu cliente dono.
     * Usa foreign key 'cliente_id' na tabela projetos.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Relacionamento: Um Projeto tem Muitos Lançamentos de Horas (One-to-Many)
     * 
     * Permite obter todos os lançamentos de horas registrados para este projeto.
     * Usa foreign key 'projeto_id' na tabela lancamento_horas.
     */
    public function lancamentos()
    {
        return $this->hasMany(LancamentoHora::class, 'projeto_id');
    }
}
