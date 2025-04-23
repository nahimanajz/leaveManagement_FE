import axiosInstance from "./axiosInterceptor";

export const fetchTeams = async () => {
    return  (await axiosInstance.get("/teams")).data;
  
};