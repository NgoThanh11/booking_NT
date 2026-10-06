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
import BranchAdmin from "../pages/admin/Branch/list";
import BranchDetail from "../pages/admin/Branch/detail";
import BranchAdd from "../pages/admin/Branch/add";
import BranchUpdate from "../pages/admin/Branch/update";
import Login from "../pages/Auth/login";
import ProtectedRoute from "../pages/Auth/ProtectedRoute";
import AdminRoute from "../pages/Auth/AdminRouter";
import UserAdmin from "../pages/admin/User/list";
import UserAdd from "../pages/admin/User/add";
import UserUpdate from "../pages/admin/User/update";
import UserDetail from "../pages/admin/User/detail";
import ServiceDetail from "../pages/admin/Service/Detail";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Đăng nhập */}
      <Route path="/login" element={<Login />} />
      {/*  */}
      {/* Giao diện */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/HairCut" element={<HairMan />} />
        {/* Đặt lịch cắt tóc */}
        <Route path="/Booking" element={<Booking />} />
      </Route>

      {/* Quản trị */}
      <Route element={<AdminRoute />}>
        {" "}
        // Không cho khách hàng gõ đg dẫn để vào trang admin
        <Route element={<ProtectedRoute />}>
          {" "}
          // Chặn khi ng dùng đăng xuất r back lại vẫn vào đc tk vx đăng nhập
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            //#region Quản lý đặt lịch
            <Route path="Booking" element={<BookingAdmin />} />
            <Route path="Booking/:id" element={<BookingDetail />} />
            //#endregion

            //#region Quản lý user
            <Route path="user" element={<UserAdmin/>} />
            <Route path="user/add" element={<UserAdd/>} />
            <Route path="user/update/:id" element={<UserUpdate/>} />
            <Route path="user/detail/:id" element={<UserDetail/>} />
            //#endregion

            //#region Quản lý dịch vụ
            <Route path="service" element={<ServiceAdmin />} />
            <Route path="service/add" element={<ServiceAdd />} />
            <Route path="service/update/:id" element={<ServiceEdit />} />
            <Route path="service/detail/:id" element={<ServiceDetail />} />
            //#endregion
            
            //#region Quản lý chi nhánh
            <Route path="branch" element={<BranchAdmin />} />
            <Route path="branch/detail/:id" element={<BranchDetail />} />
            <Route path="branch/add" element={<BranchAdd />} />
            <Route path="branch/update/:id" element={<BranchUpdate />} />
            //#endregion
       
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
