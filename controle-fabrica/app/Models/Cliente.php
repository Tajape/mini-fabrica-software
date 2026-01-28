<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    // Permite preencher esses campos via formulário
    protected $fillable = ['nome', 'email', 'telefone', 'ativo'];

    // Relacionamento: 1 Cliente tem Muitos Projetos
    public function projetos()
    {
        return $this->hasMany(Projeto::class);
    }
}
