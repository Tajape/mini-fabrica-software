<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\LancamentoHoraController;
use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::apiResource('lancamentos', LancamentoHoraController::class);

Route::apiResource('projetos', ProjetoController::class);

// Rota padrão do Laravel (pode deixar ela aí)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// A SUA ROTA: Aqui é onde a mágica acontece para o CRUD de clientes
Route::apiResource('clientes', ClienteController::class);