<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: create_projetos_table
 * 
 * Cria a tabela 'projetos' que armazena contratos/projetos da fábrica.
 * 
 * Colunas:
 * - id: chave primária auto-increment
 * - cliente_id: FK para tabela clientes (Many-to-One: projeto pertence a cliente)
 * - nome: nome do projeto/contrato (obrigatório)
 * - descricao: descrição detalhada (opcional)
 * - data_inicio: data de início (obrigatório, date)
 * - data_fim: data de fim (opcional)
 * - valor_contrato: valor monetário do contrato (decimal, 12 dígitos, 2 casas decimais)
 * - custo_hora_base: custo por hora de trabalho (decimal, 12 dígitos, 2 casas decimais)
 * - status: situação do projeto (string: planejado, em_andamento, pausado, finalizado)
 * - created_at, updated_at: timestamps do Laravel
 * 
 * Restrições:
 * - cliente_id é foreign key constrained: não pode referenciar cliente inexistente
 * - onDelete cascade: ao deletar cliente, todos seus projetos são deletados automaticamente
 * 
 * Relacionamentos:
 * - Muitos projetos pertencem a um cliente (N:1 com tabela clientes)
 * - Um projeto tem muitos lançamentos de horas (1:N com tabela lancamento_horas via projeto_id)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projetos', function (Blueprint $table) {
            $table->id(); // ID primária auto-increment
            
            // Foreign key: projeto pertence a um cliente (Many-to-One)
            // constrained(): valida integridade referencial (não permite cliente_id inexistente)
            // onDelete('cascade'): ao deletar cliente, deleta todos seus projetos
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            
            $table->string('nome'); // Nome do projeto/contrato
            $table->text('descricao')->nullable(); // Descrição detalhada (opcional)
            $table->date('data_inicio'); // Data de início do projeto
            $table->date('data_fim')->nullable(); // Data de fim (opcional, pode ser NULL enquanto em execução)
            $table->decimal('valor_contrato', 12, 2); // Valor total do contrato (até 9999999999.99)
            $table->decimal('custo_hora_base', 12, 2); // Custo por hora base (para cálculo de lucro)
            $table->string('status'); // Status: planejado, em_andamento, pausado, finalizado
            $table->timestamps(); // created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projetos');
    }
};
