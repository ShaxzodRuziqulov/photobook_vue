import type { NotificationType } from "@/typeModules/useModules";

export const notificationTypeOptions: { value: NotificationType; text: string }[] = [
    { value: "ORDER_ASSIGNED", text: "Biriktirilgan" },
    { value: "TASK_ACTIVATED", text: "Ish navbati" },
    { value: "ORDER_UPDATED", text: "Buyurtma yangilangan" },
    { value: "ORDER_STATUS_CHANGED", text: "Holat o'zgardi" },
];

export const notificationTypeConfig: Record<NotificationType, { label: string }> = {
    ORDER_ASSIGNED: {
        label: "Biriktirilgan",
    },
    TASK_ACTIVATED: {
        label: "Ish navbati",
    },
    ORDER_UPDATED: {
        label: "Yangilangan",
    },
    ORDER_STATUS_CHANGED: {
        label: "Holat o'zgardi",
    },
};
