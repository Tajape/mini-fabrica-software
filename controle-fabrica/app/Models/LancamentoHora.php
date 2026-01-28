<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LancamentoHora extends Model
{
    protected $table = 'lancamento_horas'; 

    protected $fillable = [
        'projeto_id', 'colaborador', 'data', 'horas', 'tipo', 'descricao'
    ];

    public function projeto()
    {
        return $this->belongsTo(Projeto::class);
    }
}