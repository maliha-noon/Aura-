<?php

namespace App\Http\Controllers;

use App\Services\AttendanceService;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    protected $attendanceService;

    // Inject AttendanceService via constructor (Dependency Injection)
    // Laravel automatically resolves and passes the service instance
    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    // Returns the currently active session (e.g. an ongoing class/event session).
    // Returns a 200 with success:false if no active session exists.
    public function getSession(Request $request)
    {
        $session = $this->attendanceService->getSession();
        if ($session) {
            return response()->json(['success' => true] + $session->toArray());
        }
        else {
            return response()->json([
                'success' => false,
                'message' => 'No active session found',
            ], 200);
        }
    }

    // Creates a new session with a name and duration.
    // Delegates the creation logic to AttendanceService.
    public function createSession(Request $request)
    {
        $sessionData = $request->validate([
            'name' => 'required|string',
            'duration' => 'required|integer', // duration in minutes
        ]);

        $session = $this->attendanceService->createSession($sessionData);

        return response()->json([
            'success' => true,
            'session' => $session,
            'message' => 'Session created successfully',
        ]);
    }

    // Activates or deactivates a session by toggling its 'active' status.
    public function updateSession(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|integer',
            'active' => 'required|boolean', // true = active, false = closed
        ]);

        $session = $this->attendanceService->updateSessionStatus($validated['session_id'], $validated['active']);

        return response()->json([
            'success' => true,
            'message' => 'Session updated successfully.',
            'session' => $session,
        ]);
    }

    // Returns all sessions ever created — used by admin for overview.
    public function viewSessions(Request $request)
    {
        $sessions = $this->attendanceService->getAllSessions();

        return response()->json([
            'success' => true,
            'sessions' => $sessions,
        ]);
    }

    // Records attendance for a student using their roll number.
    // Delegates to AttendanceService which handles the DB logic.
    public function submitAttendance(Request $request)
    {
        $data = $request->validate([
            'roll' => 'required|int', // student roll number
        ]);

        $attendance = $this->attendanceService->submitAttendance($data['roll']);

        return response()->json([
            'success' => true,
            'attendance' => $attendance,
            'message' => 'Attendance submitted successfully',
        ]);
    }
}
