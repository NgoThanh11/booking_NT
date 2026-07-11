import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";

export default function MainLayout() {
    return (
        <>
            <Header />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <br />
            <Footer />
        </>
    );
}