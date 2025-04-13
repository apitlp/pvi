<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    private const int PER_PAGE = 5;

    public function showStudentsPage()
    {
        return view('students');
    }

    public function getPage(Request $request)
    {
        if (!Auth::check())
            return response()->json([
                'status' => 'unauthenticated',
            ], 401);

        $page = (int)$request->input('page');
        $lastPage = self::getLastPageNumber();

        $page = ($page <= 0) ? 1 : (($page > $lastPage) ? $lastPage : $page);

        $students = Student::query()
            ->where('created_by', Auth::id())
            ->paginate(self::PER_PAGE, ['*'], 'page', $page);

        return response()->json([
            'status' => 'success',
            'students' => $students
        ]);
    }

    public function add(Request $request)
    {
        if (!Auth::check())
            return response()->json([
                'status' => 'unauthenticated',
            ], 401);

        $validator = Validator::make($request->all(),
        [
            'group' => ['required', 'regex:/^PZ-2[1-6]$/'],
            'first_name' => ['required', 'regex:/^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/'],
            'last_name' => ['required', 'regex:/^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/'],
            'gender' => ['required', 'regex:/^[MF]$/'],
            'birthday' => [
                'required',
                'date',
                Rule::date()->afterOrEqual('1995-01-01'),
                Rule::date()->before('2010-01-01')
            ]
        ]);

        if ($validator->fails())
            return response()->json([
                'status' => 'failure',
                'errors' => $validator->errors()
            ], 422);

        $existingStudent = Student::where('first_name', $request->first_name)
            ->where('last_name', $request->last_name)
            ->where('created_by', Auth::id())
            ->first();

        if ($existingStudent)
            return response()->json([
                'status' => 'failure',
                'errors' => [
                    'duplicate' => 'A student with such a name already exists',
                ],
            ], 422);

        $student = Student::create([
            'group' => $request->group,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'gender' => $request->gender,
            'birthday' => $request->birthday,
            'created_by' => Auth::id()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Student successfully added',
            'last_page' => self::getLastPageNumber(),
            'student' => $student
        ]);
    }

    public function edit(Request $request, $id)
    {
        if (!Auth::check())
            return response()->json([
                'status' => 'unauthenticated',
            ], 401);

        $student = Student::find($id);

        if (!$student)
            return response()->json([
                'status' => 'error',
                'message' => 'Student not found'
            ], 404);

        $validator = Validator::make($request->all(),
            [
                'group' => ['required', 'regex:/^PZ-2[1-6]$/'],
                'first_name' => ['required', 'regex:/^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/'],
                'last_name' => ['required', 'regex:/^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/'],
                'gender' => ['required', 'regex:/^[MF]$/'],
                'birthday' => [
                    'required',
                    'date',
                    Rule::date()->afterOrEqual('1995-01-01'),
                    Rule::date()->before('2010-01-01')
                ]
            ]);

        if ($validator->fails())
            return response()->json([
                'status' => 'failure',
                'errors' => $validator->errors()
            ], 422);

        $existingStudent = Student::where('first_name', $request->first_name)
            ->where('last_name', $request->last_name)
            ->where('created_by', Auth::id())
            ->first();

        if ($existingStudent)
            return response()->json([
                'status' => 'failure',
                'errors' => [
                    'duplicate' => 'A student with such a name already exists',
                ],
            ], 422);

        $student->update([
            'group' => $request->group,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'gender' => $request->gender,
            'birthday' => $request->birthday,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Student successfully edited',
            'student' => $student
        ]);
    }

    public function remove($id)
    {
        if (!Auth::check())
            return response()->json([
                'status' => 'unauthenticated',
            ], 401);

        $student = Student::find($id);

        if (!$student)
            return response()->json([
                'status' => 'error',
                'message' => 'Student not found'
            ], 404);

        $student->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Student successfully removed',
            'student' => $student,
        ]);
    }

    private function getLastPageNumber()
    {
        $totalStudents = Student::where('created_by', Auth::id())->count();

        return ceil($totalStudents / self::PER_PAGE);
    }
}
