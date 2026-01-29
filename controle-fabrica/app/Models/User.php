<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Model: User
 * 
 * Propósito: representa o usuário autenticável do sistema.
 * Herda de Authenticatable para integração com autenticação do Laravel.
 * Usa Sanctum para tokens de acesso pessoal (API authentication).
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     * 
     * Campos que podem ser preenchidos via mass-assignment (create/fill):
     * - name: nome do usuário
     * - email: email único para autenticação
     * - password: senha do usuário (será hashada automaticamente pelo cast 'hashed')
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * 
     * Campos que não devem ser retornados em JSON:
     * - password: nunca expor a senha (mesmo hashada) em respostas JSON
     * - remember_token: token de lembrança de sessão (segurança)
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     * 
     * Define os tipos de dados para certos campos:
     * - email_verified_at: converte para objeto DateTime (gerenciamento de data)
     * - password: marca para hash automático (Illuminate\Hashing) ao atribuir um valor
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Hash automático ao atribuir (ex: $user->password = 'nova_senha')
        ];
    }
}
