import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/Course_Evaluation/', // GitHub Pages 部署路徑
    build: {
        outDir: 'dist',
        sourcemap: false
    }
})
