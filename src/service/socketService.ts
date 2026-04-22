import io from "socket.io-client";
import { createToastInterface } from "vue-toastification";
import type { SocketAuthenticatedPayload, SocketNotification } from "@/typeModules/useModules";

type NotificationListener = (payload: SocketNotification) => void | Promise<void>;

const toast = createToastInterface();

class SocketService {
    private socket: SocketIOClient.Socket | null = null;
    private token: string | null = null;
    private listeners = new Set<NotificationListener>();
    private isAuthenticated = false;

    private isSocketEnabled() {
        return String(import.meta.env.VITE_ENABLE_SOCKET || "").trim().toLowerCase() === "true";
    }

    private resolveSocketBaseUrl() {
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
            transports: ["websocket"],
            withCredentials: true,
            autoConnect: false,
            reconnectionAttempts: 3,
            timeout: 10000,
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

        this.socket.on("connect_error", (_error: any) => {
            this.isAuthenticated = false;
        });

        this.socket.on("notification", async (payload: SocketNotification) => {
            const title = payload.title?.trim();
            const message = payload.message?.trim();

            toast.info(title ? `${title}${message ? `: ${message}` : ""}` : (message || "Yangi xabar bor."));

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
