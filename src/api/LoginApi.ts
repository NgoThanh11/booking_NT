import axiosClient from "./axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    userId: number;
    username: string;
    fullName: string;
    role: string;
  };
}
//login
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post("/Auth/login", data);

  return response.data;
};
//logout
export const logoutApi = async () => {
  const response = await axiosClient.post(
    `/Auth/logout`,
  );
  return response.data;
};
//Đăng ký tài khoản 
export const registerApi = async(data: any) => {
  const response = await axiosClient.post("/Auth/register", data);
  return response.data;
}