<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Temporary File Upload Configuration
    |--------------------------------------------------------------------------
    |
    | Livewire handles file uploads by temporarily storing uploaded files
    | until the form is submitted. Here you can configure the disk, rules, etc.
    |
    */

    'temporary_file_upload' => [
        'disk' => null,        // Default is local
        'rules' => ['required', 'file', 'max:51200'], // 50MB max upload
        'directory' => null,   // Default is livewire-tmp
        'middleware' => null,  // Default is throttle:60,1
        'preview_mimes' => [   // Supported mimes for preview
            'png', 'gif', 'bmp', 'svg', 'wav', 'mp4',
            'mov', 'avi', 'wmv', 'mp3', 'm4a',
            'jpeg', 'mpga', 'webp', 'wma',
        ],
        'max_upload_time' => 5, // 5 minutes
    ],

];
