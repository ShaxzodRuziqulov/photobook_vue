/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_API: string
    readonly VITE_ENABLE_SOCKET?: string
    /**
     * Bo'sh bo'lsa: production build da VITE_BASE_API dan origin;
     * `npm run dev` da — window.location.origin (Vite /socket.io proxy).
     */
    readonly VITE_SOCKET_BASE_URL?: string
    /** "true" bo'lsa: pollingdan keyin WebSocket upgrade (Railway WSS tuzatilgach). Default: faqat polling. */
    readonly VITE_SOCKET_WS_UPGRADE?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

