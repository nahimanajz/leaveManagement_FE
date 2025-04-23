import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationsAsRead } from "@/services/notifications";
import { getUserSession } from "@/utils";

const Notifications: React.FC = () => {
  const user  = getUserSession(); 
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user.id],
    queryFn: () => getNotifications(user.id),
  });

  // Mutation to mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: () => markNotificationsAsRead(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["notifications", user.id]}); // Refetch notifications
    },
  });

  // Mark notifications as read when the page loads
  useEffect(() => {
    markAsReadMutation.mutate();
  }, []);

  if (isLoading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <h2 className="font-semibold">{notification.title}</h2>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
};

export default Notifications;