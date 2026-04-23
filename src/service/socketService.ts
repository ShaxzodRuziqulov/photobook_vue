import { io, type Socket } from "socket.io-client";
import { createToastInterface } from "vue-toastification";
import type { SocketAuthenticatedPayload, SocketNotification } from "@/typeModules/useModules";

type NotificationListener = (payload: SocketNotification) => void | Promise<void>;

const toast = createToastInterface();

class SocketService {
    private socket: Socket | null = null;
    private token: string | null = null;
    private listeners = new Set<NotificationListener>();
    private isAuthenticated = false;

    private isSocketEnabled() {
        return String(import.meta.env.VITE_ENABLE_SOCKET || "").trim().toLowerCase() === "true";
    }

    /** API originidan ajratilgan socket bazasi (masalan http://host:9091). */
    private resolveSocketBaseUrl() {
        const explicit = String(import.meta.env.VITE_SOCKET_BASE_URL || "").trim();
        if (explicit) {
            return explicit.replace(/\/$/, "");
        }

        // Vite dev: socket ni sahifa originiga ulash — vite.config.ts dagi /socket.io proxy backend ga uzatadi.
        // Backend CORS da takrorlanuvchi Access-Control-Allow-Origin bo'lsa ham ishlaydi.
        if (import.meta.env.DEV) {
            return window.location.origin;
        }

        const baseApi = String(import.meta.env.VITE_BASE_API || "").trim();

        if (!baseApi) {
            return window.location.origin;
        }

        return baseApi.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    }

    private createSocket() {
        if (this.socket) return this.socket;

        this.socket = io(this.resolveSocketBaseUrl(), {
            path: "/socket.io/",
            // Dev + Vite: WS upgrade ko'pincha ishlamaydi va konsolni spam qiladi — faqat long-polling.
            // Production: backend bilan to'g'ridan-to'g'ri — avval WebSocket.
            transports: import.meta.env.DEV ? ["polling"] : ["websocket", "polling"],
            withCredentials: true,
            autoConnect: false,
            reconnectionAttempts: 10,
            reconnectionDelay: 1500,
            timeout: 20000,
        });

        this.socket.on("connect", () => {
            this.isAuthenticated = false;

            if (this.token) {
                this.socket?.emit("authenticate", { token: this.token });
            }
        });

        this.socket.on("authenticated", (_payload: SocketAuthenticatedPayload) => {
            this.isAuthenticated = true;
        });

        this.socket.on("auth_error", (payload?: { message?: string }) => {
            this.isAuthenticated = false;
            toast.error(payload?.message?.trim() || "Realtime ulanish autentifikatsiyadan o'tmadi.");
        });

        this.socket.on("connect_error", (error: Error) => {
            this.isAuthenticated = false;
            if (import.meta.env.DEV) {
                console.warn("[socket] connect_error:", error?.message || error);
            }
        });

        this.socket.on("notification", async (payload: SocketNotification) => {
            await Promise.allSettled(
                Array.from(this.listeners).map(listener => listener(payload))
            );
        });

        return this.socket;
    }

    connect(token: string) {
        if (!token || !this.isSocketEnabled()) return;

        this.token = token;

        const socket = this.createSocket();

        if (!socket.connected) {
            socket.connect();
            return;
        }

        if (!this.isAuthenticated) {
            socket.emit("authenticate", { token });
        }
    }

    disconnect() {
        this.token = null;
        this.isAuthenticated = false;

        if (!this.socket) return;

        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
    }

    subscribe(listener: NotificationListener) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }
}

export const socketService = new SocketService();
