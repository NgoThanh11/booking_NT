import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import styles from "../../assets/styles/Navar.module.scss";
import logoImage from "../../assets/images/smile.png";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src= {logoImage} alt="Smile BarberShop" />
        </Link>

        {/* Menu */}
        <ul className={styles.menu}>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>

          <li>
            <Link to="/services">Dịch vụ</Link>
          </li>

          <li>
            <Link to="/booking">Đặt lịch</Link>
          </li>

          <li>
            <Link to="/history">Lịch hẹn</Link>
          </li>

          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>

        {/* Button */}
        <div className={styles.actions}>
          <button className={styles.loginBtn}>
            Đăng nhập
          </button>

          <button className={styles.bookingBtn}>
            Đặt lịch ngay
          </button>
        </div>

        {/* Mobile */}
        <button className={styles.menuBtn}>
          <FiMenu />
        </button>
      </div>
    </nav>
  );
}