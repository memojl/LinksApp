import { defineConfig } from 'vite'

export default defineConfig({
  /*assetsInclude: ['** /*.html'],*/
  base: './',//Configuar para "spa -> /" para hash "-> ./"
  root: './',
  build: {
    outDir: 'ext',
  },
  publicDir: 'public',
})