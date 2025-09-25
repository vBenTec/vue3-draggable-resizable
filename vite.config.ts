import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, '/src'),
            'vue-draggable-resizable': resolve(__dirname, 'node_modules/vue-draggable-resizable/dist/vue-draggable-resizable.es.js'),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/vue/index.ts'),
            name: 'VueDraggableResizable',
            fileName: 'vue-draggable-resizable',
        },
        // rollupOptions: {
        //     input: {
        //         main: 'index.html'
        //     }
        // }
        // rollupOptions: {
        //     // make sure to externalize deps that shouldn't be bundled
        //     // into your library
        //     external: ['vue'],
        //     output: {
        //         // Provide global variables to use in the UMD build
        //         // for externalized deps
        //         globals: {
        //             vue: 'Vue',
        //         },
        //     },
        // },
    },
})