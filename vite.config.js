import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType:'autoUpdate',
      manifest:{
        name:'Carrito-db',
        short_name:'Carrito-db',
        description:'Carrito de compras con base de datos',
        theme_color:'#ffffff',
        background_color:'#ffffff',
        display:'standalone',
        icons:[
          {
            src:'/icons/icon-192x192.png',
            sizes:'192x192',
            type:'image/png'
          },
          {
            src:'/icons/icon-512x512.png',
            sizes:'512x512',
            type:'image/png'
          }
        ]
      }
    })
  ],
})
