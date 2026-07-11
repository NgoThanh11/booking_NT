import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import HairMan from "../pages/HairMan";
import Booking from "../pages/Booking";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/HairCut" element={<HairMan />} />
                {/* Đặt lịch cắt tóc */}
                <Route path="/Booking" element={<Booking />} />
            </Route>
        </Routes>
    );
}