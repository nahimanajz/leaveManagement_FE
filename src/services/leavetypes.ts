import { LeaveType } from "@/types/leaveTypes";
import axiosInstance from "./axiosInterceptor";

// Get all leave types (accessible to all users)
export const getAllLeaveTypes = async (): Promise<LeaveType[]> => {
  const response = await axiosInstance.get("/leave-types");
  return response.data;
};

// Get a specific leave type by ID
export const getLeaveTypeById = async (id: string): Promise<LeaveType> => {
  const response = await axiosInstance.get(`/leave-types/${id}`);
  return response.data;
};

// Create a new leave type (restricted to @ist.com users)
export const createLeaveType = async (data: LeaveType): Promise<LeaveType> => {
  const response = await axiosInstance.post("/leave-types", data);
  return response.data;
};

// Update an existing leave type (restricted to @ist.com users)
export const updateLeaveType = async (id: string, data: LeaveType): Promise<LeaveType> => {
  const response = await axiosInstance.put(`/leave-types/${id}`, data);
  return response.data;
};

// Delete a leave type (restricted to @ist.com users)
export const deleteLeaveType = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/leave-types/${id}`);
};