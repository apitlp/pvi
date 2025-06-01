<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function verifyToken(Request $request)
    {
        if (Auth::user()->api_token === $request->api_token)
            return response()->json([
                'success' => true,
                'mysql_user_id' => Auth::id()
            ]);

        return response()->json([
            'success' => false,
            'message' => 'Invalid API token'
        ]);
    }

    public function getUserById(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user)
            return response()->json([
                'success' => false,
                'message' => 'Error finding user with id ' . $id
            ]);

        return response()->json([
            'success' => true,
            'user_name' => $user->first_name . " " . $user->last_name,
            'user_is_online' => $user->api_token != null
        ]);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->input('q', '');

        if (empty($query))
            return response()->json([]);

        $currentUserId = Auth::id();
        $idsToExclude = [];

        if ($currentUserId)
            $idsToExclude[] = $currentUserId;

        $clientIdsToExclude = explode(",", $request->input('exclude_ids', ""));
        if (!empty($clientIdsToExclude))
            $idsToExclude = array_merge(
                $idsToExclude,
                array_map('intval', $clientIdsToExclude)
            );
        $idsToExclude = array_unique(array_filter($idsToExclude));

        $usersQuery = User::query()
            ->where(function ($dbQuery) use ($query) {
                $dbQuery->where('first_name', 'LIKE', "%{$query}%")
                    ->orWhere('last_name', 'LIKE', "%{$query}%");
            });

        if (!empty($idsToExclude))
            $usersQuery->whereNotIn('id', $idsToExclude);

        $searchedUsers = $usersQuery
            ->select(['id', 'first_name', 'last_name'])
            ->get();

        $formattedUsers = $searchedUsers->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . " " . $user->last_name
            ];
        });

        return response()->json($formattedUsers);
    }
}
