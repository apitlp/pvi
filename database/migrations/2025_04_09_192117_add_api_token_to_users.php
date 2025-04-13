<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token', 80)
                ->after('password')
                ->unique()
                ->nullable()
                ->default(null);
        });

        foreach (User::all() as $user)
        {
            $user->api_token = Str::random(60);
            $user->save();
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('api_token');
        });
    }
};
