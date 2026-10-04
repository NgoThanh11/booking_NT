import axiosClient from "../../src/api/axios";

//Thêm mới booking
export const createBooking = async (data: any) => {
  const response = await axiosClient.post("/Booking/create-booking", data);
  return response.data;
};
//Danh sách đặt lịch
export const getAllBooking = async () => {
  const response = await axiosClient.get("/Booking/get-all-booking")
  return response.data;
}
//Chi tiết đặt lịch
export const getDetailBooking = async(id: number) => {
    const response = await axiosClient.get(`Booking/get-booking-detail?id=${id}`);
    return response.data;
} 
//Update trạng thái đặt lịch
export const updateBookingStatus = async (
  id: number,
  status: string
) => {
  const response = await axiosClient.put(
    `/Booking/update-status?id=${id}`,
    status,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};