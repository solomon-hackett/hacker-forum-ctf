import { fetchNotifications } from "@/app/lib/data";

import NotificationTrayClient from "./notification-tray-client";

export default async function NotificationTray({ id }: { id: string }) {
  const notifications = await fetchNotifications(id);

  return <NotificationTrayClient notifications={notifications} id={id} />;
}
