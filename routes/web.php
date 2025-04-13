<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Login
Route::get('login', [AuthController::class, 'showLoginForm'])
    ->name('login');

Route::post('login', [AuthController::class, 'login']);

Route::get('logout', [AuthController::class, 'logout'])
    ->name('logout');

// Register
Route::get('register', [AuthController::class, 'showRegisterForm'])
    ->name('register');

Route::post('register', [AuthController::class, 'register']);

// Students
Route::get('/', [StudentController::class, 'showStudentsPage'])
    ->name("index")
    ->middleware('auth');

Route::get('/students', function () {
    return redirect()->route('index');
});

// Other pages

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');

Route::get('/tasks', function () {
    return view('tasks');
})->middleware('auth');

Route::get('/messages', function () {
    return view('messages');
})->middleware('auth');

Route::get('/profile', function () {
    return view('profile');
})->middleware('auth');
