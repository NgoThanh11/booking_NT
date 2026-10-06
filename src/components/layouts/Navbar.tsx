import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";

import styles from "../../assets/styles/Navar.module.scss";
import logoImage from "../../assets/images/smile.png";

import { logoutApi } from "../../api/LoginApi";

export default function Navbar() {
  const navigation = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy thông tin user khi Navbar được render
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Click ra ngoài dropdown -> đóng
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setUser(null);
      setIsDropdownOpen(false);

      navigation("/login");
    }
  };

  // Tên hiển thị
  const displayName = user?.fullName || user?.username || "Khách hàng";

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logoImage} alt="Smile BarberShop" />
        </Link>

        {/* Menu */}
        <ul className={styles.menu}>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>

          <li>
            <Link to="/HairCut">Dịch vụ</Link>
          </li>

          <li>
            <Link to="/Booking">Đặt lịch</Link>
          </li>

          {/* <li>
            <Link to="/history">Lịch hẹn</Link>
          </li> */}

          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>

        {/* Actions */}
        <div className={styles.actions}>
          {!user ? (
            // Chưa đăng nhập
            <button
              className={styles.loginBtn}
              onClick={() => navigation("/login")}
            >
              Đăng nhập
            </button>
          ) : (
            // Đã đăng nhập
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button
                className={styles.userBtn}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={styles.userIcon}>
                  <FiUser />
                </span>

                <span className={styles.userName}>{displayName}</span>

                <FiChevronDown
                  className={`${styles.arrow} ${
                    isDropdownOpen ? styles.arrowOpen : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {/* Thông tin khách hàng */}
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigation("/profile");
                    }}
                  >
                    <FiUser />
                    <span>Thông tin khách hàng</span>
                  </button>

                  <div className={styles.divider} />

                  {/* Logout */}
                  <button
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
          {user?.role === "Admin" ? (
            <button
              className={styles.loginBtn}
              onClick={() => navigation("/admin")}
            >
              Trang quản trị
            </button>
          ) : (
            <div></div>
          )}
        </div>

        {/* Mobile */}
        <button className={styles.menuBtn}>
          <FiMenu />
        </button>
      </div>
    </nav>
  );
}
