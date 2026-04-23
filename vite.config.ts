import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const backendOriginForProxy = (raw: string) => {
    const u = String(raw || "").trim()
    if (!u) return "http://localhost:9091"
    return u.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "")
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "")
    const socketProxyTarget = backendOriginForProxy(env.VITE_BASE_API)

    return {
        plugins: [
            vue(),
            tailwindcss()
        ],

        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            }
        },
        server: {
            proxy: {
                "/api": {
                    target: env.VITE_BASE_API,
                    changeOrigin: true,
                    secure: true,
                },
                // Socket.io: brauzerdan to'g'ridan-to'g'ri backend ga CORS (masalan takrorlanuvchi Allow-Origin) xatolik bersa,
                // dev da bir xil origin orqali proxylanadi.
                "/socket.io": {
                    target: socketProxyTarget,
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
        preview: {
            allowedHosts: true
        }
    }
})
