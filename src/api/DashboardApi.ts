import axiosClient from "./axios";

export const dashboardApi = async() => {
    const response = await axiosClient.get("/Dashboard");
    return response.data;
}