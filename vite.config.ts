// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       // The manifest is your app's "business card" for the browser
//       manifest: {
//         name: 'Paynvo',
//         short_name: 'Paynvo',
//         description: 'Simple, private, and offline-first invoicing for modern freelancers and small businesses.',
//         theme_color: '#ffffff', // For light mode
//         background_color: '#ffffff',
//         display: 'standalone',
//         scope: '/',
//         start_url: '/',
//         icons: [
//           {
//             src: 'logo192.png', // Path relative to the public folder
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: 'logo512.png', // Path relative to the public folder
//             sizes: '512x512',
//             type: 'image/png'
//           }
//         ]
//       }
//     })
//   ],
// })




import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
