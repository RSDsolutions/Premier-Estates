import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'stripe-vendor': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          'maps-vendor': ['@vis.gl/react-google-maps'],
          'zustand-vendor': ['zustand']
        }
      }
    }
  }
})
