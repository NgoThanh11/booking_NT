import styles from "../../components/loading/loading.module.scss";
import logo from "../../assets/images/smile.png";

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.content}>
        <img
          src={logo}
          alt="Loading"
          className={styles.logo}
        />

        <div className={styles.spinner}></div>

        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}