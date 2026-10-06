import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "../../assets/styles/LayoutAmin.module.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import logoImage from "../../assets/images/smile.png";
import Swal from "sweetalert2";
import { logoutApi } from "../../api/LoginApi";
import { Toaster } from "react-hot-toast";

const menuItems = [
  { path: "/admin", icon: "⌂", label: "Dashboard", end: true },
  { path: "/admin/Booking", icon: "▣", label: "Lịch đặt" },
  { path: "/admin/service", icon: "✂", label: "Dịch vụ" },
  { path: "/admin/barbers", icon: "♙", label: "Barber" },
  { path: "/admin/branch", icon: "⌖", label: "Chi nhánh" },
  { path: "/admin/user", icon: "♟", label: "Khách hàng" },

  { path: "/admin/settings", icon: "⚙", label: "Cài đặt" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  // Lấy thông tin user đã lưu khi đăng nhập
  const userData = localStorage.getItem("user");

  const user = userData ? JSON.parse(userData) : null;

  const fullName = user?.fullName || "Admin";
  const role = user?.role || "Quản trị viên";

  // Lấy chữ cái đầu tên
  const avatar = fullName?.trim()?.charAt(0)?.toUpperCase() || "A";

  // Đăng xuất
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    // Thực hiện gọi API đăng xuất
    try {
      await logoutApi();
    } catch (error) {
      console.error("Lỗi API Logout (vẫn tiến hành xóa session):", error);
    } finally {
      // Luôn luôn xóa Token + User info và chuyển hướng
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Điều hướng và clear state nếu cần
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={styles.admin}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><i className="bi bi-scissors"></i></div>

          <div>
            <Link to="/admin" className={styles.logoAdmin}>
              <img src={logoImage} alt="Smile BarberShop" />
            </Link>
          </div>
        </div>

        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.menuIcon}>{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <button className={styles.logout} onClick={handleLogout}>
          <span>⇥</span>
          Đăng xuất
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div></div>

          <div className={styles.headerRight}>
            {/* USER */}
            <div className={styles.user}>
              <div className={styles.avatar}>{avatar}</div>

              <div>
                <strong style={{ width: 100 }}>{fullName}</strong>

                <span>{role === "Admin" ? "Quản trị viên" : role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
