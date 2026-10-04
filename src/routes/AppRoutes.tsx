import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import HairMan from "../pages/HairMan";
import Booking from "../pages/Booking";
import AdminLayout from "../pages/admin/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import BookingAdmin from "../pages/admin/Booking/List";
import BookingDetail from "../pages/admin/Booking/DetailBooking";
import ServiceAdmin from "../pages/admin/Service/List";
import ServiceAdd from "../pages/admin/Service/Add";
import ServiceEdit from "../pages/admin/Service/Update";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Giao diện */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/HairCut" element={<HairMan />} />
        {/* Đặt lịch cắt tóc */}
        <Route path="/Booking" element={<Booking />} />
      </Route>

      {/* Quản trị */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        //#region Quản lý đặt lịch
        <Route path="Booking" element={<BookingAdmin/>} />
        <Route path="Booking/:id" element={<BookingDetail/>} />
        //#endregion
        <Route path="barbers" element={<div>Barber</div>} />
        <Route path="branches" element={<div>Chi nhánh</div>} />
        <Route path="customers" element={<div>Khách hàng</div>} />
        //#region Quản lý dịch vụ
        <Route path="service" element={<ServiceAdmin/>} />
        <Route path="service/add" element={<ServiceAdd/>} />
        <Route path="service/update/:id" element={<ServiceEdit/>} />
        //#endregion
        <Route path="settings" element={<div>Cài đặt</div>} />
      </Route>
    </Routes>
  );
}
