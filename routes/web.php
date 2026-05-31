<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'index');
Route::view('/index.html', 'index');

Route::prefix('pages')->group(function () {
    Route::view('/interes_compuesto.html', 'pages.interes_compuesto');
    Route::view('/cambio_de_tasa.html', 'pages.cambio_de_tasa');
    Route::view('/equivalencia.html', 'pages.equivalencia');
    Route::view('/anualidad_vencida.html', 'pages.anualidad_vencida');
    Route::view('/anualidad_anticipada.html', 'pages.anualidad_anticipada');
    Route::view('/anualidad_diferida.html', 'pages.anualidad_diferida');
    Route::view('/anualidad_perpetua.html', 'pages.anualidad_perpetua');
    Route::view('/amortizacion.html', 'pages.amortizacion');
    Route::view('/capitalizacion.html', 'pages.capitalizacion');
    Route::view('/ecuacion_valor.html', 'pages.ecuacion_valor');
    Route::view('/tasa_anticipada.html', 'pages.tasa_anticipada');
});
