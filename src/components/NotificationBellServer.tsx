import { getCurrentUserId } from "@/lib/auth";
import { getAllNotifications, getUnreadCount } from "@/db/queries/budget-alerts";
import { NotificationBell } from "./NotificationBell";

export async function NotificationBellServer() {
  const userId = await getCurrentUserId();
  const [notifications, unreadCount] = await Promise.all([
    getAllNotifications(userId, 20),
    getUnreadCount(userId),
  ]);

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
    />
  );
}
