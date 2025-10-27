import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
    root: 'src',
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [
        react()
    ],
    server: {
        port: 3001
    },
    build: {
        outDir: path.resolve(__dirname, 'build'),
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'),
                preview: path.resolve(__dirname, 'src/preview.html')
            }
        }
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
});