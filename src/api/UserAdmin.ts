import axiosClient from "./axios";
//Danh sách chi nhánh
export const getAllUsers = async (page: number= 1, pageSize: number= 10) => {
  const response = await axiosClient.get("/Users/get-all-user", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
};
//Chi tiết chi nhánh
export const getUserById = async (id: number) => {
  const response = await axiosClient.get(`/Users/get-id-user?id=${id}`);
  return response.data;
};
//Thêm chi nhánh
export const createUser = async (data: any) => {
  const response = await axiosClient.post("/Users/create-user", data);
  return response.data;
};
//Cập nhật chi nhánh
export const updateUser = async (id: number, data: any) => {
  const response = await axiosClient.put(
    `/Users/update-user?id=${id}`,
    data,
  );
  return response.data;
};
//Xóa chi nhánh
export const deleteUser = async (id: number) => {
  const response = await axiosClient.delete(`/Users/delete-user?id=${id}`);
  return response.data;
};
