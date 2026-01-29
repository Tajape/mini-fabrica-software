<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: create_lancamento_horas_table
 * 
 * Cria a tabela 'lancamento_horas' que armazena registros de horas trabalhadas por projeto.
 * 
 * Colunas:
 * - id: chave primária auto-increment
 * - projeto_id: FK para tabela projetos (Many-to-One: lançamento pertence a projeto)
 * - colaborador: nome do colaborador que executou o trabalho
 * - data: data em que as horas foram trabalhadas (date)
 * - horas: quantidade de horas (decimal: permite 8.5 horas, por exemplo)
 * - tipo: classificação do tipo de trabalho (corretiva, evolutiva, implantação, legislativa)
 * - descricao: descrição detalhada do trabalho realizado (opcional)
 * - created_at, updated_at: timestamps do Laravel
 * 
 * Restrições:
 * - projeto_id é foreign key constrained: não pode referenciar projeto inexistente
 * - onDelete cascade: ao deletar projeto, todos seus lançamentos são deletados automaticamente
 * 
 * Relacionamentos:
 * - Muitos lançamentos pertencem a um projeto (N:1 com tabela projetos)
 * 
 * Uso:
 * - Cada linha registra quanto tempo um colaborador gastou em uma data específica em um projeto
 * - Usado para calcular: horas totais, custo total, margem de lucro, break-even
 * - Filtrado por projeto_id e intervalo de datas para análise em dashboard
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lancamento_horas', function (Blueprint $table) {
            $table->id(); // ID primária auto-increment
            
            // Foreign key: lançamento pertence a um projeto (Many-to-One)
            // constrained(): valida integridade referencial (não permite projeto_id inexistente)
            // onDelete('cascade'): ao deletar projeto, deleta todos seus lançamentos
            $table->foreignId('projeto_id')->constrained('projetos')->onDelete('cascade');
            
            $table->string('colaborador'); // Nome do colaborador que executou o trabalho
            $table->date('data'); // Data em que as horas foram trabalhadas
            $table->decimal('horas', 8, 2); // Quantidade de horas (pode ser 8.5, 4.25, etc)
            $table->string('tipo'); // Tipo: corretiva, evolutiva, implantacao, legislativa
            $table->text('descricao')->nullable(); // Descrição detalhada (opcional)
            $table->timestamps(); // created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lancamento_horas');
    }
};
