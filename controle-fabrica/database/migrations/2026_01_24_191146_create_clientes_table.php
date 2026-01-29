<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: create_clientes_table
 * 
 * Cria a tabela 'clientes' que armazena dados de clientes empresariais.
 * 
 * Colunas:
 * - id: chave primária auto-increment
 * - nome: nome da empresa/cliente (obrigatório, string)
 * - email: email único para contato (obrigatório, string, única)
 * - telefone: telefone de contato (opcional, pode ser NULL)
 * - ativo: status do cliente (boolean, padrão = true)
 * - created_at, updated_at: timestamps do Laravel (criação e última atualização)
 * 
 * Restrições:
 * - Email é unique: garante que não há dois clientes com mesmo email
 * 
 * Relacionamentos:
 * - Um cliente tem muitos projetos (1:N com tabela projetos via FK cliente_id)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id(); // ID primária auto-increment (UNSIGNED BIG INT)
            $table->string('nome'); // Nome da empresa (VARCHAR)
            $table->string('email')->unique(); // Email único - Regra: cada cliente tem email único
            $table->string('telefone')->nullable(); // Telefone opcional
            $table->boolean('ativo')->default(true); // Status ativo/inativo (padrão = true)
            $table->timestamps(); // created_at e updated_at (TIMESTAMP)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
