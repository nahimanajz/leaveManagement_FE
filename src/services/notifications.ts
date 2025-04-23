import { NotificationResponse } from "@/types/leaveTypes";
import axiosInstance from "./axiosInterceptor";

export const getNotifications = async (userId: string) => {
  const response = await axiosInstance.get(`/notifications/${userId}`);
  return response.data;
};
export const getAllNotifications = async ():Promise<NotificationResponse[]> => {
  const response = await axiosInstance.get(`/notifications`);
  return response.data;
};

export const markNotificationsAsRead = async (userId: string) => {
  const response = await axiosInstance.put(`/notifications/${userId}/mark-as-read`);
  return response.data;
};