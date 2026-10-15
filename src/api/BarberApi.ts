import axiosClient from "../../src/api/axios";
//Danh sách barber
export const getAllBarbers = async () => {
  const response = await axiosClient.get("/Barbers/get-all-baber");
  return response.data;
};
//Chi tiết barber
export const getByIdBarber = async (id: number) => {
  const response = await axiosClient.get(`/Barbers/get-by-id-baber?id=${id}`);
  return response.data;
};
//Xóa barber
export const deleteBarber = async (id: number) => {
  const response = await axiosClient.delete(`/Barbers/delete-baber?id=${id}`);
  return response.data;
};
//sửa barber
export const updateBarber = async (id: number, data: any) => {
  const response = await axiosClient.put(`/Barbers/update-baber?id=${id}`, data);
  return response.data;
};
//Thêm barber
export const createBarber = async (data: any) => {
  const response = await axiosClient.post(`/Barbers/create-baber`, data);
  return response.data;
};
