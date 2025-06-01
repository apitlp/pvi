<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('/students/add', [StudentController::class, 'add']);

    Route::put('/students/edit/{id}', [StudentController::class, 'edit']);

    Route::delete('/students/remove/{id}', [StudentController::class, 'remove']);

    Route::get('/students', [StudentController::class, 'getPage']);
});

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('/chat/verify-token', [ChatController::class, 'verifyToken']);
    Route::get('/chat/get_user/{id}', [ChatController::class, 'getUserById']);
    Route::get('/chat/search-users', [ChatController::class, 'searchUsers']);
});
