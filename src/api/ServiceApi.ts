import axiosClient from "../../src/api/axios";
//Danh sách dịch vụ
export const GetAllServices = async () => {
  const response = await axiosClient.get("/Services");
  return response.data;
};
//Chi tiết
export const GetServiceDetail = async (id: number) => {
  const response = await axiosClient.get(
    `/Services/get-service-detail?id=${id}`,
  );
  return response.data;
};

//Xóa dịch vụ
export const deleteService = async (id: number) => {
  const response = await axiosClient.delete(
    `/Services/delete-service?id=${id}`,
  );
  return response.data;
};
//Lấy danh sách ảnh
export const GetServiceImages = async () => {
  const response = await axiosClient.get("/Services/get-service-images");

  return response.data;
};
//Thêm mới dịch vụ
export const CreateService = async (data: {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  url: string;
  status: boolean;
}) => {
  const response = await axiosClient.post("/Services/create-service", data);

  return response.data;
};

//Cập nhật  dịch vụ
export const UpdateService = async (
  id: number,
  data: {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    url: string;
    status: boolean;
  },
) => {
  const response = await axiosClient.put(
    `/Services/update-service?id=${id}`,
    data,
  );

  return response.data;
};
