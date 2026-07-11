import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import styles from "../../assets/styles/Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.item}>
          <h2>Barber Booking</h2>

          <p>
            Đặt lịch cắt tóc nhanh chóng với đội ngũ Barber chuyên nghiệp.
            Chỉ vài thao tác là bạn đã có lịch hẹn phù hợp.
          </p>
        </div>

        {/* Dịch vụ */}
        <div className={styles.item}>
          <h3>Dịch vụ</h3>

          <ul>
            <li>Cắt tóc nam</li>
            <li>Cạo râu</li>
            <li>Uốn tóc</li>
            <li>Nhuộm tóc</li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className={styles.item}>
          <h3>Liên hệ</h3>

          <ul>
            <li>
              <FiPhone />
              <span>0398666666</span>
            </li>

            <li>
              <FiMail />
              <span>barber@gmail.com</span>
            </li>

            <li>
              <FiMapPin />
              <span>Hà Nội, Việt Nam</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className={styles.item}>
          <h3>Theo dõi</h3>

          <div className={styles.social}>
            <button>
              <FiFacebook />
            </button>

            <button>
              <FiInstagram />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.copyRight}>
        © 2026 Barber Booking. All Rights Reserved.
      </div>
    </footer>
  );
}