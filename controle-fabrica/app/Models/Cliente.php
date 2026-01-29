<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model: Cliente
 * 
 * Propósito: representa clientes empresariais do sistema.
 * Cada cliente pode ter múltiplos projetos associados (relação One-to-Many).
 */
class Cliente extends Model
{
    /**
     * Campos que podem ser preenchidos via mass-assignment (create/fill).
     * 
     * - nome: nome da empresa/cliente (obrigatório)
     * - email: email único para contato (obrigatório, único)
     * - telefone: telefone de contato (opcional)
     * - ativo: indica se o cliente está ativo no sistema (boolean)
     */
    protected $fillable = ['nome', 'email', 'telefone', 'ativo'];

    /**
     * Relacionamento: Um Cliente tem Muitos Projetos (One-to-Many)
     * 
     * Permite navegar de um cliente para todos os seus projetos.
     * Uso: $cliente->projetos() ou $cliente->projetos (com eager loading)
     */
    public function projetos()
    {
        return $this->hasMany(Projeto::class);
    }
}
