<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    public function index()
    {
        $contents = \App\Models\SiteContent::all();
        return response()->json($contents);
    }

    public function update(Request $request)
    {
        $request->validate([
            'section' => 'required|string',
            'key' => 'required|string',
            'value' => 'required|string',
        ]);

        $content = \App\Models\SiteContent::updateOrCreate(
            [
                'section' => $request->section,
                'content_key' => $request->key,
            ],
            [
                'content_value' => $request->value,
            ]
        );

        return response()->json(['success' => true, 'data' => $content]);
    }

    public function init(Request $request)
    {
        $data = $request->validate([
            'contents' => 'required|array',
            'contents.*.section' => 'required|string',
            'contents.*.content_key' => 'required|string',
            'contents.*.content_value' => 'required|string',
        ]);

        foreach ($data['contents'] as $item) {
            \App\Models\SiteContent::updateOrCreate(
                [
                    'section' => $item['section'],
                    'content_key' => $item['content_key'],
                ],
                [
                    'content_value' => $item['content_value'],
                ]
            );
        }

        return response()->json(['success' => true]);
    }
}
