import axiosClient from "../../src/api/axios";

export const getAllBranches = async () => {
  const response = await axiosClient.get("/Branches");
  return response.data;
};

export const getBranchById = async (id: number) => {
  const response = await axiosClient.get(`/Branches/${id}`);
  return response.data;
};

export const createBranch = async (data: any) => {
  const response = await axiosClient.post("/Branches", data);
  return response.data;
};

export const updateBranch = async (id: number, data: any) => {
  const response = await axiosClient.put(`/Branches/${id}`, data);
  return response.data;
};

export const deleteBranch = async (id: number) => {
  const response = await axiosClient.delete(`/Branches/${id}`);
  return response.data;
};