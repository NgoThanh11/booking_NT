import axiosClient from "../../src/api/axios";

export const getAllBarbers = async () => {
  const response = await axiosClient.get("/Barbers");
  return response.data;
};
