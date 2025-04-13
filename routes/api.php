<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('/students/add', [StudentController::class, 'add']);

    Route::put('/students/edit/{id}', [StudentController::class, 'edit']);

    Route::delete('/students/remove/{id}', [StudentController::class, 'remove']);

    Route::get('/students', [StudentController::class, 'getPage']);
});
