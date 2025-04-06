<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('students');
})->name("index");

Route::get('/students', function () {
    return redirect()->route('index');
});

Route::get('/dashboard', function () {
    return view('dashboard');
});

Route::get('/tasks', function () {
    return view('tasks');
});

Route::get('/messages', function () {
    return view('messages');
});

Route::get('/profile', function () {
    return view('profile');
});
