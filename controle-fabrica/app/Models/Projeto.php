<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Projeto extends Model
{
    protected $fillable = [
        'cliente_id', 'nome', 'descricao', 'data_inicio', 
        'data_fim', 'valor_contrato', 'custo_hora_base', 'status'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function lancamentos()
    {
        return $this->hasMany(LancamentoHora::class, 'projeto_id');
    }
}
