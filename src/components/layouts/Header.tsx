import { FiMail, FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/Header.module.scss";


export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left */}
        <div className={styles.contact}>
          <span>
            <FiPhoneCall />
            0988668888
          </span>

          <span>
            <FiMail />
            SmileT@gmail.com
          </span>
        </div>

        {/* Right */}
        <div className={styles.link}>
          <Link to="/support">Hỗ trợ</Link>

          <Link to="/contact">Liên hệ</Link>
        </div>
      </div>
    </header>
  );
}