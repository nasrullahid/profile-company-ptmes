<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // To emulate NextJS behavior where files are in public/uploads:
            // e.g. /public/uploads/timestamp-...
            
            $filename = time() . '-' . str_replace(' ', '-', $file->getClientOriginalName());
            
            // Move file to the public/uploads directory
            $file->move(public_path('uploads'), $filename);

            $publicUrl = '/uploads/' . $filename;

            return response()->json([
                'success' => true,
                'url' => $publicUrl
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'No file uploaded'
        ], 400);
    }
}
