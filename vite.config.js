import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * MUI + Emotion on Vite: pre-bundle
 * "styled_default is not a function" (cache .vite / thứ tự load module).
 * @see https://github.com/vitejs/vite/issues/12423
 */
const muiOptimizeDeps = [
  '@emotion/react',
  '@emotion/react/jsx-dev-runtime',
  '@emotion/react/jsx-runtime',
  '@emotion/styled',
  '@mui/material',
  '@mui/material/styles',
  '@mui/material/styles/styled',
  '@mui/material/Tooltip',
  '@mui/material/Popper',
  '@mui/material/Select',
  '@mui/material/List',
  '@mui/material/ListItemButton',
  '@mui/material/ListItemText',
  '@mui/icons-material',
  '@mui/styled-engine',
  '@mui/system',
]

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mapbox: ['mapbox-gl'],
        },
      },
    },
  },
  optimizeDeps: {
    include: muiOptimizeDeps,
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
})
