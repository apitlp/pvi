import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/header.css',
                'resources/css/side-menu.css',
                'resources/css/students.css',
                'resources/js/app.js',
                'resources/js/header.js',
                'resources/js/sideMenu.js',
                'resources/js/students.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
