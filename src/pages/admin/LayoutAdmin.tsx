import { NavLink, Outlet } from "react-router-dom";
import styles from "../../assets/styles/LayoutAmin.module.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
const menuItems = [
  { path: "/admin", icon: "⌂", label: "Dashboard", end: true },
  { path: "/admin/Booking", icon: "▣", label: "Lịch đặt" },
  { path: "/admin/service", icon: "✂", label: "Dịch vụ" },
  { path: "/admin/barbers", icon: "♙", label: "Barber" },
  { path: "/admin/branches", icon: "⌖", label: "Chi nhánh" },
  { path: "/admin/customers", icon: "♟", label: "Khách hàng" },
  { path: "/admin/service-images", icon: "▧", label: "Hình ảnh dịch vụ" },
  { path: "/admin/settings", icon: "⚙", label: "Cài đặt" },
];

export default function AdminLayout() {
  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✂</div>

          <div>
            <h2>BARBER SHOP</h2>
            <span>ADMIN PANEL</span>
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

        <button className={styles.logout}>
          <span>⇥</span>
          Đăng xuất
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div >
  
          </div>

          <div className={styles.headerRight}>
            <button className={styles.notification}>
              ♧
              <b>3</b>
            </button>

            <div className={styles.user}>
              <div className={styles.avatar}>A</div>

              <div>
                <strong>Admin</strong>
                <span>Quản trị viên</span>
              </div>

              <span>⌄</span>
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