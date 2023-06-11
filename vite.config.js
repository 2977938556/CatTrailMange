import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8848,
    host: true,
  },

  // 配置@符号src
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // 配置css
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
              @import "@/assets/styles/default.less";
            `,
      },
    },
  },
})
