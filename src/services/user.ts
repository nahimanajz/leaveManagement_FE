import { Employee } from "@/types/leaveTypes";
import axiosInstance from "./axiosInterceptor";
import { AdmindminOrManagerSignup } from '@/types';

export const saveUser = async (userData: Employee) => {
    const response = await axiosInstance.post("/users/auth/signup", userData);
    console.log("User saved successfully:", response.data);
    return response.data; 
  };

  export const adminSignin = async ( data:{email: string, password:string}) => { 
    try {
      const response = await axiosInstance.post(`/users/auth/signin`, data);
      return response.data;
    } catch (error) {
      console.error("Admin sign-in failed:", error);
      throw error;
    }
  }

  export const adminSignup= async ( data: AdmindminOrManagerSignup) => { 
    try {
      const response = await axiosInstance.post(`/users/auth/admin-or-manager/signup`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Admin sign-in failed:", error);
      throw error;
    }
  }

  
  export const getAllUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  };