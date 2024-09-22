import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        watch: {
            usePolling: true,
        },
        hmr: {
            clientPort: 3000,
        },
        host: true, 
        strictPort: true,
        port: 3000, 
    }
})
