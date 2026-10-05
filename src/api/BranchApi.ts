import axiosClient from "../../src/api/axios";
//Danh sách chi nhánh
export const getAllBranches = async (page: number= 1, pageSize: number= 10) => {
  const response = await axiosClient.get("/Branches", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
};
//Chi tiết chi nhánh
export const getBranchById = async (id: number) => {
  const response = await axiosClient.get(`/Branches/detail-branch?id=${id}`);
  return response.data;
};
//Thêm chi nhánh
export const createBranch = async (data: any) => {
  const response = await axiosClient.post("/Branches", data);
  return response.data;
};
//Cập nhật chi nhánh
export const updateBranch = async (id: number, data: any) => {
  const response = await axiosClient.put(
    `/Branches/update-branch?id=${id}`,
    data,
  );
  return response.data;
};
//Xóa chi nahsnh
export const deleteBranch = async (id: number) => {
  const response = await axiosClient.delete(`/Branches/delete-branch?id=${id}`);
  return response.data;
};
