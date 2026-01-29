<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\LancamentoHoraController;
use App\Http\Controllers\DashboardController;

/**
 * ROTAS DE API
 * 
 * Todas as rotas retornam JSON e implementam padrão REST.
 * apiResource() cria automaticamente as rotas CRUD:
 * - GET /{resource} -> index (listagem)
 * - POST /{resource} -> store (criar)
 * - GET /{resource}/{id} -> show (visualizar um)
 * - PUT /{resource}/{id} -> update (atualizar)
 * - DELETE /{resource}/{id} -> destroy (deletar)
 */

// Dashboard: calcula KPIs e métricas financeiras do projeto
// GET /dashboard?projeto_id=1&data_inicio=2025-01-01&data_fim=2025-01-31
Route::get('/dashboard', [DashboardController::class, 'index']);

// CRUD de Lançamentos de Horas
// GET /lancamentos, POST /lancamentos, GET /lancamentos/{id}, PUT /lancamentos/{id}, DELETE /lancamentos/{id}
Route::apiResource('lancamentos', LancamentoHoraController::class);

// CRUD de Projetos
// GET /projetos, POST /projetos, GET /projetos/{id}, PUT /projetos/{id}, DELETE /projetos/{id}
Route::apiResource('projetos', ProjetoController::class);

// Rota padrão do Laravel Sanctum: retorna usuário autenticado
// GET /user com middleware auth:sanctum
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// CRUD de Clientes
// GET /clientes, POST /clientes, GET /clientes/{id}, PUT /clientes/{id}, DELETE /clientes/{id}
// Suporta filtro: GET /clientes?search=termo (busca por nome ou email)
Route::apiResource('clientes', ClienteController::class);