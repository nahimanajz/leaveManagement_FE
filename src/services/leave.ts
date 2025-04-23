import { ApplyLeaveRequest } from "@/types/leaveTypes";
import axiosInstance from "./axiosInterceptor";
import { LeaveResponse, UpdateLeaveRequest } from "@/types";

export const applyLeave = async (data: ApplyLeaveRequest): Promise<void> => {
    const formData = new FormData();
  
    // Add the leaveRequest as a JSON string
    const leaveRequest = {
      userId: data.userId,
      type: data.type,
      leaveReason: data.leaveReason,
      isFullDay: data.isFullDay,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    formData.append("leaveRequest", new Blob([JSON.stringify(leaveRequest)], { type: "application/json" }));
  
    // Add the document if it exists
    if (data.document) {
      formData.append("document", data.document);
    }
  
    // Send POST request to the backend
    await axiosInstance.post(`/leaves/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the correct Content-Type
      },
    });
  };

  export const getLeavesByUserId = async (userId: string): Promise<LeaveResponse[]> => {
    const response = await axiosInstance.get(`/leaves/user/${userId}`);
    return response.data;
  };
  
  export const getAllLeaves = async (): Promise<LeaveResponse[]> => {
    const response = await axiosInstance.get(`/leaves`);
    return response.data;
  };
  
  export const updateLeave = async (data: UpdateLeaveRequest): Promise<void> => {
   return await axiosInstance.put(`/leaves/${data.id}`, data);
  };