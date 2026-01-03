import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dts from 'vite-plugin-dts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx']
    })
  ],
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactStarter',
      formats: ['es', 'umd'],
      fileName: (format) => `react-starter.${format === 'es' ? 'js' : 'umd.cjs'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          'react-router-dom': 'ReactRouterDOM' // optional but safe

        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || 'assets/[name][extname]';
        }
      }
    }
  }
})
